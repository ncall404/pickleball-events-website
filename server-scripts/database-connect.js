/*
database-connect.js is for connecting to the database. 
queries are to be done in other files.
*/

/* import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
*/
const mysql2 = require("mysql2");

//import { createConnection } from '../node_modules/mysql2/index.js';

//import mysql2 from 'mysql2';
//const mysql2 = await import("../node_modules/mysql2/index.js");



/* 
Connection information is fine being in here for the dev environment.
BUT for production, use more secure methods for populating these such as environment variables.
*/
var connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "Passw0rd!", // Must replace with database password.
    database: "dev_database"
});

exports.conn = connection.connect((err) => {
    if (err) throw err; // Throw error if connection is unsuccessful.
    console.log("Database connected");
});

//exports.connection = connection;