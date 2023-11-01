/**/

//import connection from "./database-connect.js";
const connection = require("./database-connect");
//import db from "./new-database-connect.js";

// Creates a new user in the database if they don't exist
function registerUser() {

}

function loginUser() {

}

exports.testQuery = function testQuery() {
    //var userTable = db.getTable('USER');
    //userTable.insert(['FirstName', 'LastName', 'Email', 'UserType']).values('Nathan', 'Call', 'test@gmail.com', 'TestUser').execute();

    var createUser = "INSERT INTO USER (FirstName, LastName, Email, UserType) VALUES('Nathan', 'Call', 'test@gmail.com', 'TestUser')";
    var checkUser = "SELECT * FROM USER";
    var deleteUser = "DELETE FROM USER WHERE UserType='TestUser'"

    connection.query(createUser, function (err, result) {
        if (err) throw err;
        console.log("Created test user.");
    });

    connection.query(checkUser, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    connection.query(deleteUser, function(err, result) {
        if (err) throw err;
        console.log("Test user(s) deleted.")
    });
}

