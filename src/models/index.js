// Không cần 'use strict'; trong ES Modules

import dotenv from 'dotenv';
dotenv.config(); // Nên gọi ở điểm vào chính của ứng dụng (server.js) thì tốt hơn

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url'; // Để lấy __filename, __dirname

// 1. Lấy __filename và __dirname tương đương trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// 2. Đọc và parse file config.json
let config;
try {
    const configPath = path.join(__dirname, '..', 'config', 'config.json');
    const configFileContent = fs.readFileSync(configPath, 'utf8');
    const configJson = JSON.parse(configFileContent);
    config = configJson[env];
    if (!config) {
        throw new Error(`Configuration for environment "${env}" not found.`);
    }
} catch (error) {
    console.error('Error loading database configuration:', error);
    process.exit(1); // Thoát nếu không có config
}

// 3. Khởi tạo Sequelize
let sequelize;
if (config.use_env_variable && process.env[config.use_env_variable]) {
    // Sử dụng biến môi trường được chỉ định trong config.json (thường cho production với DATABASE_URL)
    sequelize = new Sequelize(process.env[config.use_env_variable], {
        dialect: config.dialect || 'mysql', // Lấy dialect từ config nếu có
        operatorsAliases: config.operatorsAliases === undefined ? 0 : config.operatorsAliases, // Sequelize v5, nên bỏ nếu dùng v6+
        dialectOptions: config.dialectOptions || {
            // Lấy dialectOptions từ config nếu có
            dateStrings: true,
            typeCast: true, // Cẩn thận với typeCast, có thể không cần thiết hoặc gây vấn đề
            // timezone: '+07:00', // Nên cấu hình timezone ở cấp độ kết nối nếu DB hỗ trợ
        },
        // timezone: config.timezone || '+07:00', // timezone cho Sequelize
        logging: config.logging === undefined ? false : config.logging,
        ...config, // Truyền các thuộc tính còn lại của config
    });
} else if (config.database && config.username) {
    // Sử dụng các trường cụ thể từ config.json
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect || 'mysql',
        operatorsAliases: config.operatorsAliases === undefined ? 0 : config.operatorsAliases,
        dialectOptions: config.dialectOptions || {
            dateStrings: true,
            typeCast: true,
            // timezone: '+07:00',
        },
        // timezone: config.timezone || '+07:00',
        logging: config.logging === undefined ? false : config.logging,
        ...config, // Truyền các thuộc tính còn lại của config
    });
} else {
    // Fallback nếu config.json không đúng định dạng mong đợi
    // nhưng vẫn có các biến môi trường DB_NAME, DB_USERNAME, DB_PASSWORD... (như code gốc của bạn)
    // Tuy nhiên, nên ưu tiên cấu hình từ config.json nếu nó tồn tại.
    console.warn(
        'Using direct environment variables for Sequelize as fallback. Consider defining them in config.json.'
    );
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            // timezone: '+07:00',
        },
        // timezone: '+07:00',
        logging: false,
    });
}

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to your database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// 4. Nạp các model files (Cách hiện đại)
const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1 // Loại trừ các file test
    );
});

// Sử dụng Promise.all để đảm bảo tất cả các model được import và khởi tạo xong
// trước khi thực hiện associate. Điều này quan trọng vì import() là bất đồng bộ.
await Promise.all(
    modelFiles.map(async (file) => {
        // Đường dẫn tuyệt đối đến file model
        const modelFilePath = path.join(__dirname, file);
        // Chuyển đổi đường dẫn file thành URL để import động hoạt động đúng
        const modelFileUrl = new URL(`file:///${modelFilePath.replace(/\\/g, '/')}`).href;

        try {
            const modelModule = await import(modelFileUrl);
            // Giả sử mỗi file model export default một hàm nhận (sequelize, DataTypes)
            // và trả về class Model đã được define.
            // Ví dụ: export default (sequelize, DataTypes) => { const User = sequelize.define(...); return User; }
            const modelDefinition = modelModule.default;

            if (typeof modelDefinition === 'function') {
                const model = modelDefinition(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            } else {
                console.warn(`File ${file} at ${modelFileUrl} does not export a default function.`);
            }
        } catch (error) {
            console.error(`Error importing model ${file} from ${modelFileUrl}:`, error);
        }
    })
);

// 5. Thực hiện associations
Object.keys(db).forEach((modelName) => {
    if (db[modelName] && db[modelName].associate) {
        // Thêm kiểm tra db[modelName] tồn tại
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize; // Lớp Sequelize (không phải instance)

export default db;
