/*
custom-validation.js is for functions that act as custom validaiton for website forms.
It also handles password hashing.
*/

const user = require("./user");
const argon2 = require('argon2');

exports.checkUser = function checkUser(results) {
    if (results) {
        throw new Error("A user with this email already exists.");
    } else {
        return true;
    }
}

exports.hashPassword = async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.log("Unexpected error caught: " + err);
        throw new Error("There was a problem registering your account.");
    }
}

exports.verifyPassword = function verifyPassword(password) {
    
}

exports.unexpectedError = function unexpectedError(error) {
    console.log("Unexpected error caught: " + error);
    return false;
}