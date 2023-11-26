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

exports.fetchPassword = function fetchPassword(email) {
    db.connection.execute(
        'SELECT Password FROM User WHERE Email = ?',
        [email],
        function(err, results) {
            //if (err) 
        }
    )
}

exports.loginUser = function loginUser(email, password) {

}

exports.testQuery = function testQuery() {
    var createUser = "INSERT INTO User (FirstName, LastName, Email, UserType) VALUES('Nathan', 'Call', 'test@gmail.com', 'TestUser')";
    var checkUser = "SELECT * FROM User";
    var deleteUser = "DELETE FROM User WHERE UserType='TestUser'"

    db.connection.query(createUser, function (err, results) {
        if (err) throw err;
        console.log("Created test user.");
    });

    db.connection.query(checkUser, function (err, results) {
        if (err) throw err;
        console.log(results);
    });

    db.connection.query(deleteUser, function(err, results) {
        if (err) throw err;
        console.log("Test user(s) deleted.")
    });
}

