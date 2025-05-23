const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const config = require('../config/firebaseConfig').firebaseConfig;

// Initialize Firebase
const firebaseApp = initializeApp(config);
const storage = getStorage(firebaseApp);
const uploadImg = async (fileData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fileData.buffer) {
                console.log('File buffer is empty: ', fileData.buffer);
                resolve(null);
                return;
            }
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(storage, `images/${fileData.originalname}-${dateTime}`);
            const metadata = {
                contentType: fileData.mimetype,
            };
            const snapshot = await uploadBytesResumable(storageRef, fileData.buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);

            resolve(downloadURL);
        } catch (error) {
            reject(error);
        }
    });
};
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
    ).padStart(2, '0')}`;
    const time = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(
        today.getSeconds()
    ).padStart(2, '0')}`;
    return `${date} ${time}`;
};
module.exports = {
    uploadImg: uploadImg,
};
