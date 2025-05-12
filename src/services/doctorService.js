import db from './../models';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';
import patientService from './patientService';
import mailer from '../config/mailer';
import { transMailRemedy } from '../../lang/en';
import { resolve } from 'path';
import { reject } from 'bluebird';
import helper from '../helper/client';
import { da } from 'date-fns/locale';

var Minizip = require('minizip-asm.js');
var fs = require('fs');
const PATH_ZIP = 'src/public/images/patients/remedy/zip';
let maxBooking = 1;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;
const statusDone = 5;

let getDoctorWithSchedule = (id, currentDate) => {
    return new Promise(async (resolve, reject) => {
        //select with condition: chọn ngày hiện tại mà tổng đặt đang nhỏ hơn max
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Schedule,
                        required: false,
                        where: {
                            date: currentDate,
                            sumBooking: {
                                [Op.lt]: maxBooking,
                            },
                        },
                    },
                    {
                        model: db.Doctor_User,
                        attributes: ['specializationId'],
                    },
                    {
                        model: db.Comment,
                        where: { status: true },
                        attributes: ['id', 'timeBooking', 'dateBooking', 'name', 'content', 'createdAt', 'status'],
                        required: false,
                    },
                ],
            });

            if (!doctor) {
                reject(`Can't get doctor with id = ${id}`);
            }

            let specializationId = doctor.Doctor_User.specializationId;
            let specialization = await getSpecializationById(specializationId);

            let date = new Date();
            let currentHour = `${date.getHours()}:${date.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, 'DD/MM/YYYY hh:mm').toDate();

            doctor.Schedules.forEach((schedule, index) => {
                let startTime = schedule.time.split('-')[0];
                let timeSchedule = moment(`${schedule.date} ${startTime}`, 'DD/MM/YYYY hh:mm').toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                schedule.setDataValue('isDisable', timeNow > timeSchedule);
            });

            resolve({
                doctor: doctor,
                specialization: specialization,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getPostForDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { forDoctorId: id },
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title', 'contentHTML'],
            });
            resolve(post);
        } catch (e) {
            reject(e);
        }
    });
};

let postCreateSchedule = (doctorId, arrSchedule, maxBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await Promise.all(
                arrSchedule.map(async (schedule) => {
                    await db.Schedule.create({
                        doctorId: doctorId,
                        date: schedule.date,
                        time: schedule.time,
                        maxBooking: maxBooking,
                        sumBooking: 0,
                        createdAt: Date.now(),
                    });
                })
            );
            resolve(schedule);
        } catch (err) {
            reject(err);
        }
    });
};

let createPatient = (item) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Patient.create(item);

            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let getScheduleDoctorByDate = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findAll({
                where: {
                    doctorId: id,
                    date: date,
                    sumBooking: {
                        [Op.lt]: maxBooking,
                    },
                },
            });
            let doctor = await getDoctorById(id);

            let dateNow = new Date();
            let currentDate = moment().format('DD/MM/YYYY');
            let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, 'DD/MM/YYYY hh:mm').toDate();

            schedule.forEach((sch, index) => {
                let startTime = sch.time.split('-')[0];
                let timeSchedule = moment(`${sch.date} ${startTime}`, 'DD/MM/YYYY hh:mm').toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                sch.setDataValue('isDisable', timeNow > timeSchedule);
            });

            resolve({
                schedule: schedule,
                doctor: doctor,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let getScheduleDoctorByDateSumBooking = async (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findAll({
                where: {
                    doctorId: id,
                    date: date,
                    sumBooking: '0',
                },
            });
            let doctor = await getDoctorById(id);

            let dateNow = new Date();
            let currentDate = moment().format('DD/MM/YYYY');
            let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, 'DD/MM/YYYY hh:mm').toDate();

            schedule.forEach((sch, index) => {
                let startTime = sch.time.split('-')[0];
                let timeSchedule = moment(`${sch.date} ${startTime}`, 'DD/MM/YYYY hh:mm').toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                sch.setDataValue('isDisable', timeNow > timeSchedule);
            });

            resolve({
                schedule: schedule,
                doctor: doctor,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let getDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id, roleId: 2 },
            });
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

let getSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialization = await db.Specialization.findOne({ where: { id: id } });
            resolve(specialization);
        } catch (e) {
            reject(e);
        }
    });
};

let getDoctorsForSpecialization = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Doctor_User.findAll({
                where: { specializationId: id },
                attributes: ['specializationId'],
                include: {
                    model: db.User,
                    attributes: ['id', 'name', 'avatar', 'address', 'description'],
                },
            });
            //get schedule each doctor
            await Promise.all(
                doctors.map(async (doctor) => {
                    let schedule = await db.Schedule.findAll({
                        where: {
                            doctorId: doctor.User.id,
                            date: date,
                            sumBooking: {
                                [Op.lt]: maxBooking,
                            },
                        },
                        attributes: ['id', 'date', 'time'],
                    });

                    let dateNow = new Date();
                    let currentDate = moment().format('DD/MM/YYYY');
                    let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
                    let timeNow = moment(`${currentDate} ${currentHour}`, 'DD/MM/YYYY hh:mm').toDate();

                    schedule.forEach((sch, index) => {
                        let startTime = sch.time.split('-')[0];
                        let timeSchedule = moment(`${sch.date} ${startTime}`, 'DD/MM/YYYY hh:mm').toDate();
                        //isDisable nếu time hiện tại > time kế hoạch
                        sch.setDataValue('isDisable', timeNow > timeSchedule);
                    });

                    doctor.setDataValue('schedule', schedule);
                })
            );

            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    });
};

let getInfoDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'avatar', 'address', 'phone', 'description'],
                include: {
                    model: db.Doctor_User,
                    attributes: ['specializationId'],
                },
            });

            let specialization = await db.Specialization.findOne({
                where: { id: doctor.Doctor_User.specializationId },
                attributes: ['name'],
            });

            doctor.setDataValue('specializationName', specialization.name);
            let specializationName = specialization.name;
            resolve({
                doctor: doctor,
                specializationName: specializationName,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let deleteDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: { id: id },
            });

            let doctor = await db.Doctor_User.findOne({
                where: { doctorId: id },
            });
            if (doctor) {
                await db.Doctor_User.destroy({ where: { id: doctor.id } });
            }

            resolve('delete successful');
        } catch (e) {
            reject(e);
        }
    });
};

let getDoctorForEditPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                include: {
                    model: db.Doctor_User,
                },
            });
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};
let getPatientForEditPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.User.findOne({
                where: { id: id },
                raw: true,
            });
            resolve(patient);
        } catch (error) {
            reject(error);
        }
    });
};

let updateDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: data.id },
                include: { model: db.Doctor_User, required: false },
            });
            await doctor.update(data);
            if (doctor.Doctor_User) {
                await doctor.Doctor_User.update(data);
            } else {
                await db.Doctor_User.create({
                    doctorId: data.id,
                    specializationId: data.specializationId,
                });
            }

            resolve({
                errCode: 0,
                errMessage: 'success',
            });
        } catch (e) {
            reject(e);
        }
    });
};
let updateProfile = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required Parameter!',
                });
            }
            let doctor = await db.User.findOne({
                where: { id: data.id },
                include: { model: db.Doctor_User, required: false },
            });
            if (!doctor) {
                resolve({
                    errCode: 1,
                    errMessage: `user's not found!`,
                });
            } else {
                doctor.name = data.name;
                doctor.description = data.description;
                doctor.address = data.address;
                doctor.phone = data.phone;
                doctor.isActive = data.isActive;
                doctor.specializationId = data.specializationId;
                // Nếu có file ảnh được upload, gửi ảnh lên Firebase và lấy URL
                let url = data.avatar;
                if (url) {
                    doctor.avatar = url;
                }
                await doctor.save();
                if (doctor.Doctor_User) {
                    await doctor.Doctor_User.update(data);
                } else {
                    await db.Doctor_User.create({
                        doctorId: data.id,
                        specializationId: data.specializationId,
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success!',
                    doctor,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getPatientsBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.Patient.findAll({
                where: {
                    doctorId: data.doctorId,
                    dateBooking: data.date,
                    statusId: statusNewId,
                },
                order: [['updatedAt', 'ASC']],
                attributes: ['id', 'name', 'gender', 'timeBooking', 'description', 'isSentForms'],
            });
            resolve(patients);
        } catch (e) {
            reject(e);
        }
    });
};
let getPatientBooking = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.Patient.findAll({
                where: {
                    doctorId: data.doctorId,
                    dateBooking: data.date,
                },
                raw: true,
            });
            resolve(patients);
        } catch (error) {
            reject(error);
        }
    });
};

