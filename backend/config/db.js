const mysql = require("mysql2");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "flipkart"
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database!");
    connection.release();
});

module.exports = { pool };
