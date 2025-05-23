const db = require('../models');
import moment from 'moment';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import doctorService from './doctorService.js';

import { TIME_ZONE, ShiftType, getShiftStartDateTime, getShiftEndDateTime } from '../helper/dateUtils.js';
import * as dateFns from 'date-fns';
import {
    isDoctorOnLeave,
    violatesRestAfterOnCall,
    violatesSameDayWorkAndOnCall,
    getOnCallCountForWeek,
} from '../validation/calendarValidation.js';
import { reject, resolve } from 'bluebird';

// Các hằng số cấu hình
const ON_CALL_SHIFTS_PER_WEEK_MIN = 1;
const ON_CALL_SHIFTS_PER_WEEK_MAX = 2;
const REGULAR_SHIFTS_PER_DAY_REQUIRED = 1;
const ON_CALL_SHIFTS_PER_NIGHT_REQUIRED = 1;
let generateMonthlySchedule = async (month, year, specializationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const monthIndex = month - 1;
            // Sử dụng các hàm date-fns đã import trực tiếp
            const firstDayOfMonth = dateFns.startOfMonth(new Date(year, monthIndex));
            const lastDayOfMonth = dateFns.endOfMonth(new Date(year, monthIndex));
            const daysInMonth = dateFns.eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

            let doctorsInSpecialization = await db.Doctor_User.findAll({
                where: {
                    specializationId: specializationId,
                },
                attributes: ['specializationId'],
                include: {
                    model: db.User,
                    attributes: ['id', 'name', 'avatar', 'address', 'description'],
                },
            });
            if (!doctorsInSpecialization || doctorsInSpecialization.length === 0) {
                throw new Error(`Không tìm thấy bác sĩ nào cho chuyên khoa ID: ${specializationId}`);
            }

            const allLeaveRequests = await db.TimeOffs.findAll({
                where: {
                    doctorId: doctorsInSpecialization.map((doc) => doc.User.id),
                    startDate: { [Op.lte]: dateFns.format(lastDayOfMonth, 'yyyy-MM-dd') },
                    endDate: { [Op.gte]: dateFns.format(firstDayOfMonth, 'yyyy-MM-dd') },
                    statusId: {
                        [Op.or]: [
                            { [Op.eq]: 1 }, // Trạng thái 'SUCCESS'
                        ],
                    },
                },
            });
            const approvedStatus = await db.Status.findOne({ where: { name: 'SUCCESS' } });
            if (!approvedStatus) {
                // Thay vì lỗi, có thể thử tìm status có ID cụ thể nếu bạn biết
                // Hoặc yêu cầu phải có status 'SUCCESS'
                throw new Error(
                    "Không tìm thấy trạng thái 'approved' trong hệ thống. Vui lòng kiểm tra bảng Statuses."
                );
            }

            let generatedShifts = [];
            const doctorShiftCounts = doctorsInSpecialization.reduce((acc, doc) => {
                acc[doc.User.id] = { onCallWeekly: {}, regularTotal: 0 };
                return acc;
            }, {});

            // --- GIAI ĐOẠN 1: XẾP CA TRỰC ĐÊM ---
            for (const day of daysInMonth) {
                const dateStr = dateFns.format(day, 'yyyy-MM-dd');
                const dayOfWeek = dateFns.getDay(day);

                if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                    for (let i = 0; i < ON_CALL_SHIFTS_PER_NIGHT_REQUIRED; i++) {
                        const candidates = [];
                        for (const doctor of doctorsInSpecialization) {
                            if (
                                generatedShifts.some(
                                    (s) =>
                                        s.date === dateStr &&
                                        s.type === ShiftType.ON_CALL &&
                                        s.doctorId === doctor.User.id
                                )
                            ) {
                                continue;
                            }

                            const isOnLeaveToday = await isDoctorOnLeave(doctor.User.id, dateStr, allLeaveRequests);
                            const nextDayDate = dateFns.addDays(day, 1);
                            const nextDayStr = dateFns.format(nextDayDate, 'yyyy-MM-dd');
                            const isOnLeaveTomorrow = await isDoctorOnLeave(
                                doctor.User.id,
                                nextDayStr,
                                allLeaveRequests
                            );

                            if (isOnLeaveToday || isOnLeaveTomorrow) continue;

                            const doctorCurrentGeneratedShifts = generatedShifts.filter(
                                (s) => s.doctorId === doctor.User.id
                            );
                            if (
                                await violatesSameDayWorkAndOnCall(
                                    doctor.User.id,
                                    dateStr,
                                    ShiftType.ON_CALL,
                                    doctorCurrentGeneratedShifts
                                )
                            )
                                continue;

                            const weekNum = dateFns.getWeek(day, { weekStartsOn: 1 });
                            const currentOnCallInWeek = doctorShiftCounts[doctor.User.id].onCallWeekly[weekNum] || 0;
                            if (currentOnCallInWeek >= ON_CALL_SHIFTS_PER_WEEK_MAX) continue;

                            // ❗️MỚI: Kiểm tra nếu bác sĩ đã trực vào ngày hôm trước (tránh 2 ca trực liên tiếp)
                            const previousDayDate = dateFns.subDays(day, 1);
                            const previousDayStr = dateFns.format(previousDayDate, 'yyyy-MM-dd');
                            const wasOnCallPreviousDay = generatedShifts.some(
                                (s) =>
                                    s.date === previousDayStr &&
                                    s.type === ShiftType.ON_CALL &&
                                    s.doctorId === doctor.User.id
                            );
                            if (wasOnCallPreviousDay) continue;

                            // Ưu tiên bác sĩ có tổng số ca trực ít hơn trung bình toàn khoa
                            const allOnCallCounts = doctorsInSpecialization.map((d) => {
                                const weeks = Object.values(doctorShiftCounts[d.User.id].onCallWeekly || {});
                                return weeks.reduce((a, b) => a + b, 0);
                            });
                            const avgOnCall =
                                allOnCallCounts.reduce((a, b) => a + b, 0) / doctorsInSpecialization.length;

                            const totalOnCall = Object.values(
                                doctorShiftCounts[doctor.User.id].onCallWeekly || {}
                            ).reduce((a, b) => a + b, 0);
                            let priority = avgOnCall - totalOnCall;

                            if (currentOnCallInWeek < ON_CALL_SHIFTS_PER_WEEK_MIN) priority += 5;

                            candidates.push({ doctorId: doctor.User.id, priority });
                        }

                        if (candidates.length > 0) {
                            candidates.sort((a, b) => b.priority - a.priority);
                            const assignedDoctorId = candidates[0].doctorId;

                            const newShift = {
                                doctorId: assignedDoctorId,
                                specializationId: specializationId,
                                statusId: approvedStatus.id,
                                type: ShiftType.ON_CALL,
                                date: dateStr,
                                startTime: getShiftStartDateTime(dateStr, ShiftType.ON_CALL),
                                endTime: getShiftEndDateTime(dateStr, ShiftType.ON_CALL),
                                notes: 'Generated by system',
                            };
                            generatedShifts.push(newShift);

                            const weekNum = dateFns.getWeek(day, { weekStartsOn: 1 });
                            doctorShiftCounts[assignedDoctorId].onCallWeekly[weekNum] =
                                (doctorShiftCounts[assignedDoctorId].onCallWeekly[weekNum] || 0) + 1;
                        } else {
                            // console.warn(`!!! Không tìm đủ bác sĩ trực đêm ${dateStr}`);
                        }
                    }
                }
            }

            // --- GIAI ĐOẠN 2: XẾP CA LÀM VIỆC THƯỜNG ---
            for (const day of daysInMonth) {
                const dateStr = dateFns.format(day, 'yyyy-MM-dd');
                const dayOfWeek = dateFns.getDay(day);

                if (dayOfWeek >= 1 && dayOfWeek <= 6) {
                    for (let i = 0; i < REGULAR_SHIFTS_PER_DAY_REQUIRED; i++) {
                        const candidates = [];
                        for (const doctor of doctorsInSpecialization) {
                            if (
                                generatedShifts.some(
                                    (s) =>
                                        s.date === dateStr &&
                                        s.type === ShiftType.REGULAR &&
                                        s.doctorId === doctor.User.id
                                )
                            ) {
                                continue;
                            }
                            if (await isDoctorOnLeave(doctor.User.id, dateStr, allLeaveRequests)) continue;

                            const doctorCurrentGeneratedShifts = generatedShifts.filter(
                                (s) => s.doctorId === doctor.User.id
                            );
                            if (
                                await violatesRestAfterOnCall(
                                    doctor.User.id,
                                    dateStr,
                                    ShiftType.REGULAR,
                                    doctorCurrentGeneratedShifts
                                )
                            )
                                continue;
                            if (
                                await violatesSameDayWorkAndOnCall(
                                    doctor.User.id,
                                    dateStr,
                                    ShiftType.REGULAR,
                                    doctorCurrentGeneratedShifts
                                )
                            )
                                continue;

                            // Ưu tiên bác sĩ có số ca thường thấp hơn trung bình toàn khoa
                            const allRegularCounts = doctorsInSpecialization.map(
                                (d) => doctorShiftCounts[d.User.id].regularTotal || 0
                            );
                            const avgRegular =
                                allRegularCounts.reduce((a, b) => a + b, 0) / doctorsInSpecialization.length;
                            let priority = avgRegular - (doctorShiftCounts[doctor.User.id].regularTotal || 0);

                            candidates.push({ doctorId: doctor.User.id, priority });
                        }

                        if (candidates.length > 0) {
                            candidates.sort((a, b) => b.priority - a.priority);
                            const assignedDoctorId = candidates[0].doctorId;

                            const newShift = {
                                doctorId: assignedDoctorId,
                                specializationId: specializationId,
                                statusId: approvedStatus.id,
                                type: ShiftType.REGULAR,
                                date: dateStr,
                                startTime: getShiftStartDateTime(dateStr, ShiftType.REGULAR),
                                endTime: getShiftEndDateTime(dateStr, ShiftType.REGULAR),
                                notes: 'Generated by system',
                            };
                            generatedShifts.push(newShift);

                            doctorShiftCounts[assignedDoctorId].regularTotal =
                                (doctorShiftCounts[assignedDoctorId].regularTotal || 0) + 1;
                        } else {
                            // console.warn(
                            //     `!!! Không tìm đủ bác sĩ làm ca thường ngày ${dateStr} (cần ${REGULAR_SHIFTS_PER_DAY_REQUIRED}, vị trí ${
                            //         i + 1
                            //     })`
                            // );
                        }
                    }
                }
            }

            // --- GIAI ĐOẠN 3: KIỂM TRA LẠI RÀNG BUỘC TỐI THIỂU CA TRỰC/TUẦN ---
            for (const doctor of doctorsInSpecialization) {
                const weeksInMonthWithWorkdays = {};
                daysInMonth.forEach((day) => {
                    if (dateFns.getDay(day) >= 1 && dateFns.getDay(day) <= 5) {
                        weeksInMonthWithWorkdays[dateFns.getWeek(day, { weekStartsOn: 1 })] = true;
                    }
                });

                for (const weekNumStr in weeksInMonthWithWorkdays) {
                    const weekNum = parseInt(weekNumStr); // Chuyển key của object thành số
                    // Tìm một ngày đại diện cho tuần đó để truyền vào getOnCallCountForWeek
                    const representativeDayInWeek = daysInMonth.find(
                        (d) =>
                            dateFns.getWeek(d, { weekStartsOn: 1 }) === weekNum &&
                            dateFns.getDay(d) >= 1 &&
                            dateFns.getDay(d) <= 5
                    );

                    if (representativeDayInWeek) {
                        const onCallCountThisWeek = await getOnCallCountForWeek(
                            doctor.User.id,
                            dateFns.format(representativeDayInWeek, 'yyyy-MM-dd'), // Truyền dateStr
                            generatedShifts.filter((s) => s.doctorId === doctor.User.id)
                        );

                        // if (onCallCountThisWeek < ON_CALL_SHIFTS_PER_WEEK_MIN) {
                        //     if (doctorsInSpecialization.length <= 5) {
                        //         console.warn(
                        //             `!!! CẢNH BÁO: Bác sĩ ${doctor.User.id} (ID) chỉ có ${onCallCountThisWeek} ca trực trong Tuần ${weekNum} (cần ít nhất ${ON_CALL_SHIFTS_PER_WEEK_MIN}).`
                        //         );
                        //         // TODO: Implement logic to adjust schedule
                        //     }
                        // }
                    }
                }
            }

            // Thống kê số lượng ca trực và ca làm trong tháng của mỗi bác sĩ
            const doctorStatistics = doctorsInSpecialization.map((doctor) => {
                const doctorId = doctor.User.id;
                const onCallShifts = generatedShifts.filter(
                    (shift) => shift.doctorId === doctorId && shift.type === ShiftType.ON_CALL
                ).length;
                const regularShifts = generatedShifts.filter(
                    (shift) => shift.doctorId === doctorId && shift.type === ShiftType.REGULAR
                ).length;

                // return {
                //     doctorId,
                //     onCallShifts,
                //     regularShifts,
                // };
            });

            // --- GIAI ĐOẠN 4: LƯU KẾT QUẢ VÀ TRẢ VỀ ---
            if (generatedShifts.length > 0) {
                // Sử dụng transaction để đảm bảo tính nhất quán
                const transaction = await db.AllSchedule.sequelize.transaction();
                try {
                    await db.AllSchedule.destroy({
                        where: {
                            specializationId: specializationId,
                            date: {
                                [Op.gte]: dateFns.format(firstDayOfMonth, 'yyyy-MM-dd'),
                                [Op.lte]: dateFns.format(lastDayOfMonth, 'yyyy-MM-dd'),
                            },
                        },
                        transaction, // Thêm transaction vào destroy
                    });
                    // console.log(`Đã xóa lịch cũ (nếu có) của khoa ${specializationId} trong tháng ${month}-${year}.`);

                    const createdSchedules = await db.AllSchedule.bulkCreate(generatedShifts, { transaction }); // Thêm transaction vào bulkCreate
                    // console.log(
                    //     ' createdSchedules.map((s) => s.toJSON()): ',
                    //     createdSchedules.map((s) => s.toJSON())
                    // );
                    // console.log(`Đã tạo thành công ${createdSchedules.length} ca làm việc mới.`);

                    await transaction.commit(); // Commit transaction nếu mọi thứ thành công

                    resolve({
                        success: true,
                        message: `Lịch làm việc cho tháng ${year}-${month}, khoa ${specializationId} đã được tạo.`,
                        data: createdSchedules.map((s) => s.toJSON()), // Trả về plain objects
                    });
                } catch (error) {
                    await transaction.rollback(); // Rollback transaction nếu có lỗi
                    console.error('Error saving schedule:', error);
                    reject(error);
                }
            }
        } catch (error) {
            console.error('Error generating monthly schedule:', error);
            reject(error);
        }
    });
};

