/*
event.js is for handling event operations such as creating or joining events.
Queries should be done through prepared statements.
*/

var db = require("./database-connect");

exports.createEvent = function createEvent(userID, eventName, eventDateTime, eventAddress, eventCity, eventState, eventZIP, eventDescription) {

}

exports.joinEvent = function joinEvent(eventID, userID) {

}

exports.validState = function validState(state) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT StateID FROM State WHERE StateCode=?',
            [state],
            function (err, results) {
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