import db from '../models/index.js';
// import mailer from '../config/mailer.js';
import {
    transMailBookingNew,
    transMailBookingSuccess,
    transMailBookingFailed,
    mailEnd,
    transMailRemedy,
} from '../../lang/en.js';
// const { mailer } = require('../config/mailer');
import mailer from '../config/mailer.js';

const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;
const MAX_BOOKING = 3;
let getInfoBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Patient.findOne({
                where: { id: id },
                attributes: ['id', 'doctorId', 'timeBooking', 'dateBooking'],
            });

            if (!patient) {
                reject(`Can't get patient with id = ${id}`);
            }
            let reasonCancel = await db.AdminLog.findOne({
                where: { patientId: patient.id },
                attributes: ['id', 'content', 'updatedAt'],
            });
            let historyResult = await db.ExtraInfo.findOne({
                where: { patientId: patient.id },
                attributes: ['id', 'historyBreath', 'moreInfo'],
            });
            let doctor = await db.User.findOne({
                where: { id: patient.doctorId },
                attributes: ['name', 'avatar'],
            });

            patient.setDataValue('doctorName', doctor.name);
            patient.setDataValue('doctorAvatar', doctor.avatar);
            patient.setDataValue('patientTime', patient.timeBooking);
            patient.setDataValue('patientDate', patient.dateBooking);
            patient.setDataValue('contentCancel', reasonCancel.content);
            patient.setDataValue('resultPatient', historyResult.historyBreath);
            patient.setDataValue('moreInfoPatient', historyResult.moreInfo);
            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let getForPatientsTabs = async (idDoctor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date();
            // Format today as yyyy-MM-dd (remove time part)
            const todayStr = today.toISOString().slice(0, 10);

            let newPatients = await db.Patient.findAll({
                where: {
                    statusId: statusNewId,
                    doctorId: idDoctor,
                    dateBooking: {
                        [db.Sequelize.Op.gte]: todayStr,
                    },
                },
                order: [['updatedAt', 'ASC']],
            });

            let pendingPatients = await db.Patient.findAll({
                where: {
                    statusId: statusPendingId,
                    doctorId: idDoctor,
                },
                order: [['updatedAt', 'DESC']],
            });

            let confirmedPatients = await db.Patient.findAll({
                where: {
                    statusId: statusSuccessId,
                    doctorId: idDoctor,
                },
                order: [['updatedAt', 'DESC']],
            });

            let canceledPatients = await db.Patient.findAll({
                where: {
                    statusId: statusFailedId,
                    doctorId: idDoctor,
                },
                order: [['updatedAt', 'DESC']],
            });

            resolve({
                newPatients: newPatients,
                pendingPatients: pendingPatients,
                confirmedPatients: confirmedPatients,
                canceledPatients: canceledPatients,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getForPatientsByDateTabs = async (idDoctor, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newPatients = await db.Patient.findAll({
                where: {
                    statusId: statusNewId,
                    doctorId: idDoctor,
                    dateBooking: date,
                },
                order: [['updatedAt', 'ASC']],
            });

            let pendingPatients = await db.Patient.findAll({
                where: {
                    statusId: statusPendingId,
                    doctorId: idDoctor,
                    dateBooking: date,
                },
                order: [['updatedAt', 'ASC']],
            });

            let confirmedPatients = await db.Patient.findAll({
                where: {
                    statusId: statusSuccessId,
                    doctorId: idDoctor,
                    dateBooking: date,
                },
                order: [['updatedAt', 'ASC']],
            });

            let canceledPatients = await db.Patient.findAll({
                where: {
                    statusId: statusFailedId,
                    doctorId: idDoctor,
                    dateBooking: date,
                },
                order: [['updatedAt', 'ASC']],
            });

            resolve({
                newPatients: newPatients,
                pendingPatients: pendingPatients,
                confirmedPatients: confirmedPatients,
                canceledPatients: canceledPatients,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getForPatientForUser = async (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date();
            // Format today as yyyy-MM-dd (remove time part)
            const todayStr = today.toISOString().slice(0, 10);

            let newPatients = await db.Patient.findAll({
                where: {
                    statusId: statusNewId,
                    userId: idUser,
                    dateBooking: {
                        [db.Sequelize.Op.gte]: todayStr,
                    },
                },
                order: [['updatedAt', 'ASC']],
            });
            let pendingPatients = await db.Patient.findAll({
                where: {
                    statusId: statusPendingId,
                    userId: idUser,
                },
                order: [['updatedAt', 'DESC']],
            });

            let confirmedPatients = await db.Patient.findAll({
                where: {
                    statusId: statusSuccessId,
                    userId: idUser,
                },
                order: [['updatedAt', 'DESC']],
            });

            let canceledPatients = await db.Patient.findAll({
                where: {
                    statusId: statusFailedId,
                    userId: idUser,
                },
                order: [['updatedAt', 'DESC']],
            });

            resolve({
                newPatients: newPatients,
                pendingPatients: pendingPatients,
                confirmedPatients: confirmedPatients,
                canceledPatients: canceledPatients,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let changeStatusPatientForUser = (data, logs) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Patient.findOne({
                where: { id: data.id },
            });

            let user = await db.User.findOne({
                where: { id: patient.userId },
                attributes: ['name', 'avatar', 'id'],
            });

            // //update tổng số lượt đặt bác sĩ khi status = thành công
            // if (data.statusId === statusSuccessId) {
            //     let schedule = await db.Schedule.findOne({
            //         where: { userId: patient.userId, time: patient.timeBooking, date: patient.dateBooking },
            //     });

            //     let sum = +schedule.sumBooking;
            //     await schedule.update({ sumBooking: sum + 1 });
            // }

            //update tổng số lượt cho user khi status = hủy
            if (data.statusId === statusFailedId) {
                let schedule = await db.Schedule.findOne({
                    where: { userId: patient.userId, time: patient.timeBooking, date: patient.dateBooking },
                });

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum - 1 });
            }

            await patient.update(data);
            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let changeStatusPatient = (data, logs, historyBreath, moreInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Patient.findOne({
                where: { id: data.id },
            });

            let doctor = await db.User.findOne({
                where: { id: patient.doctorId },
                attributes: ['name', 'avatar'],
            });

            //update tổng số lượt đặt bác sĩ khi status = thành công
            if (data.statusId === statusSuccessId) {
                let schedule = await db.Schedule.findOne({
                    where: { doctorId: patient.doctorId, time: patient.timeBooking, date: patient.dateBooking },
                });

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum + 1 });
            }

            //update tổng số lượt đặt bác sĩ khi status = hủy
            if (data.statusId === statusFailedId) {
                let schedule = await db.Schedule.findOne({
                    where: { doctorId: patient.doctorId, time: patient.timeBooking, date: patient.dateBooking },
                });

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum - 1 });
            }

            await patient.update(data);

            //update logs
            let log = await db.AdminLog.create(logs);

            //send email
            if (data.statusId === statusPendingId) {
                let dataSend = {
                    time: patient.timeBooking,
                    date: patient.dateBooking,
                    doctor: doctor.name,
                };
                await mailer.sendEmailNormal(
                    patient.email,
                    transMailBookingSuccess.subject,
                    transMailBookingSuccess.template(dataSend)
                );
            }
            if (data.statusId === statusFailedId && patient.email) {
                let dataSend = {
                    time: patient.timeBooking,
                    date: patient.dateBooking,
                    doctor: doctor.name,
                    reason: log.content,
                };
                await mailer.sendEmailNormal(
                    patient.email,
                    transMailBookingFailed.subject,
                    transMailBookingFailed.template(dataSend)
                );
            }
            if (data.statusId === statusSuccessId) {
                let dataSend = {
                    time: patient.timeBooking,
                    date: patient.dateBooking,
                    doctor: doctor.name,
                    moreInfo: moreInfo,
                    result: historyBreath,
                };
                await mailer.sendEmailNormal(patient.email, mailEnd.subject, mailEnd.template(dataSend));
            }

            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let isBookAble = async (doctorId, date, time) => {
    let schedule = await db.Schedule.findOne({
        where: {
            doctorId: doctorId,
            date: date,
            time: time,
        },
        attributes: ['id', 'doctorId', 'date', 'time', 'maxBooking', 'sumBooking'],
    });

    if (schedule) {
        return schedule.sumBooking < schedule.maxBooking;
    }
    return false;
};
let createNewPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: data.doctorId,
                    date: data.dateBooking,
                    time: data.timeBooking,
                },
            });

            if (!schedule) {
                // Nếu chưa có schedule, tạo mới
                schedule = await db.Schedule.create({
                    doctorId: data.doctorId,
                    date: data.dateBooking,
                    time: data.timeBooking,
                    maxBooking: MAX_BOOKING,
                    sumBooking: 1,
                });

                let patient = await db.Patient.create(data);
                data.patientId = patient.id;
                await db.ExtraInfo.create(data);

                let doctor = await db.User.findOne({
                    where: { id: patient.doctorId },
                    attributes: ['id', 'name', 'avatar'],
                });

                let logs = {
                    patientId: patient.id,
                    content: 'The patient made an appointment from the system ',
                    createdAt: Date.now(),
                };
                await db.AdminLog.create(logs);
                let dataSend = {
                    time: patient.timeBooking,
                    date: patient.dateBooking,
                    doctor: doctor.name,
                };

                let isEmailSend = await mailer.sendEmailNormal(
                    patient.email,
                    transMailBookingNew.subject,
                    transMailBookingNew.template(dataSend)
                );
                if (!isEmailSend) {
                    console.log('An error occurs when sending an email to: ' + patient.email);
                    console.log(isEmailSend);
                }

                resolve(patient);
            } else if (schedule.sumBooking < schedule.maxBooking) {
                // Nếu đã có schedule và còn slot
                let patient = await db.Patient.create(data);
                data.patientId = patient.id;
                await db.ExtraInfo.create(data);

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum + 1 });

                let doctor = await db.User.findOne({
                    where: { id: patient.doctorId },
                    attributes: ['name', 'avatar'],
                });

                let logs = {
                    patientId: patient.id,
                    content: 'The patient made an appointment from the system ',
                    createdAt: Date.now(),
                };

                await db.AdminLog.create(logs);

                let dataSend = {
                    time: patient.timeBooking,
                    date: patient.dateBooking,
                    doctor: doctor.name,
                };

                let isEmailSend = await mailer.sendEmailNormal(
                    patient.email,
                    transMailBookingNew.subject,
                    transMailBookingNew.template(dataSend)
                );
                if (!isEmailSend) {
                    console.log('An error occurs when sending an email to: ' + patient.email);
                    console.log(isEmailSend);
                }
                resolve(patient);
            } else {
                resolve('MAX BOOKING');
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getDetailPatient = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await db.Patient.findOne({
                where: { id: id },
                include: { model: db.ExtraInfo, required: false },
                include: { model: db.ExtraInfo, required: false },
                include: { model: db.User, required: false },
            });
            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

let getLogsPatient = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let logs = await db.AdminLog.findAll({
                where: {
                    patientId: id,
                },
            });

            if (logs.length) {
                await Promise.all(
                    logs.map(async (log) => {
                        if (log.adminId) {
                            let admin = await db.User.findOne({
                                where: { id: log.adminId },
                                attributes: ['name'],
                            });
                            log.setDataValue('adminName', admin.name);
                        } else {
                            log.setDataValue('adminName', '');
                        }
                        return log;
                    })
                );
            }
            resolve(logs);
        } catch (e) {
            reject(e);
        }
    });
};

