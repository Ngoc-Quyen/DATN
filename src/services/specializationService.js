// import { reject, resolve } from 'bluebird';
const db = require('../models');

let getSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialization = await db.Specialization.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'image', 'description'],
            });
            if (!specialization) {
                reject("Can't get specialization-id: " + id);
            }
            let post = await db.Post.findOne({
                where: { forSpecializationId: id },
                attributes: ['id', 'title', 'contentHTML'],
            });

            let places = await db.Place.findAll({
                attributes: ['id', 'name'],
            });

            resolve({
                specialization: specialization,
                post: post,
                places: places,
            });
        } catch (err) {
            reject(err);
        }
    });
};

let getAllSpecializations = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listSpecializations = await db.Specialization.findAll({
                attributes: ['id', 'name'],
                order: [['id', 'ASC']],
            });
            resolve(listSpecializations);
        } catch (e) {
            reject(e);
        }
    });
};

let deleteSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Specialization.destroy({
                where: { id: id },
            });
            let infos = await db.Doctor_User.findAll({
                where: {
                    specializationId: id,
                },
            });
            let arrId = [];
            infos.forEach((x) => {
                arrId.push(x.id);
            });
            await db.Doctor_User.destroy({ where: { id: arrId } });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
};
let updateSpecializationById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required Parameter!',
                });
            }
            let specialization = await db.Specialization.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (!specialization) {
                resolve({
                    errCode: 1,
                    errMessage: `specialization's not found!`,
                });
            } else {
                specialization.name = data.name;
                specialization.description = data.description;
                // Nếu có file ảnh được upload, gửi ảnh lên Firebase và lấy URL
                // let url = data.image;
                // if (url) {
                //     specialization.image = url;
                // }
                await specialization.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the specialization success!',
                    specialization,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let createSpecialization = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newSpecialty = await db.Specialization.create(data);
            resolve({
                errCode: 0,
                errMessage: 'Success',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getSpecializationById: getSpecializationById,
    getAllSpecializations: getAllSpecializations,
    deleteSpecializationById: deleteSpecializationById,
    updateSpecializationById: updateSpecializationById,
    createSpecialization: createSpecialization,
};
