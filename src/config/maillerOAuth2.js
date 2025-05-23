// import nodeMailer from 'nodemailer';

import pkg from 'nodemailer';
const { nodeMailer } = pkg;
import { google } from 'googleapis';
require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // Client ID từ tệp .env
    process.env.CLIENT_SECRET, // Client Secret từ tệp .env
    process.env.REDIRECT_URI // Redirect URI từ tệp .env
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN, // Refresh token từ tệp .env
});

const getAccessToken = async () => {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        return accessToken.token;
    } catch (error) {
        console.error('Failed to create access token:', error);
        return null;
    }
};

let createTransporter = async () => {
    let accessToken = await getAccessToken();
    return nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};

let sendEmailNormal = async (to, subject, htmlContent) => {
    let transporter = await createTransporter();
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent,
    };
    return transporter.sendMail(options);
};

let sendEmailWithAttachment = async (to, subject, htmlContent, filename, path) => {
    let transporter = await createTransporter();
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: filename,
                path: path,
            },
        ],
    };
    return transporter.sendMail(options);
};

module.exports = {
    sendEmailNormal: sendEmailNormal,
    sendEmailWithAttachment: sendEmailWithAttachment,
};
