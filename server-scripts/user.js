/*
user.js is for handling user operations such as registering or logging in.
Queries should be done through prepared statements.
*/

var db = require("./database-connect");


// Creates a new user in the database if they don't exist
exports.registerUser = function registerUser(firstName, lastName, email, password) {

}

exports.loginUser = function loginUser(email, password) {

}

exports.testQuery = function testQuery() {
    var createUser = "INSERT INTO USER (FirstName, LastName, Email, UserType) VALUES('Nathan', 'Call', 'test@gmail.com', 'TestUser')";
    var checkUser = "SELECT * FROM USER";
    var deleteUser = "DELETE FROM USER WHERE UserType='TestUser'"

    db.connection.query(createUser, function (err, result) {
        if (err) throw err;
        console.log("Created test user.");
    });

    db.connection.query(checkUser, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    db.connection.query(deleteUser, function(err, result) {
        if (err) throw err;
        console.log("Test user(s) deleted.")
    });
}

