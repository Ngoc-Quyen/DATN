import * as dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
// const serviceAccount = require('../../serviceAccountKey.json');

// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import serviceAccount from '../../serviceAccountKey.json' with  { type: 'json' };

let serviceAccount;
if (process.env.SERVICE_ACCOUNT_KEY_JSON) {
    try {
        serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY_JSON);
    } catch (e) {
        console.error('Lỗi phân tích cú pháp SERVICE_ACCOUNT_KEY_JSON:', e);
        process.exit(1); // Thoát nếu credentials không hợp lệ
    }
} else {
    console.error('Biến môi trường SERVICE_ACCOUNT_KEY_JSON không được đặt.');
    process.exit(1); // Thoát nếu không có credentials
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET, // Thay bằng Firebase Storage bucket của bạn
});

const bucket = admin.storage().bucket();
export default {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        databaseURL: process.env.FIRESTORE_DB_URL,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
    },
    bucket: bucket,
};