let getDoctorSchedules = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                where: {
                    doctorId: data.doctorId,
                    date: {
                        [Op.in]: data.sevenDaySchedule,
                    },
                },
            });
            resolve(schedules);
        } catch (e) {
            reject(e);
        }
    });
};

let getPlacesForDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let places = await db.Place.findAll({
                attributes: ['id', 'name'],
            });
            resolve(places);
        } catch (e) {
            reject(e);
        }
    });
};

let removeAccents = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let sendFormsForPatient = (id, files, userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy thông tin bệnh nhân dựa trên id
            let patient = await patientService.getDetailPatient(id);

            // Lấy thông tin bác sĩ của bệnh nhân
            let doctor = await db.User.findOne({
                where: { id: patient.doctorId },
                attributes: ['name', 'avatar'],
            });

            // Lấy userID từ session.user
            // Lưu ý: Trong một ứng dụng thực tế, bạn cần kiểm tra xem session.user có tồn tại không trước khi truy cập vào nó
            let currentUserID = userID;

            // Tạo mật khẩu dựa trên thông tin của bệnh nhân
            let name = removeAccents(patient.name).split(' ').join('').toLowerCase();
            let phone = patient.phone.substring(0, 3);
            let year = patient.year.substring(2, 4);
            let password = `${name}-${phone}-${year}`;

            // Tạo đối tượng Minizip để nén các tệp tin
            let mz = new Minizip();
            files.forEach((file) => {
                let fileSendToPatient = fs.readFileSync(file.path);
                mz.append(file.originalname, fileSendToPatient, { password: password });
            });

            // Tạo tên và đường dẫn tệp tin ZIP
            let nameZip = `${Date.now()}-patientId-${id}.zip`;
            let pathZip = `${PATH_ZIP}/${nameZip}`;

            // Ghi tệp tin ZIP vào đĩa
            fs.writeFileSync(pathZip, new Buffer(mz.zip()));

            // Tạo tên tệp tin đính kèm cho email
            let filename = `Information-invoice-${patient.dateBooking}.zip`;

            // Dữ liệu gửi kèm trong email
            let data = { doctor: doctor.name };

            // Gửi email với tệp tin đính kèm
            await mailer.sendEmailWithAttachment(
                patient.email,
                transMailRemedy.subject,
                transMailRemedy.template(data),
                filename,
                pathZip
            );

            // Cập nhật trạng thái đã gửi biểu mẫu cho bệnh nhân
            await patient.update({
                isSentForms: true,
                // Cập nhật userID
                userID: currentUserID,
            });

            // Nếu bệnh nhân có thông tin bổ sung
            if (patient.ExtraInfo) {
                let image = JSON.parse(patient.ExtraInfo.sendForms);
                let count = 0;
                if (image) {
                    count = Object.keys(image).length;
                } else {
                    image = {};
                }

                // Thêm tên các tệp tin đã gửi vào thông tin bổ sung của bệnh nhân
                files.forEach((x, index) => {
                    image[count + index] = x.filename;
                });

                // Cập nhật thông tin bổ sung của bệnh nhân với các tệp tin đã gửi
                await patient.ExtraInfo.update({
                    sendForms: JSON.stringify(image),
                });
            }

            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let getDoctorForFeedbackPage = (doctorId, patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Truy vấn thông tin của bác sĩ
            let doctor = await db.User.findOne({
                where: { id: doctorId },
                attributes: ['id', 'name', 'avatar'],
            });
            if (!doctor) {
                reject(`Can't get feedback with doctorId=${doctorId}`);
            }

            // Truy vấn thông tin của bệnh nhân
            let patient = await db.Patient.findOne({
                where: { id: patientId },
                attributes: ['id', 'name', 'phone', 'timeBooking', 'dateBooking'],
            });
            if (!patient) {
                reject(`Can't get feedback with patientId=${patientId}`);
            }

            // Thêm thông tin của bệnh nhân vào đối tượng bác sĩ
            doctor.setDataValue('patientId', patient.id);
            doctor.setDataValue('patientName', patient.name);
            doctor.setDataValue('patientPhone', patient.phone);

            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

let createFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorId = data.doctorId;
            let phone = data.feedbackPhone;
            //check patient

            let patient = await db.Patient.findOne({
                where: {
                    doctorId: doctorId,
                    phone: phone,
                    statusId: statusSuccessId,
                },
                attributes: ['name', 'phone', 'timeBooking', 'dateBooking', 'statusId'],
            });

            if (patient) {
                let feedback = {
                    doctorId: doctorId,
                    name: patient.name,
                    timeBooking: patient.timeBooking,
                    dateBooking: patient.dateBooking,
                    phone: phone,
                    content: data.feedbackContent,
                    status: patient.statusId,
                    createdAt: Date.now(),
                };
                let cm = await db.Comment.create(feedback);
                resolve(cm);
            } else {
                resolve('patient not exist');
            }
        } catch (e) {
            reject(e);
        }
    });
};
let deleteTimeByDate = async (idDoctor, timeDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!timeDate || !idDoctor) {
                resolve({
                    errCode: 1,
                    errMessage: 'khong co idDoctor or ko co ngay.',
                });
            }
            let doctorSchedule = await db.Schedule.findOne({
                where: { doctorId: idDoctor, date: timeDate },
            });
            if (!doctorSchedule) {
                resolve({
                    errCode: 2,
                    errMessage: 'Bac si chua tao lich cua ngay do',
                });
            } else {
                await db.Schedule.destroy({
                    where: {
                        doctorId: idDoctor,
                        date: timeDate,
                    },
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete success!',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getInfoDoctorsByCriteria = (dulieu, loai) => {
    return new Promise(async (resolve, reject) => {
        try {
            let criteria = { roleId: 2 }; // Default criteria for doctor role
            if (loai === 'phone') {
                criteria.phone = {
                    [Op.like]: `%${dulieu}%`,
                };
            } else if (loai === 'name') {
                criteria.name = {
                    [Op.like]: `%${dulieu}%`,
                };
            } else if (loai === 'specializationId') {
                // Assuming you have a Sequelize model named `Specialization`
                const specialization = await db.Specialization.findOne({
                    where: {
                        name: {
                            [Op.like]: `%${dulieu}%`,
                        },
                    },
                });
                if (specialization) {
                    criteria['$Doctor_User.specializationId$'] = specialization.id;
                } else {
                    // If specialization not found, return empty array
                    resolve([]);
                    return;
                }
            } else {
                reject(new Error('Invalid criteria'));
                return;
            }

            let doctors = await db.User.findAll({
                where: criteria,
                include: [
                    { model: db.Doctor_User, required: false },
                    { model: db.Patient, required: false, where: { statusId: 1 } },
                ],
            });

            await Promise.all(
                doctors.map(async (doctor) => {
                    if (doctor.Doctor_User) {
                        let specialization = await helper.getSpecializationById(doctor.Doctor_User.specializationId);
                        let countBooking = doctor.Patients.length;
                        doctor.setDataValue('specializationName', specialization.name);
                        doctor.setDataValue('countBooking', countBooking);
                    } else {
                        doctor.setDataValue('specializationName', 'null');
                        doctor.setDataValue('countBooking', 0);
                    }
                    return doctor;
                })
            );

            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    });
};

let createTimeOff = async (doctorId, dataRequest) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: doctorId },
            });
            if (!doctor) {
                resolve({
                    errCode: 1,
                    errMessage: 'Doctor not found!',
                });
                return;
            }
            console.log(': ', dataRequest);
            let startDate = moment(dataRequest.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            let endDate = moment(dataRequest.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            let timeOff = await db.TimeOffs.create({
                doctorId: doctorId,
                startDate: startDate,
                endDate: endDate,
                reason: dataRequest.reason,
                statusId: 3, // Default statusId
                approverId: null, // ApproverId is empty
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            resolve({
                errCode: 0,
                errMessage: 'Time off created successfully!',
                timeOff,
            });
        } catch (error) {
            reject(error);
        }
    });
};
let getTimeOffByDoctorId = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeOffs = await db.TimeOffs.findAll({
                where: { doctorId: doctorId },
                attributes: ['startDate', 'endDate', 'reason', 'statusId'],
                order: [['createdAt', 'DESC']],
            });
            resolve(timeOffs);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getDoctorForFeedbackPage: getDoctorForFeedbackPage,
    getDoctorWithSchedule: getDoctorWithSchedule,
    postCreateSchedule: postCreateSchedule,
    createPatient: createPatient,
    getPostForDoctor: getPostForDoctor,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getDoctorsForSpecialization: getDoctorsForSpecialization,
    getInfoDoctorById: getInfoDoctorById,
    deleteDoctorById: deleteDoctorById,
    getDoctorForEditPage: getDoctorForEditPage,
    updateDoctorInfo: updateDoctorInfo,
    getPatientsBookAppointment: getPatientsBookAppointment,
    getDoctorSchedules: getDoctorSchedules,
    getPlacesForDoctor: getPlacesForDoctor,
    sendFormsForPatient: sendFormsForPatient,
    createFeedback: createFeedback,
    getPatientForEditPage: getPatientForEditPage,
    getSpecializationById: getSpecializationById,
    deleteTimeByDate: deleteTimeByDate,
    getScheduleDoctorByDateSumBooking: getScheduleDoctorByDateSumBooking,
    getPatientBooking: getPatientBooking,
    getInfoDoctorsByCriteria: getInfoDoctorsByCriteria,

    updateProfile: updateProfile,
    createTimeOff: createTimeOff,
    getTimeOffByDoctorId: getTimeOffByDoctorId,
};
