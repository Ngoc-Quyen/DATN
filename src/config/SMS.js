import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import vonage from '@vonage/server-sdk';
const INFOPB_API_KEY = process.env.INFOPB_API_KEY;
const INFOPB_API_BASE_URL = process.env.INFOPB_API_BASE_URL;
const INFOPB_SEND_NAME = process.env.INFOPB_SEND_NAME;
const INFOPB_PATH = process.env.INFOPB_PATH;

const VONAGE_SEND_NAME = process.env.VONAGE_SEND_NAME;

const vonageClient = new vonage.Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
});
const sendSMS = async (toPhoneNumber, messageText) => {
    try {
        const response = await axios.post(
            `${INFOPB_API_BASE_URL}${INFOPB_PATH}`,
            {
                messages: [
                    {
                        destinations: [{ to: toPhoneNumber }],
                        from: INFOPB_SEND_NAME,
                        text: messageText,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `App ${INFOPB_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        console.log('SMS sent successfully:', response.data);
        const status = response.data.messages[0].status;
        console.log('SMS Status:', status.name, '-', status.description);

        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error.response?.data || error.message);
        throw error;
    }
};
const sendSMSByVonage = async (toPhoneNumber, messageText) => {
    try {
        const response = await vonageClient.sms.send({
            to: toPhoneNumber,
            from: VONAGE_SEND_NAME, // <- đây là tên brand/số gửi đi
            text: messageText,
        });

        const message = response.messages[0];

        if (message.status !== '0') {
            console.error('Vonage SMS failed:', {
                to: message.to,
                status: message.status,
                errorText: message['error-text'],
            });
            throw new Error(`Vonage SMS Error: ${message['error-text']}`);
        } else {
            console.log('Vonage SMS sent successfully:', {
                to: message.to,
                status: message.status,
            });
        }

        return response;
    } catch (error) {
        if (error.response?.messages) {
            console.error('Detailed Vonage Error:', JSON.stringify(error.response.messages, null, 2));
        } else {
            console.error('Unexpected SMS Error:', error);
        }
        throw error;
    }
};

export default { sendSMS, sendSMSByVonage };