let generateScheduleForAllSpecializations = async (month, year, specializationIds) => {
    return new Promise(async (resolve, reject) => {
        try {
            const results = [];
            for (const specializationId of specializationIds) {
                try {
                    // console.log(`\n--- Generating for Specialization ID: ${specializationId} ---`);
                    const resultForSpec = await generateMonthlySchedule(month, year, specializationId);
                    results.push({
                        specializationId: specializationId,
                        ...resultForSpec, // success, message, data
                    });
                } catch (error) {
                    console.error(
                        `Error generating schedule for specialization ID ${specializationId}:`,
                        error.message
                    );
                    results.push({
                        specializationId: specializationId,
                        success: false,
                        message: `Lỗi khi tạo lịch cho khoa ${specializationId}: ${error.message}`,
                        data: [],
                    });
                }
            }
            // console.log('\n--- Overall schedule generation process completed. ---');
            resolve(results);
        } catch (error) {
            console.error('Error generating schedule for all specializations:', error);
            reject(error);
        }
    });
};
let getAllScheduleByMonthYear = async (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.AllSchedule.findAll({
                where: {
                    date: {
                        [Op.gte]: dateFns.format(new Date(year, month - 1, 1), 'yyyy-MM-dd'),
                        [Op.lte]: dateFns.format(new Date(year, month, 0), 'yyyy-MM-dd'),
                    },
                },
                attributes: ['id', 'doctorId', 'specializationId', 'statusId', 'type', 'date', 'startTime', 'endTime'],
                order: [
                    ['date', 'ASC'],
                    ['startTime', 'ASC'],
                ],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar'],
                    },
                    {
                        model: db.Specialization,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!schedules || schedules.length === 0) {
                schedules = [];
            }

            resolve(schedules.map((schedule) => schedule.dataValues));
        } catch (error) {
            console.error('Error fetching schedules:', error);
            reject(error);
        }
    });
};

