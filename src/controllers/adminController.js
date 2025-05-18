require('dotenv').config();
import postService from '../services/postService';
import patientService from '../services/patientService';
import homeService from './../services/homeService';
import userService from './../services/userService';
import specializationService from './../services/specializationService';
import customerService from '../services/customerService';
import doctorService from './../services/doctorService';
import chatFBServie from './../services/chatFBService';
import scheduleService from './../services/scheduleService';
import uploadImg from '../services/imgLoadFirebase';
import helper from '../helper/client';
import mailer from './../config/mailer';
import { mailNotificationTimeOffSuccess, mailNotificationTimeOffFail } from '../../lang/en';

import multer from 'multer';
import moment from 'moment';
import _ from 'lodash';
moment.locale('vi');
const statusNewId = 4;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;

const MAX_BOOKING = 1;

let getManageDoctor = async (req, res) => {
    let doctors = await userService.getInfoDoctors();
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/manageDoctor.ejs', {
        user: req.user,
        doctors: doctors,
        specializations: specializations,
    });
};

let getManageDoctorPaging = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 8;
    let offset = (page - 1) * limit;
    let { doctors, totalCount } = await userService.getInfoDoctorsPaging(limit, offset);

    let specializations = await homeService.getSpecializations();

    return res.render('main/users/admins/manageDoctor.ejs', {
        user: req.user,
        doctors: doctors,
        specializations: specializations,
        currentPage: page,
        totalPages: totalCount,
    });
};
let getCreateDoctor = async (req, res) => {
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/createDoctor.ejs', {
        user: req.user,
        specializations: specializations,
    });
};
let postCreateDoctor = async (req, res) => {
    let doctor = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        specializationId: req.body.specialization,
        birthday: req.body.birthday,
        gender: req.body.gender,
        address: req.body.address,
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarDoctor%2Fdoctor.jpg?alt=media&token=2cdf2069-2bf9-4a02-afff-ccbb33dd7402',
        description: req.body.description,
    };
    try {
        await userService.createDoctor(doctor);
        return res.status(200).json({ message: 'success' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
let getCreatePatient = async (req, res) => {
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/createPatient.ejs', {
        user: req.user,
        specializations: specializations,
    });
};

let getSpecializationPage = async (req, res) => {
    let specializations = await specializationService.getAllSpecializations();
    return res.render('main/users/admins/manageSpecialization.ejs', {
        user: req.user,
        specializations: specializations,
    });
};

let deleteDoctorById = async (req, res) => {
    try {
        let doctor = await doctorService.deleteDoctorById(req.body.id);
        return res.status(200).json({
            message: 'success',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getEditDoctor = async (req, res) => {
    let doctor = await doctorService.getDoctorForEditPage(req.params.id);
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/editDoctor.ejs', {
        user: req.user,
        doctor: doctor,
        specializations: specializations,
    });
};

let putUpdateDoctorWithoutFile = async (req, res) => {
    try {
        let item = {
            id: req.body.idDoctor,
            name: req.body.nameDoctor,
            phone: req.body.phoneDoctor,
            address: req.body.addressDoctor,
            description: req.body.introEditDoctor,
            specializationId: req.body.specializationDoctor,
        };
        let mess = await doctorService.updateDoctorInfo(item);
        if (mess.errCode === 0) {
            return res.status(200).json(mess);
            // return res.redirect('/users/manage/doctor');
        } else {
            return res.status(200).json(mess);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let postEditDoctor = async (req, res) => {
    try {
        let file = req.file;
        let imgUrl = '';
        if (file) {
            imgUrl = await uploadImg.uploadImg(file);
        }
        let data = {
            id: req.body.idDoctor,
            name: req.body.nameDoctor,
            phone: req.body.phoneDoctor,
            address: req.body.addressDoctor,
            description: req.body.introEditDoctor,
            specializationId: req.body.specializationDoctor,
            isActive: req.body.isActive,
            avatar: imgUrl,
        };
        // let patient = await doctorService.getPatientForEditPage(req.params.id);
        // let specializations = await homeService.getSpecializations();
        let mess = await doctorService.updateProfile(data);
        if (mess.errCode === 0) {
            return res.status(200).json(mess);
            // return res.redirect('/users/manage/customer');
        } else {
            return res.status(200).json(mess);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

let putUpdateDoctor = (req, res) => {
    imageDoctorUploadFile(req, res, async (err) => {
        if (err) {
            if (err.message) {
                return res.status(500).send(err.message);
            } else {
                return res.status(500).send(err);
            }
        }

        try {
            let item = {
                id: req.body.id,
                name: req.body.nameDoctor,
                phone: req.body.phoneDoctor,
                address: req.body.addressDoctor,
                description: req.body.introEditDoctor,
                specializationId: req.body.specializationDoctor,
            };
            let imageDoctor = req.file;
            item.avatar = imageDoctor.filename;
            let doctor = await doctorService.updateDoctorInfo(item);
            return res.status(200).json({
                message: 'update doctor info successful',
                doctor: doctor,
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    });
};

let storageImageDoctor = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/images/users');
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    },
});

let imageDoctorUploadFile = multer({
    storage: storageImageDoctor,
    limits: { fileSize: 1048576 * 20 },
}).single('avatar');

let getCustomerPage = async (req, res) => {
    let phone = req.body.phone;
    let customers = '';
    if (!phone) {
        customers = await customerService.getAllcustomers();
    } else {
        customers = await customerService.getUserByPhone(phone);
    }

    return res.render('main/users/admins/manageCustomer.ejs', {
        user: req.user,
        customers: customers,
        phone: phone,
    });
};

let getCustomerPaging = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 8;
    let offset = (page - 1) * limit;
    let phone = req.body.phone;
    let customers = [];
    let totalPages = 0;
    if (!phone) {
        // Nếu không có số điện thoại, chỉ phân trang
        ({ customers, totalPages } = await customerService.getAllCustomersPaging(limit, offset));
    } else {
        // Tìm kiếm theo số điện thoại và phân trang
        ({ customers, totalPages } = await customerService.getCustomerByPhone(phone, limit, offset));
    }

    return res.render('main/users/admins/manageCustomer.ejs', {
        user: req.user,
        customers: customers,
        currentPage: page,
        phone: phone,
        totalPages: totalPages,
    });
};

let getCustomerByPhone = async (req, res) => {
    let phone = req.body.phone;

    try {
        let customers = await customerService.getCustomerByPhone(phone);
        return res.json({ customers });
    } catch (e) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
};
let deleteSpecializationById = async (req, res) => {
    try {
        await specializationService.deleteSpecializationById(req.body.id);
        return res.status(200).json({
            message: 'delete specialization successful',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageBotPage = async (req, res) => {
    try {
        return res.send("Hello word. You'll need a witAI account. More info: please comment on my youtube channel.");
        // let entities = await chatFBServie.getWitEntitiesWithExpression();
        // let entityName = await chatFBServie.getWitEntities();
        // return res.render('main/users/admins/manageBot.ejs', {
        //     user: req.user,
        //     entities: entities,
        //     entityName: entityName
        // });
    } catch (e) {
        console.log(e);
    }
};

let deletePostById = async (req, res) => {
    try {
        await postService.deletePostById(req.body.id);
        return res.status(200).json({
            message: 'delete post successful',
        });
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
        return res.render('main/users/admins/editPost.ejs', {
            doctors: doctors,
            specializations: specializations,
            user: req.user,
            post: post,
        });
    } catch (e) {
        console.log(e);
    }
};

let putUpdatePost = async (req, res) => {
    try {
        let data = {
            id: req.body.id,
            title: req.body.titlePost,
            forDoctorId: req.body.forDoctorId,
            forSpecializationId: req.body.forSpecializationId,
            // writerId: req.user.id,
            contentMarkdown: req.body.contentMarkdown,
            contentHTML: req.body.contentHTML,
            updatedAt: Date.now(),
            isActive: req.body.isActive,
        };

        await postService.putUpdatePost(data);
        return res.status(200).json({
            message: 'update post successful',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageCreateScheduleForDoctorsPage = async (req, res) => {
    try {
        return res.render('main/users/admins/manageScheduleForDoctors.ejs', {
            user: req.user,
        });
    } catch (e) {
        console.log(e);
    }
};
let getNewPatients = (req, res) => {
    let currentDate = moment().format('DD/MM/YYYY');
    let date = '';
    let canActive = false;
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }
    return res.render('main/users/admins/manageBooking.ejs', {
        user: req.user,
        date: date,
    });
};

let getAllPosts = async (req, res) => {
    try {
        let posts = await postService.getAllPosts();
        return res.status(200).json({ data: posts });
    } catch (e) {
        return res.status(500).json(e);
    }
};
let getPostByWriteId = async (req, res) => {
    try {
        let posts = await postService.getPostByWriteId(req.user.id);
        return res.status(200).json({ data: posts });
        return;
    } catch (error) {
        return res.status(500).json(error);
    }
};
let getCreatePost = async (req, res) => {
    let doctors = await userService.getInfoDoctors();
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/createPost.ejs', {
        user: req.user,
        doctors: doctors,
        specializations: specializations,
    });
};

let postCreatePost = async (req, res) => {
    try {
        let item = req.body;
        item.writerId = req.user.id;
        item.createdAt = Date.now();
        item.isActive = 0;
        let post = await postService.postCreatePost(item);
        return res.status(200).json({
            status: 1,
            message: post,
        });
    } catch (e) {
        return res.status(500).json(e);
    }
};

let getManagePosts = async (req, res) => {
    try {
        let role = {};
        let object = {};
        if (req.user) {
            if (req.user.roleId === 1) {
                role = {
                    roleName: 'admin',
                    userId: req.user.id,
                };
                object = await postService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
                return res.render('main/users/admins/managePost.ejs', {
                    user: req.user,
                    posts: object.posts,
                    total: object.total,
                });
            }
            if (req.user.roleId === 2) {
                role = {
                    roleName: 'doctor',
                    userId: req.user.id,
                };
                object = await postService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
                return res.render('main/users/admins/managePostByDoctor.ejs', {
                    user: req.user,
                    posts: object.posts,
                    total: object.total,
                });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getPostsPagination = async (req, res) => {
    try {
        let page = +req.query.page;
        let limit = +process.env.LIMIT_GET_POST;
        if (!page) {
            page = 1;
        }
        let object = await postService.getPostsPagination(page, limit);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getForPatientsTabs = async (req, res) => {
    try {
        let currentDate = moment().format('DD/MM/YYYY');
        let date = '';
        let canActive = false;
        if (req.query.dateDoctorAppointment) {
            date = req.query.dateDoctorAppointment;
            if (date === currentDate) canActive = true;
        } else {
            //get currentDate
            date = currentDate;
            canActive = true;
        }
        let idDoctor = req.user.id;
        let object = await patientService.getForPatientsTabs(idDoctor);
        return res.status(200).json({
            message: 'success',
            object: object,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let getForPatientsByDateTabs = async (req, res) => {
    try {
        let currentDate = moment().format('DD/MM/YYYY');
        let canActive = false;
        let date = '';
        if (req.body.dateSearch) {
            date = req.body.dateSearch;
            if (date === currentDate) canActive = true;
        } else {
            //get currentDate
            date = currentDate;
            canActive = true;
        }

        let idDoctor = req.user.id;
        let object = await patientService.getForPatientsByDateTabs(idDoctor, date);
        return res.status(200).json({
            message: 'success',
            object: object,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postChangeStatusPatient = async (req, res) => {
    try {
        let id = req.body.patientId;
        let status = req.body.status;
        let historyBreath = req.body.historyBreath;
        let moreInfo = req.body.moreInfo;
        let statusId = '';
        let content = '';
        if (status === 'pending') {
            statusId = statusPendingId;
            content = 'Đã nhận lịch hẹn mới';
        } else if (status === 'failed') {
            statusId = statusFailedId;
            if (req.body.reason) {
                content = `${req.body.reason}`;
            }
        } else if (status === 'confirmed') {
            statusId = statusSuccessId;
            content = 'Lịch hẹn đã khám thành công';
        }

        let data = {
            id: id,
            statusId: statusId,
            updatedAt: Date.now(),
        };

        let logs = {
            adminId: req.user.id,
            patientId: id,
            content: content,
        };

        let patient = await patientService.changeStatusPatient(data, logs, historyBreath, moreInfo);
        let extrainfor = await patientService.updateExtrainfos(id, historyBreath, moreInfo);

        return res.status(200).json({
            message: 'success',
            patient: patient,
            // extrainfos: extrainfor,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getInfoStatistical = async (req, res) => {
    try {
        let month = req.body.month;
        let object = await userService.getInfoStatistical(month);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let getLogsPatient = async (req, res) => {
    try {
        let logs = await patientService.getLogsPatient(req.body.patientId);
        return res.status(200).json(logs);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postDoneComment = async (req, res) => {
    try {
        let comment = await postService.doneComment(req.body.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let postCreatePatient = async (req, res) => {
    let patient = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        address: req.body.address,
        avatar: req.user.avatar,
        description: req.body.description,
    };
    try {
        let mess = await userService.createNewUser(patient);
        console.log(mess.errMessage);
        if (mess.errCode === 0) {
            return res.redirect('/users/manage/customer');
        } else {
            return res.redirect('users/manage/customer/create');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
let getEditPatient = async (req, res) => {
    let patient = await doctorService.getPatientForEditPage(req.params.id);
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/editCustomer.ejs', {
        user: req.user,
        doctor: patient,
        specializations: specializations,
    });
};
let postEditPatient = async (req, res) => {
    try {
        let file = req.file;
        console.log('file in controller admin: ', file);
        let imgUrl = '';
        if (file) {
            imgUrl = await uploadImg.uploadImg(file);
        }

        let data = {
            id: req.body.idDoctor,
            name: req.body.nameDoctor,
            phone: req.body.phoneDoctor,
            gender: req.body.gender,
            address: req.body.addressDoctor,
            description: req.body.introEditDoctor,
            birthday: req.body.birthday,
            isActive: req.body.isActive,
            avatar: imgUrl,
        };

        let mess = await userService.updateProfile(data);
        if (mess.errCode === 0) {
            return res.redirect(`/users/customer/edit/${data.id}`);
            // return res.status(200).json({ message: mess.errMessage });
        } else {
            return res.redirect(`/users/customer/edit/${data.id}`);
            // return res.status(400).json({ message: mess.errMessage });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
let getEditSpecialization = async (req, res) => {
    let specialty = await doctorService.getSpecializationById(req.params.id);
    let specializations = await homeService.getSpecializations();

    return res.render('main/users/admins/editSpecialization.ejs', {
        user: req.user,
        specialty: specialty,
        specializations: specializations,
    });
};
let postEditSpecialization = async (req, res) => {
    let data = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
    };
    let message = await specializationService.updateSpecializationById(data);
    if (message.errCode === 0) {
        return res.redirect('/users/manage/specialization');
    } else {
        return res.render('main/users/admins/editSpecialization.ejs', {
            user: req.user,
            specialty: specialty,
            specializations: specializations,
        });
    }
};
let getCreateSpecializationPage = async (req, res) => {
    return res.render('main/users/admins/createSpecialization.ejs', {
        user: req.user,
    });
};
let postCreateSpecialization = async (req, res) => {
    let data = {
        name: req.body.name,
        description: req.body.description,
        image: 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarSpecialties%2F161905-iconkham-chuyen-khoa.png?alt=media&token=361652f1-f901-409d-9fdf-ca9bf2d50128',
    };
    let mess = await specializationService.createSpecialization(data);
    if (mess.errCode === 0) {
        return res.redirect('/users/manage/specialization');
    } else {
        res.redirect('/users/manage/specialization/create');
    }
};

let getUserByPhone = async (req, res) => {
    let phone = req.body.phone;
    let listUser = '';
    if (phone !== '') {
        listUser = await customerService.getCustomerByPhone(phone);
    } else {
        listUser = await customerService.getAllcustomers(phone);
    }
    return res.status(200).json(listUser);
    // return res.render('main/users/admins/manageCustomer.ejs', {
    //     user: req.user,
    //     customers: listUser.customers,
    //     phone: phone,
    // });
};
let getDoctorBy = async (req, res) => {
    try {
        let giatri = req.body.thongtin;
        let loai = req.body.selectedValue;
        let doctors = await doctorService.getInfoDoctorsByCriteria(giatri, loai);
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
let getSpecializationById = async (req, res) => {
    try {
        let speId = req.body.id;
        let object = await specializationService.getSpecializationById(speId);
        return res.status(200).json(object);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

let getCreateScheduleDoctor = async (req, res) => {
    try {
        let doctor_id = req.params.id;
        let doctor = await doctorService.getDoctorForEditPage(doctor_id);
        let currentDate = moment().add(1, 'days').format('DD/MM/YYYY');
        let selectedDate = req.query.Datechon || currentDate;

        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let data = {
            sevenDaySchedule: sevenDaySchedule,
            doctorId: doctor_id,
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
            doctor_name: doctor.name,
            doctor_id: doctor_id,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
};

let postCreateScheduleDoctor = async (req, res) => {
    let doctor_id = req.params.id;
    let doctor = await doctorService.getDoctorForEditPage(doctor_id);
    await doctorService.postCreateSchedule(doctor_id, req.body.schedule_arr, MAX_BOOKING);
    return res.status(200).json({
        status: 1,
        message: 'success',
    });
};

const TIME_ZONE = 'Asia/Ho_Chi_Minh'; // Ví dụ: Múi giờ Việt Nam
const REGULAR_SHIFT_REQUIRED = 2; // Số BS cần cho ca thường
const ON_CALL_SHIFT_REQUIRED = 1; // Số BS cần cho ca trực
const ON_CALL_MIN_PER_WEEK = 1;
const ON_CALL_MAX_PER_WEEK = 2;
let getCreateScheduleDoctorAll = async (req, res) => {
    try {
        // let doctor_id = req.params.id;
        let doctor_id = 1;
        let doctor = await doctorService.getDoctorForEditPage(doctor_id);
        let selectedDate = req.query.DatechonStart;
        let selectedMoment = selectedDate ? moment(selectedDate, 'DD/MM/YYYY') : moment();
        let specializations = await homeService.getSpecializations();
        // Lấy ngày đầu và cuối tuần (giữ nguyên là moment object)
        let startOfWeekMoment = selectedMoment.clone().startOf('isoWeek');
        let endOfWeekMoment = selectedMoment.clone().endOf('isoWeek');
        // Tạo mảng ngày trong tuần
        let weekDays = [];
        for (let m = startOfWeekMoment.clone(); m.isSameOrBefore(endOfWeekMoment); m.add(1, 'day')) {
            weekDays.push({
                label: helper.capitalizeWords(m.format('dddd')), // Thứ Hai, Thứ Ba, ...
                date: m.format('DD/MM/YYYY'),
            });
        }
        // Sau đó mới format để gửi qua EJS nếu cần
        let startOfWeek = startOfWeekMoment.format('DD/MM/YYYY');
        let endOfWeek = endOfWeekMoment.format('DD/MM/YYYY');
        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let data = {
            sevenDaySchedule: sevenDaySchedule,
            doctorId: doctor_id,
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
        // let currentMonth = moment(selectedDate, 'DD/MM/YYYY').month(); // Lấy tháng từ selectedDate (moment().month() trả về từ 0-11)
        // let currentYear = moment(selectedDate, 'DD/MM/YYYY').year(); // Lấy năm từ selectedDate
        let currentMonth = moment().month() + 1; // Tháng hiện tại (moment().month() trả về từ 0-11)
        let currentYear = moment().year(); // Năm hiện tại
        // Nếu startOfWeek và endOfWeek khác tháng thì lấy dữ liệu cả 2 tháng
        let listScheduleAll = [];
        if (startOfWeekMoment.month() !== endOfWeekMoment.month()) {
            let startMonth = startOfWeekMoment.month() + 1; // Tháng bắt đầu
            let startYear = startOfWeekMoment.year();
            let endMonth = endOfWeekMoment.month() + 1; // Tháng kết thúc
            let endYear = endOfWeekMoment.year();

            // Lấy dữ liệu cho tháng bắt đầu
            let schedulesStartMonth = await scheduleService.getAllScheduleByMonthYear(startMonth, startYear);
            // Lấy dữ liệu cho tháng kết thúc
            let schedulesEndMonth = await scheduleService.getAllScheduleByMonthYear(endMonth, endYear);

            // Gộp dữ liệu từ cả hai tháng
            listScheduleAll = [...schedulesStartMonth, ...schedulesEndMonth];
        } else {
            // Nếu cùng tháng, chỉ lấy dữ liệu của tháng đó
            let currentMonth = startOfWeekMoment.month() + 1;
            let currentYear = startOfWeekMoment.year();
            listScheduleAll = await scheduleService.getAllScheduleByMonthYear(currentMonth, currentYear);
        }
        if (selectedDate) {
            currentMonth = moment(selectedDate, 'DD/MM/YYYY').month() + 1; // Lấy tháng từ selectedDate
            currentYear = moment(selectedDate, 'DD/MM/YYYY').year(); // Lấy năm từ selectedDate
        }

        // let listScheduleAll = await scheduleService.getAllScheduleByMonthYear(currentMonth, currentYear);
        listScheduleAll.forEach((schedule) => {
            schedule.date = moment(schedule.date).format('DD/MM/YYYY');
        });
        return res.render('main/users/admins/createScheduleAll.ejs', {
            user: req.user,
            listTime: listTime.data,
            schedules: schedules,
            sevenDaySchedule: sevenDaySchedule,
            selectedDate: selectedDate,
            doctor_name: doctor.name,
            doctor_id: doctor_id,
            specializations: specializations,
            startOfWeek: startOfWeek,
            endOfWeek: endOfWeek,
            weekDays: weekDays,
            listScheduleAll: listScheduleAll,
            currentMonth: currentMonth,
            currentYear: currentYear,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
};

let handleCreateScheduleAll = async (req, res) => {
    let { month, year } = req.body;
    let specializations = await homeService.getSpecializations();
    const specializationIds = specializations.map((spec) => spec.id);
    const result = await scheduleService.generateScheduleForAllSpecializations(month, year, specializationIds);

    const overallSuccess = result.every((res) => res.success);
    const schedulesCreated = result.some((res) => res.data && res.data.length > 0);

    // Trả về một thông báo tổng hợp hoặc chi tiết từng khoa
    return res.status(overallSuccess && schedulesCreated ? 201 : 200).json({
        message: 'Quá trình tạo lịch cho phòng khám đã hoàn tất.',
        details: result, // Chi tiết kết quả cho từng khoa
    });
};

let getReschedule = async (req, res) => {
    let currentDate = moment().format('DD/MM/YYYY');
    let date = '';
    let canActive = false;
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }
    let listTimeOff = await scheduleService.getAllScheduleTimeOffs();
    return res.render('main/users/admins/manageScheduleTimeOff.ejs', {
        user: req.user,
        date: date,
        listTimeOff: listTimeOff,
    });
};

let getRescheduleOption = async (req, res) => {
    let timeOffId = req.params.id;
    let timeOff = await scheduleService.getScheduleTimeOffById(timeOffId);
    let result = await scheduleService.findSwapOptions(
        timeOff.doctorId,
        timeOff.specializationId,
        timeOff.startDate,
        timeOff.endDate
    );
    let listReschedule = await scheduleService.getSwapScheduleByDoctorIdAndDate(
        timeOff.doctorId,
        timeOff.startDate,
        timeOff.endDate
    );
    let message = '';

    if (result.success) {
        // Chỉ thêm các option chưa có trong listReschedule (so sánh doctorSwapId và dateBSwap)
        const existingSet = new Set(listReschedule.map((item) => `${item.doctorSwapId}_${item.dateBSwap}`));
        const newOptions = result.options.filter(
            (option) => !existingSet.has(`${option.doctorSwapId}_${option.dateBSwap}`)
        );
        listReschedule = [...listReschedule, ...newOptions];
    } else {
        message = result.message;
    }
    return res.render('main/users/admins/editTimeOff.ejs', {
        user: req.user,
        timeOff: timeOff,
        listReschedule: listReschedule,
        message: message,
    });
};
let postUpdateReschedule = async (req, res) => {
    let timeOffId = req.params.id;
    let data = {
        statusId: req.body.statusId,
        approverId: req.user.id,
    };
    let timeOff = await scheduleService.getScheduleTimeOffById(timeOffId);
    let result = await scheduleService.updateTimeOffById(timeOffId, data);
    let dataSendFail = {
        name: timeOff.doctorName,
        startDate: timeOff.startDate,
        endDate: timeOff.endDate,
    };
    let listSwapSchedule = await scheduleService.getSwapScheduleByDoctorIdAndDate(
        timeOff.doctorId,
        timeOff.startDate,
        timeOff.endDate
    );
    // Lọc chỉ lấy các swap schedule có statusId = 1
    listSwapSchedule = listSwapSchedule.filter((item) => item.statusId === 1);
    let dataSendSuccess = {
        name: timeOff.doctorName,
        startDate: timeOff.startDate,
        endDate: timeOff.endDate,
        listSwapSchedule: listSwapSchedule,
    };
    if (result?.success) {
        if (Number(data.statusId) === 2) {
            await mailer.sendEmailNormal(
                timeOff.doctorEmail,
                mailNotificationTimeOffFail.subject,
                mailNotificationTimeOffFail.template(dataSendFail)
            );
        }
        if (Number(data.statusId) === 1) {
            await mailer.sendEmailNormal(
                timeOff.doctorEmail,
                mailNotificationTimeOffSuccess.subject,
                mailNotificationTimeOffSuccess.template(dataSendSuccess)
            );
        }
        return res.status(200).json({
            message: 'Cập nhật lịch nghỉ thành công',
        });
    } else {
        return res.status(500).json({
            message: 'Cập nhật lịch nghỉ thất bại',
        });
    }
};
let postSwapSchedule = async (req, res) => {
    let { scheduleSwapId, statusId } = req.body;
    let scheduleSwap = await scheduleService.getScheduleSwapById(scheduleSwapId);
    let doctorSwap = await doctorService.getDoctorById(scheduleSwap.doctorSwapId);
    if (!doctorSwap) {
        return res.status(404).json({
            message: 'Bác sĩ cần đổi lịch không tồn tại',
        });
    }

    let result1 = await scheduleService.updateScheduleByDoctorIdAndDate(scheduleSwap.doctorId, scheduleSwap.dateASwap, {
        doctorId: scheduleSwap.doctorSwapId,
    });
    let result2 = await scheduleService.updateScheduleByDoctorIdAndDate(
        scheduleSwap.doctorSwapId,
        scheduleSwap.dateBSwap,
        {
            doctorId: scheduleSwap.doctorId,
        }
    );

    if (result1.success && result2.success) {
        let result3 = await scheduleService.updateScheduleSwapById(scheduleSwapId, {
            statusId,
        });
        if (result3.success) {
            return res.status(200).json({
                message: 'Chấp nhận đổi lịch thành công.',
            });
        } else {
            return res.status(500).json({ message: 'Cập nhật đổi lịch thất bại.' });
        }
    } else {
        return res.status(500).json({
            message: result1.message || result2.message,
        });
    }
};

let postSaveSwapSchedule = async (req, res) => {
    let { doctorId, doctorSwapId, dateASwap, dateBSwap, type, statusId } = req.body;
    let data = {
        doctorId: doctorId,
        doctorSwapId: doctorSwapId,
        dateASwap: dateASwap,
        dateBSwap: dateBSwap,
        reason: 'Đổi để duyệt lịch nghỉ',
        type: type,
        statusId: statusId,
    };

    let result = await scheduleService.createSwapSchedule(data);
    if (result.success) {
        return res.status(200).json({
            message: 'Lịch đổi đã được lưu thành công',
            data: result.data,
        });
    } else {
        return res.status(500).json({
            message: 'Lưu lịch đổi thất bại',
        });
    }
};
let postUpdateSwapSchedule = async (req, res) => {
    let { scheduleSwapId, statusId } = req.body;
    let result = await scheduleService.updateScheduleSwapById(scheduleSwapId, {
        statusId: statusId,
    });
    if (result.success) {
        return res.status(200).json({
            message: 'Từ chối đổi lịch thành công',
        });
    } else {
        return res.status(500).json({
            message: 'Từ chối đổi lịch thất bại',
        });
    }
};
module.exports = {
    getManageDoctor: getManageDoctor,
    getManageDoctorPaging: getManageDoctorPaging,
    getCreateDoctor: getCreateDoctor,
    getSpecializationPage: getSpecializationPage,
    getEditDoctor: getEditDoctor,
    getCustomerPage: getCustomerPage,
    getCustomerPaging: getCustomerPaging,
    getCustomerByPhone: getCustomerByPhone,
    getManageBotPage: getManageBotPage,
    getEditPost: getEditPost,
    getManageCreateScheduleForDoctorsPage: getManageCreateScheduleForDoctorsPage,
    getInfoStatistical: getInfoStatistical,

    postCreateDoctor: postCreateDoctor,
    putUpdateDoctorWithoutFile: putUpdateDoctorWithoutFile,
    putUpdateDoctor: putUpdateDoctor,
    putUpdatePost: putUpdatePost,

    deleteDoctorById: deleteDoctorById,
    deleteSpecializationById: deleteSpecializationById,
    deletePostById: deletePostById,

    getNewPatients: getNewPatients,
    getManagePosts: getManagePosts,
    getCreatePost: getCreatePost,
    postCreatePost: postCreatePost,
    getAllPosts: getAllPosts,
    getPostsPagination: getPostsPagination,
    getForPatientsTabs: getForPatientsTabs,
    postChangeStatusPatient: postChangeStatusPatient,
    getLogsPatient: getLogsPatient,
    postDoneComment: postDoneComment,

    getCreatePatient: getCreatePatient,
    postCreatePatient: postCreatePatient,
    getEditPatient: getEditPatient,
    postEditPatient: postEditPatient,

    getEditSpecialization: getEditSpecialization,
    postEditSpecialization: postEditSpecialization,
    getCreateSpecializationPage: getCreateSpecializationPage,
    postCreateSpecialization: postCreateSpecialization,
    getForPatientsByDateTabs: getForPatientsByDateTabs,
    getUserByPhone: getUserByPhone,

    getDoctorBy: getDoctorBy,
    getSpecializationById: getSpecializationById,

    getPostByWriteId: getPostByWriteId,
    postEditDoctor: postEditDoctor,

    getCreateScheduleDoctor: getCreateScheduleDoctor,
    postCreateScheduleDoctor: postCreateScheduleDoctor,
    getCreateScheduleDoctorAll: getCreateScheduleDoctorAll,
    handleCreateScheduleAll: handleCreateScheduleAll,

    getReschedule: getReschedule,
    getRescheduleOption: getRescheduleOption,
    postUpdateReschedule: postUpdateReschedule,
    postSwapSchedule: postSwapSchedule,
    postSaveSwapSchedule: postSaveSwapSchedule,
    postUpdateSwapSchedule: postUpdateSwapSchedule,
};
