import express from 'express';
import home from './../controllers/homeController';
import auth from './../controllers/authController';
import admin from './../controllers/adminController';
import doctor from './../controllers/doctorController';
import customer from '../controllers/customerController';
import bot from './../controllers/botFBController';
import passport from 'passport';
import passportLocal from 'passport-local';
import userService from './../services/userService';

const multer = require('multer');
// Setting up multer as a middleware to grab photo uploads
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: multer.memoryStorage() });
// const upload = multer();

let router = express.Router();

let LocalStrategy = passportLocal.Strategy;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                await userService.findUserByEmail(email).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash('error', 'Email không tồn tại'));
                    }
                    if (user && user.isActive === 1) {
                        let match = await userService.comparePassword(password, user);
                        if (match) {
                            return done(null, user, null);
                        } else {
                            return done(null, false, req.flash('error', 'Mật khẩu không chính xác'));
                        }
                    }
                    if (user && user.isActive === 0) {
                        return done(null, false, req.flash('error', 'Tài khoản chưa được kích hoạt'));
                    }
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userService
        .findUserById(id)
        .then((user) => {
            return done(null, user);
        })
        .catch((error) => {
            return done(error, null);
        });
});

let initRoutes = (app) => {
    router.get('/all-doctors', home.getPageAllDoctors);
    router.get('/all-specializations', home.getPageAllSpecializations);
    router.get('/InfoUser', customer.getPageInfoUser);
    router.get('/InfoBooked', home.getPageInfoBooked);
    // router.get('/cancel', home.getPageCancel);
    // router.get('/canceled', home.getPageCanceled);

    // router.get('/changePass', home.getPageChangePass);

    router.get('/webhook', bot.getWebhookFB);
    router.post('/webhook', bot.postWebhookFB);

    router.get('/set-up-bot-facebook', bot.getSetupBotFBPage);
    router.post('/set-up-bot-facebook', bot.handleSetupBotFBPage);
    router.get('/booking-online-messenger', bot.getBookingOnlineMessengerPage);
    router.post('/set-info-booking-online-messenger', bot.setInfoBookingMessenger);

    router.get('/feedback/:doctorId', home.getFeedbackPage);
    router.post('/feedback/create', home.postCreateFeedback);

    router.get('/for-patients', home.getPageForPatients);
    router.get('/for-doctors', home.getPageForDoctors);

    router.post('/search-homepage', home.postSearchHomePage);

    router.get('/', home.getHomePage);
    router.get('/contact', home.getContactPage);
    router.get('/detail/specialization/:id', home.getDetailSpecializationPage);
    router.get('/detail/doctor/:id', home.getDetailDoctorPage);

    router.post('/booking-doctor-without-files/create', home.postBookingDoctorPageWithoutFiles);
    router.post('/booking-doctor-normal/create', home.postBookingDoctorPageNormal);

    router.post('/api/search', home.searchHandler);

    router.get('/detail/post/:id', home.getDetailPostPage);
    router.get('/booking-info/:id', home.getInfoBookingPage);

    // router.get('/all-posts', home.getPostsWithPagination);
    router.get('/all-posts', home.getAllPosts);
    router.get('/posts/search/', home.getPostSearch);

    router.get('/users/manage/specialization', auth.checkLoggedIn, admin.getSpecializationPage);
    router.get('/users/specialization/edit/:id', auth.checkLoggedIn, admin.getEditSpecialization);
    router.post('/users/specialization/edit/:id', auth.checkLoggedIn, admin.postEditSpecialization);
    router.get('/users/manage/specialization/create', auth.checkLoggedIn, admin.getCreateSpecializationPage);
    router.post('/users/manage/specialization/create', auth.checkLoggedIn, admin.postCreateSpecialization);
    router.post('/get-info-speciality-by-id', admin.getSpecializationById);

    router.get('/users/manage/customer', auth.checkLoggedIn, admin.getCustomerPaging);
    router.post('/users/manage/customer', auth.checkLoggedIn, admin.getCustomerByPhone);
    router.get('/users', auth.checkLoggedIn, home.getUserPage);
    router.get('/users/manage/customer/create', auth.checkLoggedIn, admin.getCreatePatient);
    router.post('/users/manage/customer/create', auth.checkLoggedIn, admin.postCreatePatient);
    router.get('/users/customer/edit/:id', auth.checkLoggedIn, admin.getEditPatient);
    router.post('/users/customer/edit/:id', auth.checkLoggedIn, upload.single('avatar'), admin.postEditPatient);
    router.post('/get-info-customer-by-id', customer.getInforCustomerById);
    router.delete('/users/customer/delete', auth.checkLoggedIn, customer.deleteCustomerById);

    router.get('/users/manage/bot', auth.checkLoggedIn, admin.getManageBotPage);
    router.get('/users/manage/schedule-for-doctors', auth.checkLoggedIn, admin.getManageCreateScheduleForDoctorsPage);

    router.get('/users/manage/doctor', auth.checkLoggedIn, admin.getManageDoctorPaging);
    router.post('/users/manage/doctor', auth.checkLoggedIn, admin.getDoctorBy);
    router.get('/users/manage/doctor/create', auth.checkLoggedIn, admin.getCreateDoctor);
    router.post('/admin/doctor/create', auth.checkLoggedIn, admin.postCreateDoctor);
    router.get('/users/doctor/edit/:id', auth.checkLoggedIn, admin.getEditDoctor);
    // router.put('/admin/doctor/update-without-file', auth.checkLoggedIn, admin.putUpdateDoctorWithoutFile);
    // router.put('/admin/doctor/update', auth.checkLoggedIn, admin.putUpdateDoctor);
    // router.post('/users/doctor/edit/:id', auth.checkLoggedIn, admin.putUpdateDoctorWithoutFile);
    router.post('/users/doctor/edit/:id', auth.checkLoggedIn, upload.single('imageInput'), admin.postEditDoctor);
    router.post('/users/manage/customer?phone=${phone}', auth.checkLoggedIn, admin.getUserByPhone);
    router.get('/users/manage/schedule-doctor/create/:id', auth.checkLoggedIn, admin.getCreateScheduleDoctor);
    router.post('/users/manage/schedule-doctor/create/:id', auth.checkLoggedIn, admin.postCreateScheduleDoctor);
    router.get('/users/manage/schedule-doctor/create-all/', auth.checkLoggedIn, admin.getCreateScheduleDoctorAll);

    router.get('/doctor/manage/schedule', doctor.getSchedule);
    router.get('/doctor/manage/schedule/create', auth.checkLoggedIn, doctor.getCreateSchedule);
    router.post('/doctor/manage/schedule/create', auth.checkLoggedIn, doctor.postCreateSchedule);
    router.post('/doctor/get-schedule-doctor-by-date', doctor.getScheduleDoctorByDate);
    router.delete('/doctor/delete/schedule', auth.checkLoggedIn, doctor.deleteScheduleDoctorByDate);

    router.get('/doctor/manage/appointment', auth.checkLoggedIn, doctor.getManageAppointment);
    router.get('/doctor/manage/chart', auth.checkLoggedIn, doctor.getManageChart);
    router.post('/doctor/manage/create-chart', auth.checkLoggedIn, doctor.postCreateChart);
    router.post('/doctor/send-forms-to-patient', auth.checkLoggedIn, doctor.postSendFormsToPatient);
    router.post(
        '/doctor/auto-create-all-doctors-schedule',
        auth.checkLoggedIn,
        doctor.postAutoCreateAllDoctorsSchedule
    );
    router.get('/doctor/manage/posts', auth.checkLoggedIn, admin.getManagePosts);
    router.get('/doctor/manage/post/create', auth.checkLoggedIn, admin.getCreatePost);
    router.post('/doctor/manage/post/create', auth.checkLoggedIn, admin.postCreatePost);
    router.get('/doctor/post/edit/:id', auth.checkLoggedIn, doctor.getEditPost);

    router.get('/admin/manage/customers', auth.checkLoggedIn, customer.getManageCustomersPage);
    router.get('/doctor/get-new-patients', auth.checkLoggedIn, admin.getNewPatients);
    router.get('/admin/manage/posts', auth.checkLoggedIn, admin.getManagePosts);
    router.get('/admin/pagination/posts', admin.getPostsPagination);
    router.get('/admin/post/edit/:id', auth.checkLoggedIn, admin.getEditPost);
    router.put('/admin/post/update', auth.checkLoggedIn, admin.putUpdatePost);
    router.get('/admin/manage/post/create', auth.checkLoggedIn, admin.getCreatePost);
    router.post('/admin/manage/post/create', auth.checkLoggedIn, admin.postCreatePost);
    router.get('/admin/get-list-posts', auth.checkLoggedIn, admin.getAllPosts);
    router.post('/admin/get-patients-for-tabs', auth.checkLoggedIn, admin.getForPatientsTabs);
    router.post('/admin/change-status-patient', auth.checkLoggedIn, admin.postChangeStatusPatient);
    router.post('/admin/get-logs-patient', auth.checkLoggedIn, admin.getLogsPatient);
    router.post('/admin/done-comment', auth.checkLoggedIn, admin.postDoneComment);
    router.post('/admin/manage/booking-date', auth.checkLoggedIn, admin.getForPatientsByDateTabs);

    router.post('/user/get-patients-for-user', auth.checkLoggedIn, customer.getForPatientForUser);
    router.post('/user/change-status-patient-for-user', auth.checkLoggedIn, customer.postChangeStatusPatientForUser);
    router.post('/user/get-Doctor-patient', auth.checkLoggedIn, customer.getInfoBooking);
    // router.post('/user/get-patients-for-user', auth.checkLoggedIn, admin.getForPatientsTabs);
    // router.post('/user/change-status-patient-for -user', auth.checkLoggedIn, customer.postChangeStatusPatientForUser);

    router.post('/api/get-info-doctor-by-id', doctor.getInfoDoctorById);
    router.post('/api/get-detail-patient-by-id', home.getDetailPatientBooking);
    router.post('/user/get-logs-patient', auth.checkLoggedIn, customer.getLogsPatient);

    router.delete('/admin/delete/doctor', auth.checkLoggedIn, admin.deleteDoctorById);
    router.delete('/admin/delete/specialization', auth.checkLoggedIn, admin.deleteSpecializationById);
    router.delete('/admin/delete/post', auth.checkLoggedIn, admin.deletePostById);

    router.post('/users/change-password', customer.postChangePass);
    router.post('/check-current-password', customer.postCheckCurrentPass);
    router.post('/users/update-user', upload.single('avatar'), auth.handleEditSpecialty);

    router.get('/users/edit/:id', auth.checkLoggedIn, customer.getEditCustomer);
    router.post('/users/edit/:id', auth.checkLoggedIn, customer.postEditCustomer);
    router.post('/send-otp', auth.postSendOTP);

    router.get('/login', auth.checkLoggedOut, auth.getLogin);

    router.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            // Redirect if authentication fails
            if (!user) {
                return res.redirect('/login');
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                req.session.user = user;

                req.session.save(() => {
                    // Check user role after successful login
                    if (user.roleId === 3) {
                        return res.redirect('/');
                    } else if (user.roleId === 2) {
                        return res.redirect('/doctor/get-new-patients');
                    } else {
                        return res.redirect('/users');
                    }
                });
            });
        })(req, res, next);
    });

    router.get('/register', auth.getRegister);
    router.post('/register', auth.postRegister);
    // router.get("/verify/:token", auth.verifyAccount);

    router.get('/logout', auth.checkLoggedIn, auth.getLogout);

    router.post('/admin/statistical', auth.checkLoggedIn, admin.getInfoStatistical);

    router.get('/allcode', auth.getAllCode);
    router.get('/reset-password', auth.getResetPasswordPage);
    router.post('/forgot-password/set-new-password', auth.postNewPassword);
    router.post('/users/change-password', customer.postChangePass);
    router.post('/check-current-password', customer.postCheckCurrentPass);

    router.get('/new-get-time-off', auth.checkLoggedIn, doctor.getNewTimeOff);
    router.post('/new-post-time-off', auth.checkLoggedIn, doctor.postNewTimeOff);
    router.get('/doctor/manage/schedule/timeoff', doctor.getScheduleTimeOff);
    router.post('/create-schedule-all', auth.checkLoggedIn, admin.handleCreateScheduleAll);

    router.get('/users/manage/reschedule/time-off', auth.checkLoggedIn, admin.getReschedule);
    router.get('/users/manage/reschedule/time-off/option/:id', auth.checkLoggedIn, admin.getRescheduleOption);

    return app.use('/', router);
};
module.exports = initRoutes;
