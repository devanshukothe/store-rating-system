import dotenv from "dotenv";
dotenv.config(); 

import mysql from "mysql2/promise";
console.log("DB CONFIG CHECK:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS ? "SET" : "NOT SET",
  db: process.env.DB_NAME,
});

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
