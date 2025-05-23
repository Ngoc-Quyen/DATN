import doctorService from '../services/doctorService.js';
import userService from '../services/userService.js';
import homeService from '../services/homeService.js';
import postService from '../services/postService.js';
import scheduleService from '../services/scheduleService.js';
const path = require('path');
const fs = require('fs');

import _ from 'lodash';
import moment from 'moment';
import multer from 'multer';
import { format } from 'date-fns';

const MAX_BOOKING = 3;

function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf('mm');
    let dayIndex = formatItems.indexOf('dd');
    let yearIndex = formatItems.indexOf('yyyy');
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
}

let getSchedule = async (req, res) => {
    try {
        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }
        let data = {
            sevenDaySchedule: sevenDaySchedule,
            doctorId: req.user.id,
        };
        let schedules = await doctorService.getDoctorSchedules(data);

        schedules.forEach((x) => {
            x.date = Date.parse(stringToDate(x.date, 'dd/MM/yyyy', '/'));
        });

        schedules = _.sortBy(schedules, (x) => x.date);

        schedules.forEach((x) => {
            x.date = moment(x.date).format('DD/MM/YYYY');
        });
        let listTimeResult = await userService.getAllCodeService('TIMEREGULAR');
        let listTime = listTimeResult.data.map((item) => item.valueVi);
        return res.render('main/users/admins/schedule.ejs', {
            user: req.user,
            schedules: schedules,
            sevenDaySchedule: sevenDaySchedule,
            listTime: listTime,
        });
    } catch (e) {
        console.log(e);
    }
};

