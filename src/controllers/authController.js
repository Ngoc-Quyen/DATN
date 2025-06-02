// import { validationResult } from 'express-validator';
import user from '../services/userService.js';
import mailer from '../config/mailer.js';
import { mailChangePass } from '../../lang/en.js';
import apiAuth from '../middlewares/apiAuth.js';
import uploadImg from '../services/imgLoadFirebase.js';
// const { formatDateToDDMMYYYY } = require('../helper/dateHelper');
import dateHelper from '../helper/dateHelper.js';

let getLogin = (req, res) => {
    return res.render('auth/login.ejs', {
        error: req.flash('error'),
    });
};

let getRegister = (req, res) => {
    return res.render('auth/register.ejs');
};

let postRegister = async (req, res) => {
    const formatted = dateHelper.formatDateToDDMMYYYY(req.body.birthday);
    let customer = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        gender: 'M',
        address: req.body.address,
        birthday: formatted,
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pbl5-a1f37.appspot.com/o/images%2FavatarUsers%2FavatarPatient%2Favatar-default.png?alt=media&token=f8cd9a9f-d234-4b99-b742-77cf25ca86dd',
        description: req.body.description,
    };
    try {
        // Check if email already exists
        const existingUser = await user.findUserByEmail(req.body.email);
        if (existingUser) {
            return res.render('auth/register.ejs', {
                errEmail: 'Email đã tồn tại',
                oldData: req.body,
            });
        }

        // Check password and confirm password match
        if (req.body.password !== req.body.passwordConfirm) {
            return res.render('auth/register.ejs', {
                errPasswordConfirm: 'Mật khẩu không khớp',
                oldData: req.body,
            });
        }

        let mess = await user.createNewUser(customer);
        if (mess.errCode === 0) {
            return res.render('auth/login.ejs', {
                error: '',
            });
        } else {
            res.render('auth/register', {
                hasErrors: true,
                oldData: req.body,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};

// let verifyAccount = async (req, res) => {
//     let errorArr = [];
//     let successArr = [];
//     try {
//         let verifySuccess = await auth.verifyAccount(req.params.token);
//         successArr.push(verifySuccess);
//         req.flash('success', successArr);
//         return res.redirect('/login');
//     } catch (error) {
//         console.log(error);
//     }
// };

let getLogout = (req, res) => {
    req.session.destroy(function (err) {
        return res.redirect('/login');
    });
};

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users');
    }
    next();
};

let getAllCode = async (req, res) => {
    try {
        let data = await user.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('Get all code error: ', error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server',
        });
    }
};
let getResetPasswordPage = async (req, res) => {
    let emailUser = req.query.emailResetPassword;
    if (!emailUser) {
        return res.redirect('/login');
    }
    let account = await user.findUserByEmail(emailUser);

    if (account) {
        // Nếu có người dùng được tìm thấy, chuyển hướng đến trang reset password
        // return res.render('auth/reset-password.ejs');
        let otp = apiAuth.generateOtp();
        let dataSend = {
            name: account.name,
            otp: otp,
        };
        await mailer.sendEmailNormal(emailUser, mailChangePass.subject, mailChangePass.template(dataSend));

        return res.render('auth/reset-password.ejs', {
            user: account,
            showOtpInput: true, // Hiển thị ô nhập mã OTP
            otp: otp,
        });
    } else {
        // Nếu không có người dùng, ở lại trang hiện tại và đưa ra thông báo lỗi
        return res.redirect('/login');
    }
};
let postNewPassword = async (req, res) => {
    let data = req.body;
    let message = await user.updateUser(data);
    if (message.errCode === 0) {
        // thong bao update thanh cong -> chuyen den trang login
        return res.redirect('/login');
    } else {
        // thong bao chua cap nhat duoc -> o lai trang va thong bao loi
        return res.redirect('/reset-password');
    }
};
let handleEditSpecialty = async (req, res) => {
    let data = req.body;
    let file = req.file;
    let imgUrl = '';
    if (file) {
        imgUrl = await uploadImg.uploadImg(file);
    }
    let message = await user.updateUserDataFile(data, imgUrl);
    if (message.errCode === 0) {
        return res.redirect('/users');
        // Hiển thị thông báo cập nhật thành công
    } else {
        console.log('message: ', message.errMessage);
        return res.redirect('/users');
        // Hien thi thong bao chưa cập nhật được
    }
};
let sendOTPBack = async (req, res) => {
    let emailUser = req.query.emailResetPassword;
    let account = await user.findUserByEmail(emailUser);
    let otp = apiAuth.generateOtp();
    let dataSend = {
        name: account.name,
        otp: otp,
    };
    await mailer.sendEmailNormal(emailUser, mailChangePass.subject, mailChangePass.template(dataSend));
    return res.render('auth/reset-password.ejs', {
        user: account,
        showOtpInput: true, // Hiển thị ô nhập mã OTP
        otp: otp,
    });
};
let postSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Generate a new OTP
        const otp = apiAuth.generateOtp();

        // Send the OTP email
        await mailer.sendEmailNormal(email, mailChangePass.subject, mailChangePass.template({ otp }));

        res.status(200).send('OTP resent successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to resend OTP');
    }
};
export default {
    getLogin: getLogin,
    getRegister: getRegister,
    postRegister: postRegister,
    // verifyAccount: verifyAccount,
    getLogout: getLogout,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    getAllCode: getAllCode,
    getResetPasswordPage: getResetPasswordPage,
    postNewPassword: postNewPassword,
    handleEditSpecialty: handleEditSpecialty,
    postSendOTP: postSendOTP,
    sendOTPBack: sendOTPBack,
};