let getAllScheduleByDoctorId = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.AllSchedule.findAll({
                where: {
                    doctorId: doctorId,
                },
                attributes: ['id', 'doctorId', 'specializationId', 'statusId', 'type', 'date', 'startTime', 'endTime'],
                order: [
                    ['date', 'ASC'],
                    ['startTime', 'ASC'],
                ],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar'],
                    },
                    {
                        model: db.Specialization,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!schedules || schedules.length === 0) {
                schedules = [];
            }

            resolve(schedules.map((schedule) => schedule.dataValues));
        } catch (error) {
            console.error('Error fetching schedules:', error);
            reject(error);
        }
    });
};

let getScheduleByDoctorIdAndDate = async (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.AllSchedule.findOne({
                where: {
                    doctorId: doctorId,
                    date: date,
                },
                attributes: ['id', 'doctorId', 'specializationId', 'statusId', 'type', 'date', 'startTime', 'endTime'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar', 'email', 'phone', 'description'],
                    },
                    {
                        model: db.Specialization,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });

            resolve(schedule ? schedule.dataValues : null);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            reject(error);
        }
    });
};

let getAllScheduleTimeOffs = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeOffs = await db.TimeOffs.findAll({
                attributes: ['id', 'doctorId', 'startDate', 'endDate', 'reason', 'statusId'],
                order: [
                    [db.sequelize.literal('statusId = 3'), 'DESC'],
                    ['updatedAt', 'ASC'],
                ],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor', // phải đúng với alias
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: db.Doctor_User,
                                attributes: ['specializationId'],
                                include: [
                                    {
                                        model: db.Specialization,
                                        attributes: ['id', 'name'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });
            // Xử lý dữ liệu để định dạng lại nếu cần
            timeOffs = timeOffs.map((timeOff) => {
                const doctorUser = timeOff.Doctor?.Doctor_User || {};
                return {
                    id: timeOff.id,
                    doctorId: timeOff.doctorId,
                    startDate: timeOff.startDate,
                    endDate: timeOff.endDate,
                    reason: timeOff.reason,
                    statusId: timeOff.statusId,
                    statusName: timeOff.Status?.name || 'Unknown',
                    doctorName: timeOff.Doctor?.name || 'Unknown',
                    specializationId: doctorUser.Specialization?.id || null,
                    specializationName: doctorUser.Specialization?.name || 'Unknown',
                };
            });

            if (!timeOffs || timeOffs.length === 0) {
                timeOffs = [];
            }

            resolve(timeOffs);
        } catch (error) {
            console.error('Error fetching time offs:', error);
            reject(error);
        }
    });
};

