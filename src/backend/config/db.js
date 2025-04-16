//Mysql database connection
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME

});

connection.connect((err) =>{
    if(err) throw err;
    console.log('Connected to MySql');
});

export default connection; 