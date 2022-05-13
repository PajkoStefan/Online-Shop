const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
        dialect: 'mysql', host: process.env.HOST
    });

    module.exports = sequelize;