let getAllScheduleTimeOffsPaging = async (limit, offset) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { count, rows: timeOffs } = await db.TimeOffs.findAndCountAll({
                attributes: ['id', 'doctorId', 'startDate', 'endDate', 'reason', 'statusId'],
                order: [
                    [db.sequelize.literal('statusId = 3'), 'DESC'],
                    ['updatedAt', 'ASC'],
                ],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor', // phải đúng với alias
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: db.Doctor_User,
                                attributes: ['specializationId'],
                                include: [
                                    {
                                        model: db.Specialization,
                                        attributes: ['id', 'name'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
                limit,
                offset,
            });

            let totalCount = Math.ceil(count / limit);

            // Xử lý dữ liệu để định dạng lại nếu cần
            timeOffs = timeOffs.map((timeOff) => {
                const doctorUser = timeOff.Doctor?.Doctor_User || {};
                return {
                    id: timeOff.id,
                    doctorId: timeOff.doctorId,
                    startDate: timeOff.startDate,
                    endDate: timeOff.endDate,
                    reason: timeOff.reason,
                    statusId: timeOff.statusId,
                    statusName: timeOff.Status?.name || 'Unknown',
                    doctorName: timeOff.Doctor?.name || 'Unknown',
                    specializationId: doctorUser.Specialization?.id || null,
                    specializationName: doctorUser.Specialization?.name || 'Unknown',
                };
            });

            if (!timeOffs || timeOffs.length === 0) {
                timeOffs = [];
            }

            resolve({ timeOffs, totalCount });
        } catch (error) {
            console.error('Error fetching time offs:', error);
            reject(error);
        }
    });
};
let getScheduleTimeOffById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeOff = await db.TimeOffs.findOne({
                where: {
                    id: id,
                },
                attributes: ['id', 'doctorId', 'startDate', 'endDate', 'reason', 'statusId'],
                order: [['startDate', 'ASC']],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor', // phải đúng với alias
                        attributes: ['id', 'name', 'email'],
                        include: [
                            {
                                model: db.Doctor_User,
                                attributes: ['specializationId'],
                                include: [
                                    {
                                        model: db.Specialization,
                                        attributes: ['id', 'name'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });
            // Xử lý dữ liệu để định dạng lại nếu cần
            if (timeOff) {
                const doctorUser = timeOff.Doctor?.Doctor_User || {};
                timeOff = {
                    id: timeOff.id,
                    doctorId: timeOff.doctorId,
                    startDate: timeOff.startDate,
                    endDate: timeOff.endDate,
                    reason: timeOff.reason,
                    statusId: timeOff.statusId,
                    statusName: timeOff.Status?.name || 'Unknown',
                    doctorName: timeOff.Doctor?.name || 'Unknown',
                    doctorEmail: timeOff.Doctor?.email || 'Unknown',
                    specializationId: doctorUser.Specialization?.id || null,
                    specializationName: doctorUser.Specialization?.name || 'Unknown',
                };
            }

            resolve(timeOff);
        } catch (error) {
            console.error('Error fetching time offs:', error);
            reject(error);
        }
    });
};

let getScheduleByDateAndDoctorId = async (doctorId, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.AllSchedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                },
                attributes: ['id', 'doctorId', 'specializationId', 'statusId', 'type', 'date', 'startTime', 'endTime'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar'],
                    },
                    {
                        model: db.Specialization,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!schedules || schedules.length === 0) {
                schedules = [];
            }
            schedules = schedules.map((s) => s.dataValues);
            resolve(schedules);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            reject(error);
        }
    });
};