let getComments = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let comments = await db.Comment.findAll({
                where: {
                    status: false,
                },
            });
            resolve(comments);
        } catch (e) {
            reject(e);
        }
    });
};
let updateExtrainfos = async (id, historyBreath, moreInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let extrainfos = await db.ExtraInfo.findOne({
                where: {
                    patientId: id,
                },
            });
            if (!extrainfos) {
                return res.status(200).json({
                    message: 'khong co patient trong bang extrainfor!!',
                });
            }
            extrainfos.historyBreath = historyBreath;
            extrainfos.moreInfo = moreInfo;
            await extrainfos.save();
            resolve(extrainfos);
        } catch (error) {
            reject(error);
        }
    });
};
let getExtanInfoByPatientId = async (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Khong co patientId trong ExtanInfo',
                });
            }
            let extrainfos = await db.ExtraInfo.findOne({
                where: {
                    patientId: patientId,
                },
            });
            resolve({
                errCode: 0,
                errMessage: 'success',
                extrainfos: extrainfos,
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getInfoBooking: getInfoBooking,
    getForPatientsTabs: getForPatientsTabs,
    getForPatientForUser: getForPatientForUser,
    changeStatusPatient: changeStatusPatient,
    changeStatusPatientForUser: changeStatusPatientForUser,
    createNewPatient: createNewPatient,
    getDetailPatient: getDetailPatient,
    getLogsPatient: getLogsPatient,
    getComments: getComments,
    updateExtrainfos: updateExtrainfos,
    getExtanInfoByPatientId: getExtanInfoByPatientId,
    getForPatientsByDateTabs: getForPatientsByDateTabs,
};
