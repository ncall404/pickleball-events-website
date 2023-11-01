const express = require('express');
const path = require("path");
const mysql2 = require("mysql2");
//const user = require("./server-scripts/user.js");

const app = express();
const port = 8080;

app.use(express.static('./'));
app.use(express.urlencoded({extended:true}));


var connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "Passw0rd!", // Must replace with database password.
    database: "dev_database"
});

connection.connect((err) => {
    if (err) throw err; // Throw error if connection is unsuccessful.
    console.log("Database connected");
});



// Routing for GET requests to the server through various directories.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/pages/", function (req, res) {
    res.redirect('/index.html');
});

app.get("/pages/user/", function (req, res) {
    console.log("Test");
    res.redirect('/pages/user/login.html');
});

app.get("/pages/user/login", function (req, res) {
    console.log("Test");
    res.redirect('/pages/user/login.html');
});

// End GET routing.

// Routing for POST requests

app.post("/pages/user/register", function(req, res) {
    console.log("Post!");
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
    res.redirect('/pages/user/login.html');
});





// Start Server
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