let getOnCallScheduleByDoctorAndDate = async (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.AllSchedule.findOne({
                where: {
                    doctorId: doctorId,
                    date: date,
                    type: ShiftType.ON_CALL,
                },
                attributes: ['id', 'doctorId', 'specializationId', 'statusId', 'type', 'date', 'startTime', 'endTime'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar'],
                    },
                    {
                        model: db.Specialization,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Status,
                        attributes: ['id', 'name'],
                    },
                ],
            });
            if (!schedule) {
                schedule = null;
            } else {
                schedule = schedule.dataValues;
            }
            resolve(schedule);
        } catch (error) {
            console.error('Error fetching on-call schedule:', error);
            reject(error);
        }
    });
};
let findSwapOptions = async (doctorId, specializationId, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorA = await db.User.findOne({
                where: {
                    id: doctorId,
                },
            });
            let doctors = await doctorService.getDoctorsBySpecializationId(specializationId);
            if (!Array.isArray(doctors)) {
                throw new Error('Expected an array of doctors but received something else.');
            }
            let otherDoctors = doctors.filter((doc) => doc.doctorId !== doctorId);
            let doctorASchedule = await getScheduleByDateAndDoctorId(doctorId, startDate, endDate);

            if (!doctorASchedule || doctorASchedule.length === 0) {
                return resolve({
                    success: false,
                    message: `Bác sĩ ${doctorA.name} không có lịch làm việc trong khoảng thời gian này.`,
                });
            }

            // Lấy danh sách các bác sĩ có thể thay thế
            let swapOptions = [];
            for (const shiftA of doctorASchedule) {
                for (const doctor of otherDoctors) {
                    // Lấy lịch làm việc của bác sĩ B trong khoảng thời gian xin nghỉ của bác sĩ A
                    let doctorBSchedule = await getScheduleByDateAndDoctorId(doctor.doctorId, startDate, endDate);
                    // Lấy danh sách ngày nghỉ phép của bác sĩ A và bác sĩ B
                    let doctorATimeOffs = await db.TimeOffs.findAll({
                        where: {
                            doctorId: doctorId,
                            statusId: 1, // SUCCESS
                        },
                        attributes: ['startDate', 'endDate'],
                    });
                    let doctorBTimeOffs = await db.TimeOffs.findAll({
                        where: {
                            doctorId: doctor.doctorId,
                            statusId: 1, // SUCCESS
                        },
                        attributes: ['startDate', 'endDate'],
                    });
                    // Hàm kiểm tra 1 ngày có nằm trong khoảng nghỉ phép không
                    const isInTimeOff = (date, timeOffs) => {
                        return timeOffs.some((off) =>
                            moment(date).isBetween(off.startDate, off.endDate, undefined, '[]')
                        );
                    };
                    // Kiểm tra bác sĩ B có lịch trống vào ngày của ca làm việc của bác sĩ A
                    const isDoctorBAvailable = !doctorBSchedule.some((shiftB) => shiftB.date === shiftA.date);
                    // Kiểm tra bác sĩ B không có lịch "on-call" vào ngày trước đó
                    const doctorBOnCallPreviousDay = await getOnCallScheduleByDoctorAndDate(
                        doctor.doctorId,
                        moment(shiftA.date, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
                    );
                    // Kiểm tra ngày swap có trùng timeoff của bác sĩ B không
                    if (
                        isDoctorBAvailable &&
                        (!doctorBOnCallPreviousDay || doctorBOnCallPreviousDay.length === 0) &&
                        !isInTimeOff(shiftA.date, doctorBTimeOffs)
                    ) {
                        // Tìm ngày bác sĩ A có thể làm lại cho bác sĩ B
                        let doctorAFutureSchedule = await getAllScheduleByDoctorId(doctorId);
                        let doctorBFutureSchedule = await getAllScheduleByDoctorId(doctor.doctorId);

                        // Tìm ngày bác sĩ B có lịch làm việc cùng loại ca làm việc đã đổi với bác sĩ A
                        let doctorAFutureAvailableDate = doctorBFutureSchedule.find((shiftB) => {
                            return (
                                shiftB.type === shiftA.type && // Cùng loại ca làm việc
                                shiftB.date > endDate && // Ngày phải sau ngày bác sĩ A xin nghỉ
                                !doctorAFutureSchedule.some((shiftA) => shiftA.date === shiftB.date) && // Ngày đó phải là ngày nghỉ của bác sĩ A
                                !doctorAFutureSchedule.some(
                                    (shiftA) =>
                                        moment(shiftA.date, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD') ===
                                            shiftB.date ||
                                        moment(shiftA.date, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD') ===
                                            shiftB.date
                                ) &&
                                !isInTimeOff(shiftB.date, doctorATimeOffs) // Ngày làm lại không trùng timeoff của bác sĩ A // Ngày không vi phạm điều kiện nghỉ ngơi của bác sĩ A
                            );
                        });

                        if (doctorAFutureAvailableDate) {
                            swapOptions.push({
                                doctorSwapId: doctor.doctorId,
                                doctorSwapName: doctor.doctorName,
                                dateASwap: shiftA.date, // Ngày bác sĩ B làm thay cho bác sĩ A
                                type: shiftA.type, // Loại ca làm việc
                                dateBSwap: doctorAFutureAvailableDate.date, // Ngày bác sĩ A làm lại cho bác sĩ B
                                statusId: 4,
                            });
                        }
                    }
                }
            }

            if (swapOptions.length === 0) {
                return resolve({ success: false, message: 'Không tìm thấy bác sĩ phù hợp để đổi ca.' });
            }

            return resolve({ success: true, options: swapOptions });
        } catch (error) {
            console.error('Error fetching swap options:', error);
            reject(error);
        }
    });
};

