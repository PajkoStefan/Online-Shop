const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
});


module.exports = pool.promise();