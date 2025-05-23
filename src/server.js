import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import configViewEngine from './config/viewEngine.js';
import initRoutes from './routes/web.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import passPort from 'passport';
import session from './config/session.js';

let app = express();
// admin.initializeApp(
//     {
//         credential: admin.credential.cert(serviceAccount),
//         storageBucket: process.env.StorageBucket, // Thay thế bằng địa chỉ bucket của bạn
//     },
//     'PBL5-DoctorCare'
// );

app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config session
// session.configSession(app);

// configViewEngine(app);
// app.use(function (req, res, next) {
//     res.locals.user = req.session.user;
//     req.session.userId = userId;
//     next();
// });

// config session
session.configSession(app);
configViewEngine(app);

// Middleware để lưu userId vào session sau khi user đăng nhập
app.use(function (req, res, next) {
    if (req.session.user) {
        req.session.userId = req.session.user.id;
    }
    res.locals.user = req.session.user;
    next();
});

// config Passportjs
app.use(passPort.initialize());
app.use(passPort.session());

initRoutes(app);

let port = process.env.PORT;
app.listen(port || 6868, '0.0.0.0', () => console.log(`Doctors care app is running on port ${port}!`));