let updateTimeOffById = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeOff = await db.TimeOffs.findOne({
                where: { id: id },
            });
            if (!timeOff) {
                return resolve({ success: false, message: 'Không tìm thấy yêu cầu nghỉ phép.' });
            }

            await timeOff.update(data);
            resolve({ success: true, message: 'Cập nhật yêu cầu nghỉ phép thành công.' });
        } catch (error) {
            console.error('Error updating time off:', error);
            reject(error);
        }
    });
};
let updateScheduleByDoctorIdAndDate = async (doctorId, date, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.AllSchedule.findOne({
                where: {
                    doctorId: doctorId,
                    date: date,
                },
            });
            if (!schedule) {
                return resolve({ success: false, message: 'Không tìm thấy lịch làm việc.' });
            }

            await schedule.update(data);
            resolve({ success: true, message: 'Cập nhật lịch làm việc thành công.' });
        } catch (error) {
            console.error('Error updating schedule:', error);
            reject(error);
        }
    });
};

let createSwapSchedule = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataRequest = {
                doctorId: Number(data.doctorId),
                doctorSwapId: Number(data.doctorSwapId),
                dateASwap: data.dateASwap,
                dateBSwap: data.dateBSwap,
                reason: data.reason,
                type: data.type,
                statusId: 3, // Đợi duyệt
            };
            let swapSchedule = await db.SwapSchedules.create(dataRequest);
            resolve({ success: true, message: 'Tạo lịch đổi ca thành công.', data: swapSchedule.dataValues });
        } catch (error) {
            console.error('Error creating swap schedule:', error);
            reject(error);
        }
    });
};
let getSwapScheduleByDoctorIdAndDate = async (doctorId, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let swapSchedule = await db.SwapSchedules.findAll({
                where: {
                    doctorId: doctorId,
                    dateASwap: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                },
                attributes: ['id', 'doctorId', 'doctorSwapId', 'dateASwap', 'dateBSwap', 'reason', 'type', 'statusId'],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.User,
                        as: 'DoctorSwap',
                        attributes: ['id', 'name'],
                    },
                ],
            });
            if (!swapSchedule || swapSchedule.length === 0) {
                swapSchedule = [];
            } else {
                swapSchedule = swapSchedule.map((s) => ({
                    id: s.id,
                    doctorId: s.doctorId,
                    doctorName: s.Doctor?.name || null,
                    doctorSwapId: s.doctorSwapId,
                    doctorSwapName: s.DoctorSwap?.name || null,
                    dateASwap: s.dateASwap,
                    dateBSwap: s.dateBSwap,
                    reason: s.reason,
                    type: s.type,
                    statusId: s.statusId,
                }));
            }
            resolve(swapSchedule);
        } catch (error) {
            console.error('Error fetching swap schedule:', error);
            reject(error);
        }
    });
};
let getAllScheduleSwapByDoctocSwapId = async (doctorSwapId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let swapSchedule = await db.SwapSchedules.findAll({
                where: {
                    doctorSwapId: doctorSwapId,
                },
                attributes: ['id', 'doctorId', 'doctorSwapId', 'dateASwap', 'dateBSwap', 'reason', 'type', 'statusId'],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.User,
                        as: 'DoctorSwap',
                        attributes: ['id', 'name'],
                    },
                ],
            });
            if (!swapSchedule || swapSchedule.length === 0) {
                swapSchedule = [];
            } else {
                swapSchedule = swapSchedule.map((s) => ({
                    id: s.id,
                    doctorId: s.doctorId,
                    doctorName: s.Doctor?.name || null,
                    doctorSwapId: s.doctorSwapId,
                    doctorSwapName: s.DoctorSwap?.name || null,
                    dateASwap: s.dateASwap,
                    dateBSwap: s.dateBSwap,
                    reason: s.reason,
                    type: s.type,
                    statusId: s.statusId,
                }));
            }
            resolve(swapSchedule);
        } catch (error) {
            console.error('Error fetching swap schedule:', error);
            reject(error);
        }
    });
};

