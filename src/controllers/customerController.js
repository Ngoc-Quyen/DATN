require('dotenv').config();
import userService from '../services/userService.js';
import patientService from '../services/patientService.js';

const { formatDateToDDMMYYYY, formatDateToYYYYMMDD } = require('../helper/dateHelper');

// const statusNewId = 4;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;

let getManageCustomersPage = async (req, res) => {
    try {
        let comments = await patientService.getComments();
        return res.render('main/users/admins/manageCustomer.ejs', {
            user: req.user,
            comments: comments,
        });
    } catch (e) {
        console.log(e);
    }
};
let getInforCustomerById = async (req, res) => {
    try {
        let idUser = req.body.id;
        let mess = await userService.getUserById(idUser);
        if (mess.errCode === 0) {
            return res.status(200).json({
                message: 'success',
                user: mess.data,
            });
        } else {
            return res.status(200).json({
                message: mess.errMessage,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
let deleteCustomerById = async (req, res) => {
    try {
        let idUser = req.body.id;
        await userService.deleteUserById(idUser);
        return res.status(200).json({
            message: 'success',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
let postChangeStatusPatientForUser = async (req, res) => {
    try {
        let id = req.body.patientId;
        let status = req.body.status;
        let historyBreath = req.body.historyBreath;
        let moreInfo = req.body.moreInfo;
        let statusId = '';
        let content = '';
        if (status === 'pending') {
            statusId = statusPendingId;
            content = 'New appointments have been received';
        } else if (status === 'failed') {
            statusId = statusFailedId;
            if (req.body.reason) {
                content = `Cancel with reason - ${req.body.reason}`;
            }
        } else if (status === 'confirmed') {
            statusId = statusSuccessId;
            content = 'The appointment has been successfully booked';
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

        let patient = await patientService.changeStatusPatientForUser(data, logs);
        let extrainfor = await patientService.updateExtrainfos(id, historyBreath, moreInfo);
        return res.status(200).json({
            message: 'success',
            patient: patient,
            extrainfos: extrainfor,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
const formatDate = (date) => {
    let parts = date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Định dạng dd/mm/yyyy
};
let getPageInfoUser = async (req, res) => {
    try {
        const user = req.user;
        const formattedUser = {
            ...user.dataValues,
            birthday: formatDateToYYYYMMDD(user.birthday),
        };
        return res.render('main/homepage/InfoUser.ejs', {
            user: formattedUser,
            formatDate: formatDateToDDMMYYYY, // Truyền hàm formatDate vào view
        });
    } catch (e) {
        console.log(e);
    }
};
let getForPatientForUser = async (req, res) => {
    try {
        let idUser = req.user.id;
        let object = await patientService.getForPatientForUser(idUser);
        return res.status(200).json({
            message: 'success',
            object: object,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let postChangePass = async (req, res) => {
    try {
        const { currentPass, newPass, confirmPass } = req.body;

        const message = await userService.updatePassword(req.user.email, currentPass, newPass, confirmPass);

        if (message.errCode === 0) {
            return res.redirect('/InfoUser');
        } else {
            return res.status(400).json({ message: message.errMessage });
        }
    } catch (error) {
        console.log('Error updating password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

let postCheckCurrentPass = async (req, res) => {
    try {
        const { currentPass } = req.body;
        const email = req.user.email; // Assumes email is stored in req.user

        const result = await userService.checkCurrentPassword(email, currentPass);

        if (result.correct) {
            return res.json({ correct: true });
        } else {
            return res.json({ correct: false });
        }
    } catch (error) {
        console.error('Error checking current password:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

let getInfoBooking = async (req, res) => {
    try {
        let logs = await patientService.getInfoBooking(req.body.patientId);
        return res.status(200).json(logs);
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
let getEditCustomer = async (req, res) => {
    try {
        const { id, name, email, phone, address, birthday } = req.query;
        const message = await userService.updateInfor({ id, name, email, phone, address, birthday });
        if (message.errCode === 0) {
            return res.redirect('/InfoUser');
        } else {
            return res.status(400).json({ message: message.errMessage });
        }
    } catch (error) {
        console.log('Error updating password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

let postEditCustomer = async (req, res) => {
    try {
        const { id, name, email, phone, address, gender, birthday } = req.body;
        const formatted = formatDateToDDMMYYYY(birthday);
        const result = await userService.updateInfor({ id, name, email, phone, address, gender, formatted });

        if (result.errCode === 0) {
            return res.redirect('/InfoUser');
        } else {
            console.log('Error: ', result.errMessage);
            return res.redirect('/InfoUser');
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export default {
    getManageCustomersPage: getManageCustomersPage,
    getInforCustomerById: getInforCustomerById,
    postChangeStatusPatientForUser: postChangeStatusPatientForUser,
    deleteCustomerById: deleteCustomerById,
    getPageInfoUser: getPageInfoUser,
    getForPatientForUser: getForPatientForUser,
    postChangePass: postChangePass,
    postCheckCurrentPass: postCheckCurrentPass,
    getInfoBooking: getInfoBooking,
    getLogsPatient: getLogsPatient,
    getEditCustomer: getEditCustomer,
    postEditCustomer: postEditCustomer,
};
