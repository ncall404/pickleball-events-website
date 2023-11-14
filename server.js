const express = require('express');
const { body, matchedData, validationResult } = require('express-validator')
const path = require("path");
const user = require("./server-scripts/user")

const app = express();
const port = 8080;

app.use(express.static('./'));
app.use(express.urlencoded({extended:true}));


// Routing for GET requests to the server through various directories.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/pages/", function (req, res) {
    res.redirect('/index.html');
});

app.get("/pages/user/", function (req, res) {
    res.redirect('/pages/user/login.html');
});

app.get("/pages/user/login", function (req, res) {
    res.redirect('/pages/user/login.html');
});

app.get("/pages/user/register", function (req, res) {
    res.redirect("/pages/user/register.html");
});

// End GET routing.

// Routing for POST requests.
app.post("/pages/user/register",
    body('firstName').notEmpty().withMessage("A first name is required.").trim().isAlpha().withMessage("First name must be alphabet letters.").escape(),
    body('lastName').notEmpty().withMessage("A first name is required.").trim().isAlpha().withMessage("First name must be alphabet letters.").escape(),
    body('email').trim().notEmpty().withMessage("An email address is required.").isEmail().withMessage("Email address is incorrectly formatted. Example of correct email: ExampleAddress@email.com").escape(),
    body('password').isLength({min: 8}).withMessage("Passwords must be at least 8 characters.").escape(),
    body('confirmPassword').custom((value, {req}) => {
        return value === req.body.password;
    }).withMessage("Passwords do not match.").escape(),
function(req, res) {
    //user.testQuery(); // do a test query to check the database connection

    // if data is bad then send message to client with user-friendly errors

    // else if data is good then make user and redirect to login
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password; // Database type will have to be changed to CHAR(86)? Salt column must be added to user table.
    var confirmPassword = req.body.confirmPassword;

    res.redirect('/pages/user/login.html');
});

// End POST routing.



// Start Server
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