let updateScheduleSwapById = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let swapSchedule = await db.SwapSchedules.findOne({
                where: { id: id },
            });
            if (!swapSchedule) {
                return resolve({ success: false, message: 'Không tìm thấy yêu cầu đổi ca.' });
            }

            await swapSchedule.update(data);
            resolve({ success: true, message: 'Cập nhật yêu cầu đổi ca thành công.' });
        } catch (error) {
            console.error('Error updating swap schedule:', error);
            reject(error);
        }
    });
};
let getScheduleSwapById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let swapSchedule = await db.SwapSchedules.findOne({
                where: { id: id },
                attributes: ['id', 'doctorId', 'doctorSwapId', 'dateASwap', 'dateBSwap', 'reason', 'type', 'statusId'],
                include: [
                    {
                        model: db.User,
                        as: 'Doctor',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.User,
                        as: 'DoctorSwap',
                        attributes: ['id', 'name'],
                    },
                ],
            });
            if (!swapSchedule) {
                return resolve({ success: false, message: 'Không tìm thấy yêu cầu đổi ca.' });
            }
            swapSchedule = {
                id: swapSchedule.id,
                doctorId: swapSchedule.doctorId,
                doctorName: swapSchedule.Doctor?.name || null,
                doctorSwapId: swapSchedule.doctorSwapId,
                doctorSwapName: swapSchedule.DoctorSwap?.name || null,
                dateASwap: swapSchedule.dateASwap,
                dateBSwap: swapSchedule.dateBSwap,
                reason: swapSchedule.reason,
                type: swapSchedule.type,
                statusId: swapSchedule.statusId,
            };
            resolve(swapSchedule);
        } catch (error) {
            console.error('Error fetching swap schedule:', error);
            reject(error);
        }
    });
};

