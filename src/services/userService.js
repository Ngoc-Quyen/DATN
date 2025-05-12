import bcrypt from 'bcryptjs';
import db from './../models';
import helper from '../helper/client';
import elastic from './../config/elastic';
import _, { orderBy } from 'lodash';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import moment from 'moment';
const {
    getDaysInMonth,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    getDay,
    addDays,
    getWeek,
    parseISO,
} = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

let salt = 7;

let createDoctor = (doctor) => {
    doctor.roleId = 2;
    doctor.password = bcrypt.hashSync(doctor.password, salt);
    return new Promise(async (resolve, reject) => {
        let newDoctor = await db.User.create(doctor);
        let item = {
            doctorId: newDoctor.id,
            specializationId: doctor.specializationId,
        };
        await db.Doctor_User.create(item);

        //create doctor elastic
        resolve(newDoctor);
    });
};

let getInfoDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 2 },
                include: [
                    { model: db.Doctor_User, required: false },
                    { model: db.Patient, required: false, where: { statusId: 1 } },
                ],
                order: [['id', 'ASC']], // Sắp xếp theo id tăng dần
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
let getInfoDoctorsPaging = async (limit, offset) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { count, rows: doctors } = await db.User.findAndCountAll({
                where: { roleId: 2 },
                attributes: ['id', 'name', 'isActive', 'phone'], // chỉ lấy các cột cần dùng
                include: [
                    {
                        model: db.Doctor_User,
                        required: false,
                        attributes: ['specializationId'],
                    },
                    // {
                    //     model: db.Patient,
                    //     required: false,
                    //     where: { statusId: 1 },
                    //     attributes: [], // nếu không cần cột nào từ Patient, có thể để [] luôn
                    // },
                ],
                order: [['id', 'ASC']],
                limit,
                offset,
            });
            let totalCount = Math.ceil(count / limit);
            await Promise.all(
                doctors.map(async (doctor) => {
                    if (doctor.Doctor_User) {
                        let specialization = await helper.getSpecializationById(doctor.Doctor_User.specializationId);
                        // let countBooking = Array.isArray(doctor.Patients) ? doctor.Patients.length : 0;
                        doctor.setDataValue('specializationName', specialization.name);
                        // doctor.setDataValue('countBooking', countBooking);
                    } else {
                        doctor.setDataValue('specializationName', 'null');
                        // doctor.setDataValue('countBooking', 0);
                    }
                    return doctor;
                })
            );
            resolve({ doctors, totalCount });
        } catch (e) {
            reject(e);
        }
    });
};
let getInforPatients = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.User.findAll({
                where: {
                    roleId: 3,
                },
                include: [
                    { model: db.Doctor_User, required: false },
                    { model: db.Patient, required: false, where: { statusId: 1 } },
                ],
            });
            resolve(patients);
        } catch (error) {
            reject(error);
        }
    });
};
let findUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
                raw: true,
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
};

let comparePassword = (password, user) => {
    return bcrypt.compare(password, user.password);
};

let findUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                // attributes: ['id', 'name', 'avatar', 'roleId', 'isActive'],
                extends: ['password'],
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
};

