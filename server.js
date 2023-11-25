/*
server.js is for running the server and handling the routing of the website. Handling the routing includes doing any server-side validation for submitted forms.
*/

const express = require('express');
const { body, matchedData, validationResult } = require('express-validator')
const path = require("path");
const user = require("./server-scripts/user");
const custValidation = require("./server-scripts/custom-validation");

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
    // User registration POST request.
app.post("/pages/user/register",
    body('firstName').notEmpty().withMessage("A first name is required.").trim().isAlpha().withMessage("First name must be alphabet letters.").escape() // End of first name validation.
    ,body('lastName').notEmpty().withMessage("A first name is required.").trim().isAlpha().withMessage("First name must be alphabet letters.").escape() // End of last name validation.
    ,body('email').notEmpty().withMessage("An email address is required.").trim().toLowerCase().escape().isEmail().withMessage("Email address is incorrectly formatted. Example of correct email: ExampleAddress@email.com")
    .custom(value =>
        user.doesUserExist(value)
        .then(custValidation.checkUser(results))
        .catch(custValidation.unexpectedError(err))
    ).withMessage("A user with this email already exists.") // End of email validation.
    ,body('password').isLength({min: 8}).withMessage("Passwords must be at least 8 characters.").escape() // End of password validation.
    ,body('confirmPassword')
    .custom((value, {req}) => {
        return value === req.body.password;
    }).withMessage("Passwords do not match.").escape(), // End of password confirmation validation.
function(req, res) {
    const errors = validationResult(req);
    // if data is good then make user and redirect to login.
    if (errors.array().length <= 0) {
        console.log(errors.array());
        const data = matchedData(req);
        user.registerUser(data.firstName, data.lastName, data.email, data.password);

        res.redirect('/pages/user/login.html');
    }
    // else if data is bad then send message to client with user-friendly error messages.
    else if (errors.array().length > 0) {
        console.log(errors.array());
        res.send( {errors: errors.array() });
    }

});

    // User login POST request.
// ===== TODO: login post request =====

// End POST routing.



// Start Server
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