let getScheduleMax = async (doctorId, dateBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            let scheduleMaxBooking = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: dateBooking,
                    sumBooking: 3,
                },
            });
            if (!scheduleMaxBooking || scheduleMaxBooking.length === 0) {
                scheduleMaxBooking = [];
            }
            resolve(scheduleMaxBooking.map((s) => s.dataValues));
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
};
module.exports = {
    generateMonthlySchedule: generateMonthlySchedule,
    generateScheduleForAllSpecializations: generateScheduleForAllSpecializations,
    getAllScheduleByMonthYear: getAllScheduleByMonthYear,
    getAllScheduleByDoctorId: getAllScheduleByDoctorId,
    getAllScheduleTimeOffs: getAllScheduleTimeOffs,
    getAllScheduleTimeOffsPaging: getAllScheduleTimeOffsPaging,
    getScheduleTimeOffById: getScheduleTimeOffById,
    getScheduleByDateAndDoctorId: getScheduleByDateAndDoctorId,
    getOnCallScheduleByDoctorAndDate: getOnCallScheduleByDoctorAndDate,
    findSwapOptions: findSwapOptions,
    updateTimeOffById: updateTimeOffById,
    updateScheduleByDoctorIdAndDate: updateScheduleByDoctorIdAndDate,
    createSwapSchedule: createSwapSchedule,
    getSwapScheduleByDoctorIdAndDate: getSwapScheduleByDoctorIdAndDate,
    getAllScheduleSwapByDoctocSwapId: getAllScheduleSwapByDoctocSwapId,
    updateScheduleSwapById: updateScheduleSwapById,
    getScheduleSwapById: getScheduleSwapById,
    getScheduleByDoctorIdAndDate: getScheduleByDoctorIdAndDate,
    getScheduleMax: getScheduleMax,
};
