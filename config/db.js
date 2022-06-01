const mysql = require('mysql');

// Create connection
const config = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    
});

const con = mysql.createConnection(config);

module.exports = con;