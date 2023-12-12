/*
event.js is for handling event operations such as creating or joining events.
Queries should be done through prepared statements.
*/

var db = require("./database-connect");

// Returns all the states in the State table.
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

exports.joinEvent = function joinEvent(eventID, userID) {
    db.connection.execute(
        'INSERT INTO EventAttendee (EventID, UserID) VALUES (?, ?)',
        [eventID, userID],
        err => {if(err) console.log(err);}
    )
}

exports.createEvent = function createEvent(userID, eventName, eventDateTime, eventAddress, eventCity, eventState, eventZIP, eventDescription) {
    db.connection.execute(
        'INSERT INTO Event (EventName, Description, EventDateTime, StreetAddress, City, StateID, ZipCode, CreatorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [eventName, eventDescription, eventDateTime, eventAddress, eventCity, eventState, eventZIP, userID],
        function(err, result) {
            if(err) console.log(err);
            exports.joinEvent(result.insertId, userID);
        }
    );
}

exports.canJoin = function canJoin(eventID, userID) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT EventID FROM EventAttendee WHERE EventID = ? AND UserID = ?',
            [eventID, userID],
            function (err, results) {
                if (err) reject(err);

                if (results.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        )
    })
}

// Returns the StateID of a given state.
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

// Returns all the details of events that the User has NOT joined.
exports.fetchAvailable = function fetchAvailable(userID) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT e.EventID, e.EventName, e.`Description`, e.EventDateTime, e.StreetAddress, e.City, s.StateInitials, e.ZipCode, u.FirstName, u.LastName FROM `Event` e JOIN State s ON e.StateID = s.StateID JOIN `User` as u ON e.CreatorID = u.UserID WHERE e.EventID NOT IN (SELECT EventID FROM EventAttendee ea WHERE ea.UserID = ?)',
            [userID],
            function (err, results) {
                if (err) reject(err);

                resolve(results);
            }
        )
    })
}

// Returns all the details of the events that the User has joined.
exports.fetchJoined = function fetchJoined(userID) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT e.EventID, e.EventName, e.Description, e.EventDateTime, e.StreetAddress, e.City, s.StateInitials, e.ZipCode, ec.FirstName, ec.LastName FROM State as s RIGHT JOIN Event as e ON s.StateID = e.StateID LEFT JOIN EventAttendee as ea ON e.EventID  = ea.EventID LEFT JOIN User as u ON ea.UserID = u.UserID AND u.UserID = ? JOIN User as ec ON e.CreatorID = ec.UserID WHERE u.UserID = ?',
            [userID, userID],
            function (err, results) {
                if (err) reject(err);

                resolve(results);
            }
        )
    })
}

// Returns all the details of the events that the User has created.
exports.fetchCreated = function fetchCreated(userID) {
    return new Promise(function(resolve, reject) {
        db.connection.execute(
            'SELECT DISTINCT e.EventID, e.EventName, e.Description, e.EventDateTime, e.StreetAddress, e.City, s.StateInitials, e.ZipCode, ec.FirstName, ec.LastName FROM State as s RIGHT JOIN Event as e ON s.StateID = e.StateID LEFT JOIN EventAttendee as ea ON e.EventID  = ea.EventID LEFT JOIN User as u ON ea.UserID = u.UserID AND u.UserID = ? JOIN User as ec ON e.CreatorID = ec.UserID WHERE e.CreatorID = ?',
            [userID, userID],
            function (err, results) {
                if (err) reject(err);

                resolve(results);
            }
        )
    })
}