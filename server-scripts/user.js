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

exports.loginUser = function loginUser(email, password) {

}