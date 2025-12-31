import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export const db4 = mysql.createPool({
  host: process.env.DB_HOST_LAB,
  user: process.env.DB_USER_LAB,
  password: process.env.DB_PASS_LAB,
  database: process.env.DB_NAME_LAB,
  waitForConnections: true,
  connectionLimit: 10,
});