let getUserById = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idUser) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing define!',
                });
            }
            let user = await db.User.findOne({
                where: { id: idUser },
                extends: 'password',
            });
            if (!user) {
                resolve({
                    errCode: 0,
                    errMessage: 'Khong co user nao voi id nay',
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Success',
                    data: user,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

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

let getInfoStatistical = (month) => {
    return new Promise(async (resolve, reject) => {
        try {
            let year = moment().year();
            let startDate = Date.parse(stringToDate(`01/${month}/${year}`, 'dd/MM/yyyy', '/'));
            let endDate = Date.parse(stringToDate(`31/${month}/${year}`, 'dd/MM/yyyy', '/'));
            let bestDoctorCount = 0;
            let patients = await db.Patient.findAndCountAll({
                attributes: ['id', 'doctorId'],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });

            let doctors = await db.User.findAndCountAll({
                attributes: ['id'],
                where: {
                    roleId: 2,
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });

            let posts = await db.Post.findAndCountAll({
                attributes: ['id', 'writerId'],
                // where: {
                //     forSpecializationId: -1,
                //     forDoctorId: -1,
                //     createdAt: {
                //         [Op.between]: [startDate, endDate],
                //     },
                // },
            });

            let bestDoctor = '';

            if (+patients.count > 0) {
                let bestDoctorIdArr = _(patients.rows)
                    .groupBy('doctorId')
                    .map((v, doctorId) => ({
                        doctorId,
                        patientId: _.map(v, 'id'),
                    }))
                    .value();
                let doctorObject = _.maxBy(bestDoctorIdArr, function (o) {
                    return o.patientId.length;
                });
                bestDoctor = await db.User.findOne({
                    where: {
                        id: doctorObject.doctorId,
                    },
                    attributes: ['id', 'name'],
                });
                // Thêm giá trị 'count' trực tiếp vào đối tượng Sequelize
                bestDoctor.dataValues.count = doctorObject.patientId.length;
                bestDoctorCount = doctorObject.patientId.length;
            }
            resolve({
                patients: patients,
                doctors: doctors,
                posts: posts,
                bestDoctor: bestDoctor,
                bestDoctorCount: bestDoctorCount,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let convertToString = async (dateString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [day, month, year] = dateString.split('/').map(Number);
            let date = new Date(year, month - 1, day);
            resolve(date);
        } catch (error) {
            reject(error);
        }
    });
};
let getInfoDoctorChart = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date(); // Lấy thời gian hiện tại
            const year = now.getFullYear(); // Năm hiện tại
            const month = now.getMonth(); // Tháng hiện tại (0-11)

            const startDate = new Date(year, month, 1, 0, 0, 0); // Ngày đầu tháng lúc 00:00:00
            const endDate = new Date(year, month + 1, 0, 23, 59, 59); // Ngày cuối tháng lúc 23:59:59

            const patients = await db.Patient.findAndCountAll({
                attributes: ['id', 'doctorId', 'statusId', 'isSentForms'],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                    doctorId: doctorId,
                },
            });

            resolve({ patients: patients });
        } catch (e) {
            reject(e);
        }
    });
};

let createAllDoctorsSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeArr = [
                '08:00 - 09:00',
                '09:00 - 10:00',
                '10:00 - 11:00',
                '11:00 - 12:00',
                '13:00 - 14:00',
                '14:00 - 15:00',
                '15:00 - 16:00',
                '16:00 - 17:00',
            ];
            let sevenDaySchedule = [];
            for (let i = 0; i < 7; i++) {
                let date = moment(new Date()).add(i, 'days').locale('vi').format('DD/MM/YYYY');
                sevenDaySchedule.push(date);
            }

            let doctors = await db.User.findAll({
                where: {
                    roleId: 2,
                },
                attributes: ['id', 'name'],
                raw: true,
            });

            // Check if appointments are created before
            let isCreatedBefore = false;

            // Check the first doctor with date and time
            let check = await db.Schedule.findAll({
                where: {
                    doctorId: doctors[0].id,
                    date: sevenDaySchedule[0],
                    time: timeArr[0],
                },
            });

            if (check && check.length > 0) {
                isCreatedBefore = true;
            }

            if (!isCreatedBefore) {
                if (doctors && doctors.length > 0) {
                    await Promise.all(
                        doctors.map((doctor) => {
                            sevenDaySchedule.map((day) => {
                                timeArr.map(async (time) => {
                                    let schedule = {
                                        doctorId: doctor.id,
                                        date: day,
                                        time: time,
                                        maxBooking: 2,
                                        sumBooking: 0,
                                    };
                                    await db.Schedule.create(schedule);
                                });
                            });
                        })
                    );
                    resolve(
                        'Cuộc hẹn được tạo thành công (trong 7 ngày). Vui lòng kiểm tra cơ sở dữ liệu của bạn (schedule table)'
                    );
                }
            } else {
                resolve('Các cuộc hẹn bị trùng lặp. Vui lòng kiểm tra cơ sở dữ liệu của bạn (schedule table)');
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllDoctorsSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                attributes: ['doctorId', 'date', 'time'],
                raw: true,
            });
            resolve(schedules);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let supporters = await db.User.findAll({
                where: { roleId: 3 },
            });

            resolve(supporters);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllCodeService = async (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameder!!',
                });
            } else {
                let res = {};
                let allcode = await db.Allcodes.findAll({
                    where: { type: typeInput },
                    raw: true,
                });
                res.errCode = 0;
                res.data = allcode;
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: allcode,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); //thay vi dung return
        } catch (error) {
            reject(error);
        }
    });
};
let updateUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required Parameter!',
                });
            }
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false,
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`,
                });
            } else {
                let hashPassword = await hashUserPassword(data.password);
                user.name = data.name;
                user.address = data.address;
                user.phone = data.phone;
                user.birthday = data.birthday;
                user.avatar = data.avatar;
                user.password = hashPassword;
                user.roleId = data.roleId;
                user.isActive = data.isActive;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success!',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let updateUserDataFile = async (data, filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required Parameter!',
                });
            }
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false,
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: `user's not found!`,
                });
            } else {
                user.name = data.name;
                user.description = data.description;
                user.phone = data.phone;
                user.gender = data.gender;
                user.address = data.address;
                let url = filePath;
                if (url) {
                    user.avatar = url;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success!',
                    user,
                });
            }
        } catch (error) {
            reject(error);
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
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: `user's not found!`,
                });
            } else {
                user.name = data.name;
                user.description = data.description;
                user.address = data.address;
                user.phone = data.phone;
                user.gender = data.gender;
                user.birthday = data.birthday;
                user.isActive = data.isActive;
                // Nếu có file ảnh được upload, gửi ảnh lên Firebase và lấy URL
                let url = data.avatar;
                if (url) {
                    user.avatar = url;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success!',
                    user,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const emailExists = await checkUserEmail(data.email);
            if (emailExists) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã tồn tại trong hệ thống. Vui lòng sử dụng một email khác.',
                });
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                name: data.name,
                phone: data.phone,
                birthday: data.birthday,
                avatar: data.avatar,
                gender: data.gender,
                address: data.address,
                description: data.description,
                roleId: '3',
                isActive: 1,
            });
            // console.log(data);
            resolve({
                errCode: 0,
                errMessage: 'OK',
            });
        } catch (error) {
            reject(error);
        }
    });
};
let deleteUserById = async (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idUser) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing define!!',
                });
            }
            await db.User.destroy({
                where: { id: idUser },
            });
            resolve({
                errCode: 0,
                errMessage: 'success',
            });
        } catch (error) {
            reject(error);
        }
    });
};
let getUserByPhone = async (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customers = await db.User.findAll({
                where: {
                    phone: phone,
                },
                raw: true,
            });
            if (customers) {
                resolve({
                    errCode: 0,
                    errMessage: 'success',
                    customers: customers,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Khong co user voi so dien thoai nay',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let updatePassword = (email, currentPass, newPass, confirmPass) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email || !currentPass || !newPass || !confirmPass) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters: email, currentPass, newPass, confirmPass',
                });
                return;
            }

            let user = await db.User.findOne({ where: { email } });

            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found!',
                });
                return;
            }

            bcrypt.compare(currentPass, user.password, (err, passwordMatch) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!passwordMatch) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Current password is incorrect!',
                    });
                    return;
                }

                if (newPass !== confirmPass) {
                    resolve({
                        errCode: 4,
                        errMessage: 'New password and confirm password do not match!',
                    });
                    return;
                }

                bcrypt.hash(newPass, salt, async (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    await user.update({ password: hashedPassword });

                    resolve({
                        errCode: 0,
                        errMessage: 'Password updated successfully!',
                    });
                });
            });
        } catch (error) {
            resolve({
                errCode: 5,
                errMessage: `Error updating password: ${error.message}`,
            });
        }
    });
};

