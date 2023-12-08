/*
event.js is for handling event operations such as creating or joining events.
Queries should be done through prepared statements.
*/

var db = require("./database-connect");

exports.fetchStates = function fetchStates() {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT StateName, StateInitials FROM State',
            function(err, results) {
                if (err) reject(err);
                resolve(results);
            }
        )
    })
}

exports.createEvent = function createEvent(userID, eventName, eventDateTime, eventAddress, eventCity, eventState, eventZIP, eventDescription) {
    console.log(userID);
    console.log(eventName);
    console.log(eventDateTime);
    console.log(eventAddress);
    console.log(eventCity);
    console.log(eventState);
    console.log(eventZIP);
    console.log(eventDescription);
    db.connection.execute(
        'INSERT INTO Event (EventName, Description, EventDateTime, StreetAddress, City, StateID, ZipCode, CreatorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [eventName, eventDescription, eventDateTime, eventAddress, eventCity, eventState, eventZIP, userID],
        err => {if(err) console.log(err);}
    );
}

exports.joinEvent = function joinEvent(eventID, userID) {

}

exports.getStateID = function getStateID(state) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT StateID FROM State WHERE StateInitials=?',
            [state],
            function (err, results) {
                if (err) reject(err);
    
                if (results.length > 0) {
                    stateID = results[0].StateID
                    resolve(stateID);
                } else {
                    resolve(false);
                }
            }
        );
    })
}