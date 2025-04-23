'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'admin - HaryPhamDev',
                email: 'admin@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'New York',
                phone: '088456732',
                avatar: 'admin.png',
                roleId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Evan',
                email: 'doctor@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor3.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Ben',
                email: 'doctor5@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor4.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Hary Pham',
                email: 'doctor10@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor1.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Clever',
                email: 'doctor1@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor2.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Sam',
                email: 'doctor2@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor3.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Eric Pham',
                email: 'doctor3@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor4.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'customer - Eric Pham',
                email: 'customer@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'customer.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'customer - Eric Pham 1',
                email: 'customer1@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'customer.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'customer - Eric Pham 2',
                email: 'customer2@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'customer.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'customer - Eric Pham 3',
                email: 'customer3@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'customer.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
