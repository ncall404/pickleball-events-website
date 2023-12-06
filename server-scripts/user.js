/*
user.js is for handling user operations such as registering or logging in.
Queries should be done through prepared statements.
*/

var db = require("./database-connect");

// Function to check if the user with a given email exists.
exports.doesUserExist = function doesUserExist(email) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT UserID FROM User WHERE Email = ?',
            [email],
            function(err, results) {
                if (err) reject(err);

                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        )
    })
}

// Creates a new user in the database if they don't exist.
exports.registerUser = function registerUser(firstName, lastName, email, password) {
    db.connection.execute(
        'INSERT INTO User (FirstName, LastName, Email, Password, UserType) VALUES (?, ?, ?, ?, "User")',
        [firstName, lastName, email, password],
        err => {if (err) console.log(err);}
    );
}

// Fetches the hashed password of a given user email. Used for internal server operations only.
exports.fetchPassword = function fetchPassword(email, password) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT Password FROM User WHERE Email = ?',
            [email],
            function (err, results) {
                if (err) reject(err);

                if (results.length > 0) {
                    resolve([password, results[0].Password]);
                } else {
                    resolve([password, ""]);
                }
            }
        )
    })
}

// Fetches the UserID of a given user email.
exports.fetchUserID = async function fetchUserID(email) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT UserID FROM User WHERE Email=?',
            [email],
            function (err, results) {
                if (err) reject(err);
    
                if (results.length > 0) {
                    resolve(results[0].UserID);
                } else {
                    console.log("No user ID found!");
                    throw new Error("UserID not found from your email! Does your account exist? If so, contact us at placeholder@gmail.com");
                }
            }
        )
    })
}