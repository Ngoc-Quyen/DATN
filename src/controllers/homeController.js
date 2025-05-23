import dotenv from 'dotenv';
dotenv.config();
import homeService from '../services/homeService.js';
import specializationService from '../services/specializationService.js';
import doctorService from '../services/doctorService.js';
import userService from '../services/userService.js';
import postService from '../services/postService.js';
import elasticService from '../services/syncsElaticService.js';
import patientService from '../services/patientService.js';
import scheduleService from '../services/scheduleService.js';

import moment from 'moment';
// striptags to remove HTML
import striptags from 'striptags';

import multer from 'multer';

let LIMIT_POST = 5;

const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;

let getHomePage = async (req, res) => {
    try {
        let specializations = await homeService.getSpecializations();
        let doctors = await userService.getInfoDoctors();
        let posts = await homeService.getPosts(LIMIT_POST);
        return res.render('main/homepage/homepage.ejs', {
            user: req.user,
            specializations: specializations,
            doctors: doctors,
            posts: posts,
            pageId: process.env.PAGE_ID,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getUserPage = async (req, res) => {
    let currentMonth = new Date().getMonth() + 1;
    let object = await userService.getInfoStatistical(currentMonth);
    res.render('main/users/home.ejs', {
        user: req.user,
        currentMonth: currentMonth,
        object: object,
    });
};

let getDetailSpecializationPage = async (req, res) => {
    try {
        let object = await specializationService.getSpecializationById(req.params.id);
        // using date to get schedule of doctors
        let currentDate = moment().format('DD/MM/YYYY');
        let doctors = await doctorService.getDoctorsForSpecialization(req.params.id, currentDate);
        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let listSpecializations = await specializationService.getAllSpecializations();

        let dateReq = moment(currentDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        // Lấy lịch và listTime cho từng bác sĩ trong specialization
        let doctorsWithSchedule = [];
        for (let doctor of doctors) {
            let schedule = await scheduleService.getScheduleByDoctorIdAndDate(doctor.User.id, dateReq);
            let listScheduleMax = await scheduleService.getScheduleMax(doctor.User.id, dateReq);

            let listTime = [];
            if (schedule) {
                if (schedule.type === 'regular') {
                    listTime = await userService.getAllCodeService('TIMEREGULAR');
                } else {
                    listTime = await userService.getAllCodeService('TIMEONCALL');
                }
            }
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

            doctorsWithSchedule.push({
                ...doctor,
                schedule: schedule,
                listTime: listTime.data || [],
            });
        }
        doctors = doctorsWithSchedule;

        return res.render('main/homepage/specialization.ejs', {
            specialization: object.specialization,
            post: object.post,
            doctors: doctors,
            places: object.places,
            sevenDaySchedule: sevenDaySchedule,
            listSpecializations: listSpecializations,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getDetailDoctorPage = async (req, res) => {
    try {
        let doctorId = req.params.id;
        let currentDate = moment().format('DD/MM/YYYY');
        let sevenDaySchedule = [];
        for (let i = 0; i < 7; i++) {
            let date = moment(new Date()).add(i, 'days').locale('vi').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let doctorRaw = await doctorService.getInfoDoctorById(doctorId);
        let doctorData =
            doctorRaw && doctorRaw.doctor && doctorRaw.doctor.dataValues ? doctorRaw.doctor.dataValues : {};

        // Chỉ lấy các trường cần thiết
        let doctor = {
            id: doctorData.id,
            name: doctorData.name,
            email: doctorData.email,
            avatar: doctorData.avatar,
            address: doctorData.address,
            phone: doctorData.phone,
            description: doctorData.description,
            specializationName: doctorData.specializationName || doctorRaw.specializationName || '',
            Comments: doctorData.Comments || [],
        };
        let object = await doctorService.getDoctorWithSchedule(doctorId, currentDate);

        let places = await doctorService.getPlacesForDoctor();
        let postDoctor = await doctorService.getPostForDoctor(doctorId);

        let dateReq = moment(currentDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
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

        return res.render('main/homepage/doctor.ejs', {
            doctor: doctor,
            sevenDaySchedule: sevenDaySchedule,
            postDoctor: postDoctor,
            specialization: object.specialization,
            places: places,
            schedule: schedule,
            listTime: listTime.data,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getBookingPage = (req, res) => {
    res.render('main/homepage/bookingPage.ejs');
};

let getDetailPostPage = async (req, res) => {
    try {
        let post = await postService.getDetailPostPage(req.params.id);

        // Lấy thông tin về bác sĩ dựa trên doctorId
        let object = await doctorService.getInfoDoctorById(post.forDoctorId);

        res.render('main/homepage/post.ejs', {
            post: post,
            doctor: object.doctor,
            specialization: object.specializationName,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getContactPage = (req, res) => {
    return res.render('main/homepage/contact.ejs');
};
let getAllPosts = async (req, res) => {
    try {
        let page = req.query.page || 1; // Lấy trang từ query string, mặc định là trang 1
        let limit = 10; // Số bài đăng trên mỗi trang
        let offset = (page - 1) * limit; // Offset để lấy bài đăng cho trang hiện tại

        // Sử dụng hàm trong service để lấy bài đăng cho trang hiện tại
        let posts = await postService.getAllPosts(offset, limit);

        // Đếm tổng số bài đăng
        let totalPosts = await postService.countTotalPosts();

        // Tính tổng số trang
        let totalPages = Math.ceil(totalPosts / limit);

        // Truyền các thông tin về phân trang tới template
        return res.render('main/homepage/allPostsPagination.ejs', {
            posts: posts,
            currentPage: page,
            totalPages: totalPages,
            striptags: require('striptags'), // Bạn có thể sử dụng thư viện striptags để loại bỏ thẻ HTML
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal Server Error');
    }
};

let getPostsWithPagination = async (req, res) => {
    let role = 'nope';
    let object = await postService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);

    return res.render('main/homepage/allPostsPagination.ejs', {
        posts: object.posts,
        total: object.total,
        striptags: striptags,
    });
};

let getPostSearch = async (req, res) => {
    let search = req.query.keyword;
    let results = await elasticService.findPostsByTerm(search);
    return res.render('main/homepage/searchPost.ejs', {
        search: search,
        posts: results.hits.hits,
    });
};

let getInfoBookingPage = async (req, res) => {
    try {
        let patientId = req.params.id;
        let patient = await patientService.getInfoBooking(patientId);
        return res.render('main/homepage/infoBooking.ejs', {
            patient: patient,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let postBookingDoctorPageWithoutFiles = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let item = req.body;
        item.statusId = statusNewId; // Giả sử statusNewId được định nghĩa trước đó
        item.userId = req.session.userId; // Lấy userId từ session
        item.historyBreath = req.body.breath;
        item.moreInfo = req.body.extraOldForms;
        // if (item.places === 'none') item.placeId = 0;
        // else item.placeId = item.places; // Tránh ghi đè placeId
        item.createdAt = Date.now();
        let patient = await patientService.createNewPatient(item);

        return res.status(200).json({
            status: 1,
            message: 'success',
            patient: patient,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postBookingDoctorPageNormal = (req, res) => {
    imageImageOldForms(req, res, async (err) => {
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
            let item = req.body;
            let imageOldForm = req.files;
            let image = {};
            imageOldForm.forEach((x, index) => {
                image[index] = x.filename;
            });

            // Kiểm tra nếu userId có trong session
            if (!req.session.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            item.statusId = statusNewId; // Giả sử statusNewId được định nghĩa trước đó
            item.userId = req.session.userId; // Lấy userId từ session
            item.historyBreath = req.body.breath;
            item.moreInfo = req.body.extraOldForms;
            // if (item.places === 'none') {
            //     item.placeId = 0;
            // } else {
            //     item.placeId = item.places; // Tránh ghi đè placeId
            // }
            item.oldForms = JSON.stringify(image);
            item.createdAt = Date.now();

            let patient = await patientService.createNewPatient(item);
            return res.status(200).json({
                status: 1,
                message: 'success',
                patient: patient,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageImageOldForms = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/images/patients');
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    },
});

let imageImageOldForms = multer({
    storage: storageImageOldForms,
    limits: { fileSize: 1048576 * 20 },
}).array('oldForms');

let getDetailPatientBooking = async (req, res) => {
    try {
        let patient = await patientService.getDetailPatient(req.body.patientId);
        let message = await patientService.getExtanInfoByPatientId(req.body.patientId);
        let doctor = await doctorService.getInfoDoctorById(patient.doctorId);
        let object = {
            patient: patient,
            ExtraInfo: message.extrainfos,
            doctor: doctor.doctor,
        };
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getFeedbackPage = async (req, res) => {
    try {
        let doctorId = req.params.doctorId;
        let patientId = req.query.patientId;
        let doctor = await doctorService.getDoctorForFeedbackPage(doctorId, patientId);
        let patient = await doctorService.getDoctorForFeedbackPage(doctorId, patientId);
        return res.render('main/homepage/feedback.ejs', {
            doctor: doctor,
            patient: patient,
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let postCreateFeedback = async (req, res) => {
    try {
        let feedback = await doctorService.createFeedback(req.body.data);
        return res.status(200).json({
            message: 'Send feedback success',
            feedback: feedback,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Failed to save feedback to database' });
    }
};

let getPageForPatients = (req, res) => {
    return res.render('main/homepage/forPatients.ejs');
};

let getPageForDoctors = (req, res) => {
    return res.render('main/homepage/forDoctors.ejs');
};

let postSearchHomePage = async (req, res) => {
    try {
        let result = await homeService.postSearchHomePage(req.body.keyword);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getPageAllDoctors = async (req, res) => {
    try {
        let doctors = await homeService.getDataPageAllDoctors();
        return res.render('main/homepage/allDoctors.ejs', {
            doctors: doctors,
        });
    } catch (e) {
        console.log(e);
    }
};

let getPageAllSpecializations = async (req, res) => {
    try {
        let specializations = await homeService.getDataPageAllSpecializations();
        return res.render('main/homepage/allSpecializations.ejs', {
            specializations: specializations,
        });
    } catch (e) {
        console.log(e);
    }
};

let getPageInfoBooked = async (req, res) => {
    try {
        return res.render('main/homepage/InfoBooked.ejs', {});
    } catch (e) {
        console.log(e);
    }
};
let getPageCancel = async (req, res) => {
    try {
        return res.render('main/homepage/cancel.ejs', {});
    } catch (e) {
        console.log(e);
    }
};
let getPageCanceled = async (req, res) => {
    try {
        return res.render('main/homepage/canceled.ejs', {});
    } catch (e) {
        console.log(e);
    }
};
// Định nghĩa hàm xử lý tìm kiếm
let searchHandler = async (req, res) => {
    let query = req.body.query;

    try {
        // Tìm kiếm trong bảng user với role = 2
        let users = await db.User.findAll({
            where: {
                role: 2,
                name: {
                    [db.Sequelize.Op.like]: `%${query}%`,
                },
            },
            attributes: ['name'],
        });

        // Tìm kiếm trong bảng specialty
        let specialties = await db.Specialization.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: `%${query}%`,
                },
            },
            attributes: ['name'],
        });

        // Tìm kiếm trong bảng post
        let posts = await db.Post.findAll({
            where: {
                title: {
                    [db.Sequelize.Op.like]: `%${query}%`,
                },
            },
            attributes: ['title'],
        });

        // Kết hợp kết quả từ các bảng
        let results = [
            ...users.map((user) => ({ name: user.name })),
            ...specialties.map((specialization) => ({ name: specialization.name })),
            ...posts.map((post) => ({ name: post.title })),
        ];

        // Trả về kết quả tìm kiếm dưới dạng JSON
        res.status(200).json({ results: results });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tìm kiếm' });
    }
};

export default {
    getPageCancel: getPageCancel,
    getPageCanceled: getPageCanceled,
    getHomePage: getHomePage,
    getUserPage: getUserPage,
    getDetailSpecializationPage: getDetailSpecializationPage,
    getDetailDoctorPage: getDetailDoctorPage,
    getBookingPage: getBookingPage,
    getDetailPostPage: getDetailPostPage,
    getContactPage: getContactPage,
    getPostsWithPagination: getPostsWithPagination,
    getPostSearch: getPostSearch,
    getInfoBookingPage: getInfoBookingPage,
    postBookingDoctorPageWithoutFiles: postBookingDoctorPageWithoutFiles,
    postBookingDoctorPageNormal: postBookingDoctorPageNormal,
    getDetailPatientBooking: getDetailPatientBooking,
    getFeedbackPage: getFeedbackPage,
    postCreateFeedback: postCreateFeedback,
    getPageForPatients: getPageForPatients,
    getPageForDoctors: getPageForDoctors,
    postSearchHomePage: postSearchHomePage,
    getPageAllDoctors: getPageAllDoctors,
    getPageCancel: getPageCancel,
    getPageCanceled: getPageCanceled,

    getPageInfoBooked: getPageInfoBooked,
    getPageAllSpecializations: getPageAllSpecializations,
    searchHandler: searchHandler,
    getAllPosts: getAllPosts,
};
