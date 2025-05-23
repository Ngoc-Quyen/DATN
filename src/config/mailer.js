// mailer.js
// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Email functions
const sendEmailNormal = (to, subject, htmlContent) => {
    const options = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html: htmlContent,
    };
    return transporter.sendMail(options);
};

const sendEmailWithAttachment = (to, subject, htmlContent, filename, path) => {
    const options = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html: htmlContent,
        attachments: [{ filename, path }],
    };
    return transporter.sendMail(options);
};

// Export as CommonJS module
export default {
    sendEmailNormal,
    sendEmailWithAttachment,
    transporter,
};
