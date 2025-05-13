import db from './../models';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import { TIME_ZONE, ShiftType, getShiftStartDateTime, getShiftEndDateTime } from '../helper/dateUtils.js';
import * as dateFns from 'date-fns';
import {
    isDoctorOnLeave,
    violatesRestAfterOnCall,
    violatesSameDayWorkAndOnCall,
    getOnCallCountForWeek,
} from '../validation/calendarValidation.js';

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

let getAllScheduleTimeOffs = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeOffs = await db.TimeOffs.findAll({
                attributes: ['id', 'doctorId', 'startDate', 'endDate', 'reason', 'statusId'],
                order: [['startDate', 'ASC']],
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
module.exports = {
    generateMonthlySchedule: generateMonthlySchedule,
    generateScheduleForAllSpecializations: generateScheduleForAllSpecializations,
    getAllScheduleByMonthYear: getAllScheduleByMonthYear,
    getAllScheduleByDoctorId: getAllScheduleByDoctorId,
    getAllScheduleTimeOffs: getAllScheduleTimeOffs,
    getScheduleTimeOffById: getScheduleTimeOffById,
};
