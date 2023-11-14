/*
database-connect.js is for connecting to the database. 
Queries are to be done in other files.
*/

const mysql2 = require("mysql2");



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

connection.connect((err) => {
    if (err) throw err; // Throw error if connection is unsuccessful.
    console.log("Database connected");
});


exports.connection = connection;