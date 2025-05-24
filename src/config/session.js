import dotenv from 'dotenv';
dotenv.config();

import Sequelize from 'sequelize';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
const SequelizeStore = connectSessionSequelize(session.Store);

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // storage: './session.mysql',
    logging: false,

    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '+07:00',
    },
    pool: {
        max: 3, // Thử giảm số kết nối tối đa trong pool, ví dụ xuống 2 hoặc 3
        min: 0, // Số kết nối tối thiểu
        acquire: 60000, // Timeout khi lấy kết nối từ pool (ms)
        idle: 10000, // Thời gian kết nối có thể nhàn rỗi trước khi bị giải phóng (ms)
    },
    timezone: '+07:00',
});

let sessionStore = new SequelizeStore({
    db: sequelize,
});

let configSession = (app) => {
    app.use(
        session({
            key: 'express.sid',
            secret: 'secret',
            store: sessionStore,
            resave: true,
            saveUninitialized: false,
            cookie: { httpOnly: false, secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1day
        })
    );
};

sessionStore.sync();

export default {
    configSession: configSession,
};