let getCreateSchedule = async (req, res) => {
    try {
        let currentDate = moment().add(1, 'days').format('DD/MM/YYYY');
        let selectedDate = req.query.Datechon || currentDate;

        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let data = {
            sevenDaySchedule: sevenDaySchedule,
            doctorId: req.user.id,
        };

        let schedules = await doctorService.getDoctorSchedules(data);

        schedules.forEach((x) => {
            x.date = moment(x.date, 'DD/MM/YYYY').toDate();
        });

        schedules = _.sortBy(schedules, (x) => x.date);

        schedules.forEach((x) => {
            x.date = moment(x.date).format('DD/MM/YYYY');
        });

        let listTime = await userService.getAllCodeService('TIMEREGULAR');

        return res.render('main/users/admins/createSchedule.ejs', {
            user: req.user,
            listTime: listTime.data,
            schedules: schedules,
            sevenDaySchedule: sevenDaySchedule,
            selectedDate: selectedDate,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
};

let postCreateSchedule = async (req, res) => {
    await doctorService.postCreateSchedule(req.user, req.body.schedule_arr, MAX_BOOKING);
    return res.status(200).json({
        status: 1,
        message: 'success',
    });
};

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let { doctorId, date } = req.body;
        let dateReq = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

        let object = await doctorService.getScheduleDoctorByDate(doctorId, date);
        let schedule = await scheduleService.getScheduleByDoctorIdAndDate(doctorId, dateReq);
        let listTime = [];
        if (schedule) {
            if (schedule.type === 'regular') {
                listTime = await userService.getAllCodeService('TIMEREGULAR');
            } else {
                listTime = await userService.getAllCodeService('TIMEONCALL');
            }
        }
        let listScheduleMax = await scheduleService.getScheduleMax(doctorId, dateReq);
        // Loại bỏ các phần tử trong listTime có valueVn trùng với time trong listScheduleMax
        if (listTime && Array.isArray(listTime.data) && Array.isArray(listScheduleMax)) {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

            listTime.data = listTime.data
                .filter((item) => {
                    // Nếu schedule không phải hôm nay thì giữ lại
                    if (schedule.date !== todayStr) return true;

                    // Nếu là hôm nay → kiểm tra giờ kết thúc đã quá chưa
                    const timeRange = item.valueVi.split(' - ');
                    if (timeRange.length !== 2) return false;

                    const [endHour, endMinute] = timeRange[1].trim().split(':').map(Number);
                    const endDateTime = new Date(); // hôm nay
                    endDateTime.setHours(endHour, endMinute, 0, 0);

                    return endDateTime > now;
                })
                .filter((item) => {
                    // Loại bỏ các item trùng thời gian trong listScheduleMax
                    return !listScheduleMax.some((schedule) => schedule.time === item.valueVi);
                });
        }

        let data = object.schedule;
        let doctor = object.doctor;
        return res.status(200).json({
            status: 1,
            message: data,
            schedule: schedule,
            listTime: listTime.data,
            doctor: doctor,
            date: date,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let deleteScheduleDoctorByDate = async (req, res) => {
    let doctorId = req.user.id;
    let dateTime = req.body.day;
    let message = await doctorService.deleteTimeByDate(doctorId, dateTime);
    if (message.errCode === 0) {
        return res.status(200).json({
            message: 'success',
        });
        // return res.redirect('/doctor/manage/schedule');
    } else {
        return res.status(200).json({
            message: message.errMessage,
        });
    }
};
let getInfoDoctorById = async (req, res) => {
    try {
        let object = await doctorService.getInfoDoctorById(req.body.id);
        return res.status(200).json({
            message: 'success',
            doctor: object.doctor,
            specializationName: object.specializationName,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageAppointment = async (req, res) => {
    // let date = "30/03/2020";
    let currentDate = moment().format('DD/MM/YYYY');
    let canActive = false;
    let date = '';
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }
    let data = {
        date: date,
        doctorId: req.user.id,
    };

    let appointments = await doctorService.getPatientsBookAppointment(data);
    // sort by range time
    let sort = _.sortBy(appointments, (x) => x.timeBooking);
    //group by range time
    let final = _.groupBy(sort, function (x) {
        return x.timeBooking;
    });

    return res.render('main/users/admins/manageAppointment.ejs', {
        user: req.user,
        appointments: final,
        date: date,
        active: canActive,
    });
};
let getScheduleByDate = async (req, res) => {
    let currentDate = moment().format('DD/MM/YYYY');
    let canActive = false;
    let date = '';
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }
    let data = {
        date: date,
        doctorId: req.user.id,
    };
    let patients = await doctorService.getPatientBooking(data);
    return res.render('main/users/admins/manageBooking.ejs', {
        user: req.user,
        date: date,
        patient: patients,
    });
};

let getManageChart = (req, res) => {
    return res.render('main/users/admins/manageChartDoctor.ejs', {
        user: req.user,
    });
};

let postSendFormsToPatient = (req, res) => {
    FileSendPatient(req, res, async (err) => {
        if (err) {
            console.log(err);
            if (err.message) {
                console.log(err.message);
                return res.status(500).send(err.message);
            } else {
                console.log(err);
                return res.status(500).send(err);
            }
        }
        try {
            let patient = await doctorService.sendFormsForPatient(req.body.patientId, req.files);
            return res.status(200).json({
                status: 1,
                message: 'sent files success',
                patient: patient,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageFormsSendPatient = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/images/patients/remedy');
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    },
});

let FileSendPatient = multer({
    storage: storageFormsSendPatient,
    limits: { fileSize: 1048576 * 20 },
}).array('filesSend');

let postCreateChart = async (req, res) => {
    try {
        let doctorId = await req.user.id;
        let object = await userService.getInfoDoctorChart(doctorId);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postAutoCreateAllDoctorsSchedule = async (req, res) => {
    try {
        let data = await userService.createAllDoctorsSchedule();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let getEditPost = async (req, res) => {
    try {
        let doctors = await userService.getInfoDoctors();
        let specializations = await homeService.getSpecializations();
        let post = await postService.getDetailPostPage(req.params.id);
        return res.render('main/users/admins/editPostByDoctor.ejs', {
            doctors: doctors,
            specializations: specializations,
            user: req.user,
            post: post,
        });
    } catch (e) {
        console.log(e);
    }
};
const filePath = path.join(__dirname, '../helper/data/timeoffReason.json');
let getNewTimeOff = async (req, res) => {
    try {
        let reasonList = [];
        try {
            const reasonListRaw = await fs.readFileSync(filePath, 'utf-8');
            reasonList = JSON.parse(reasonListRaw);
        } catch (error) {
            console.error('Lỗi khi đọc hoặc phân tích tệp timeoffReason.json:', error);
            // Cung cấp một danh sách dự phòng hoặc thông báo lỗi cụ thể
            reasonList = [{ id: 'loi_tai_ly_do', text: 'Lỗi tải lý do (vui lòng liên hệ quản trị viên)' }];
        }
        let today = new Date();
        let todayStr = format(today, 'dd/MM/yyyy');
        const responseData = {
            startDate: todayStr,
            endDate: todayStr,
            reasonList: reasonList,
        };
        return res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
let postNewTimeOff = async (req, res) => {
    try {
        let doctorId = req.user.id;
        let dataByBody = req.body;
        // CHUẨN HÓA NGAY Ở ĐÂY
        if (dataByBody.startDate) {
            dataByBody.startDate = moment(dataByBody.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        if (dataByBody.endDate) {
            dataByBody.endDate = moment(dataByBody.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        let result = await doctorService.createTimeOff(doctorId, dataByBody);

        if (result.errCode === 0) {
            return res.status(200).json({
                message: 'success',
                data: result.timeOff,
            });
        } else {
            return res.status(200).json({
                message: result.errMessage,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
let getScheduleTimeOff = async (req, res) => {
    try {
        let doctorId = req.user.id;
        let { month, year } = req.query;
        let timeOffs = await doctorService.getTimeOffByDoctorId(doctorId);
        if (!timeOffs || timeOffs.length === 0) {
            timeOffs = [];
        }
        timeOffs = timeOffs.map((timeOff) => timeOff.dataValues);
        let listSchedule = await scheduleService.getAllScheduleByDoctorId(doctorId);
        if (!listSchedule || listSchedule.length === 0) {
            listSchedule = [];
        }
        // console.log('timeOffs: ', timeOffs);
        if (month && year) {
            timeOffs = timeOffs.filter((timeOff) => {
                const startDate = moment(timeOff.startDate);
                const endDate = moment(timeOff.endDate);
                return (
                    (moment(startDate).month() + 1 === parseInt(month) &&
                        moment(startDate).year() === parseInt(year)) ||
                    (moment(endDate).month() + 1 === parseInt(month) && moment(endDate).year() === parseInt(year))
                );
            });
            // Trả về JSON nếu yêu cầu đến từ AJAX
            let timeOffDays = [];

            timeOffs.forEach((timeOff) => {
                let startDate = new Date(timeOff.startDate);
                let endDate = new Date(timeOff.endDate);

                while (startDate <= endDate) {
                    timeOffDays.push({
                        date: new Date(startDate), // Thêm ngày vào danh sách
                        reason: timeOff.reason, // Thêm lý do vào danh sách
                        statusId: timeOff.statusId, // Thêm trạng thái vào danh sách
                    });
                    startDate.setDate(startDate.getDate() + 1); // Tăng ngày lên 1
                }
            });

            return res.status(200).json({ timeOffDays, listSchedule });
        }

        return res.render('main/users/admins/timeoffDoctor.ejs', {
            user: req.user,
            timeOffs: timeOffs,
            listSchedule: listSchedule,
        });
    } catch (e) {
        console.log(e);
    }
};

let getScheduleSwap = async (req, res) => {
    let doctorId = req.user.id;
    let listScheduleSwap = await scheduleService.getAllScheduleSwapByDoctocSwapId(doctorId);
    if (!listScheduleSwap || listScheduleSwap.length === 0) {
        listScheduleSwap = [];
    }

    return res.render('main/users/admins/manageScheduleSwapForDoctor.ejs', {
        user: req.user,
        listScheduleSwap: listScheduleSwap,
    });
};
module.exports = {
    getSchedule: getSchedule,
    getCreateSchedule: getCreateSchedule,
    postCreateSchedule: postCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getInfoDoctorById: getInfoDoctorById,
    getManageAppointment: getManageAppointment,
    getManageChart: getManageChart,
    postSendFormsToPatient: postSendFormsToPatient,
    postCreateChart: postCreateChart,
    postAutoCreateAllDoctorsSchedule: postAutoCreateAllDoctorsSchedule,
    deleteScheduleDoctorByDate: deleteScheduleDoctorByDate,
    getScheduleByDate: getScheduleByDate,
    getEditPost: getEditPost,
    getNewTimeOff: getNewTimeOff,
    postNewTimeOff: postNewTimeOff,
    getScheduleTimeOff: getScheduleTimeOff,
    getScheduleSwap: getScheduleSwap,
};
