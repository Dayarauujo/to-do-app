import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",   // seu host
    user: "root",        // seu usuário do MySQL
    password: "root", // sua senha
    database: "todo_app"
  });