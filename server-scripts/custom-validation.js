/*
custom-validation.js is for functions that act as custom validaiton and sanitization for the website forms.
Some validation may still be done with functions in other files.
It also handles password hashing.
*/

const user = require("./user");
const argon2 = require('argon2');

exports.checkUser = function checkUser(results) {
    if (results) {
        return false
    } else {
        return true;
    }
}

exports.hashPassword = async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.log("Unexpected system error caught: " + err);
        throw new Error("There was a problem registering your account.");
    }
}

exports.verifyPassword = async function verifyPassword(password, storedHash) {
    if (await argon2.verify(storedHash, password)) {
        return true
    } else {
        throw new Error("Incorrect password.")
    }
}

exports.convertDateTime = function convertDateTime(dateTime) {
    try {
        var newDateTime = new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ');
        return newDateTime;
    }
    catch (err) {
        console.log(err);
        throw new Error("Please input an event date and time.");
    }
}

exports.unexpectedError = function unexpectedError(error) {
    console.log("Unexpected error caught: " + error);
    return false;
}