let checkCurrentPassword = (email, currentPass) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email } });

            if (!user) {
                resolve({ correct: false });
                return;
            }

            bcrypt.compare(currentPass, user.password, (err, passwordMatch) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ correct: passwordMatch });
            });
        } catch (error) {
            console.error('Error checking current password:', error);
            resolve({ correct: false });
        }
    });
};

let updateInfor = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required Parameter!',
                });
            }
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false,
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`,
                });
            } else {
                // Update user information with provided data
                user.name = data.name;
                user.address = data.address;
                user.phone = data.phone;
                user.gender = data.gender;
                user.birthday = data.formatted;
                // Save the updated user object
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update user information successfully!',
                });
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            reject({
                errCode: 3,
                errMessage: 'Failed to update user information!',
            });
        }
    });
};

let _generateScheduleForSpecialization = (specializationId, month, year, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {}
    });
};
let handleCreateScheduleAll = async () => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            console.log('Error: ', error);
        }
    });
};

module.exports = {
    createDoctor: createDoctor,
    getInfoDoctors: getInfoDoctors,
    getInfoDoctorsPaging: getInfoDoctorsPaging,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword,
    getInfoStatistical: getInfoStatistical,
    getInfoDoctorChart: getInfoDoctorChart,
    createAllDoctorsSchedule: createAllDoctorsSchedule,
    getAllDoctorsSchedule: getAllDoctorsSchedule,
    getAllUsers: getAllUsers,
    getAllCodeService: getAllCodeService,
    updateUser: updateUser,
    updateUserDataFile: updateUserDataFile,
    createNewUser: createNewUser,
    updateProfile: updateProfile,
    getUserById: getUserById,
    deleteUserById: deleteUserById,
    getUserByPhone: getUserByPhone,
    updatePassword: updatePassword,
    checkCurrentPassword: checkCurrentPassword,
    updateInfor: updateInfor,
    handleCreateScheduleAll: handleCreateScheduleAll,
    _generateScheduleForSpecialization: _generateScheduleForSpecialization,
};
