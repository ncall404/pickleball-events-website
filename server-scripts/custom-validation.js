/*
custom-validation.js is for functions that act as custom validaiton for website forms.
*/

const user = require("./user");

exports.checkUser = function checkUser(results) {
    if (results) {
        console.log("Debug Message: Error Thrown");
        throw new Error("A user with this email already exists.");
        //return false;
    } else {
        console.log("No error!");
        return true;
    }
}

exports.unexpectedError = function unexpectedError(error) {
    console.log("Unexpected error caught: " + error);
    return false;
}