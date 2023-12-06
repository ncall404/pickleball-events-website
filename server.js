/*
server.js is for running the server and handling the routing of the website. Handling the routing includes doing any server-side validation for submitted forms.
*/

const express = require('express');
const { body, matchedData, validationResult } = require('express-validator');
const session = require('express-session');
const path = require('path');
const user = require('./server-scripts/user');
const event = require('./server-scripts/event');
const custValidation = require('./server-scripts/custom-validation');

const app = express();
const port = 8080;

app.use(session({
    secret: 'placeholderSecret',
    resave: false,
    saveUninitialized: true
})); // In production the secret would be replaced with something like an environment variable and would be much more secure. Session would possibly be stored in a database. For our purposes in this project, this placeholder will suffice. Additionaly, in production, you would potentially want to use something like Passport.js in conjunction with express-sessions for higher security.
app.use(express.urlencoded({extended:true}));
app.use(express.static('./'));

// Routing for GET requests to the server through various directories.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/pages/user/login", function (req, res) {
    res.sendFile(path.join(__dirname, '/pages/user/login.html'));
});

app.get("/pages/user/register", function (req, res) {
    res.sendFile(path.join(__dirname, '/pages/user/register.html'));
});

app.get("/pages/events/event-create", function (req, res) {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, '/pages/events/event-create.html'));
    } else {
        req.session.loggedIn = false;
        res.status(401).send('<h1>Unauthorized to access this page.</h1> <br> <a href="/pages/user/login">Please log in to access this page.</a>');
    } 
});

app.get("/pages/events/event-list", function (req, res) {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, '/pages/events/event-list.html'));
    } else {
        req.session.loggedIn = false;
        res.status(401).send('<h1>Unauthorized to access this page.</h1> <br> <a href="/pages/user/login">Please log in to access this page.</a>');
    }
});



// User registration POST request.  Does server-side validation on the POST request then handles registering the user.
app.post("/pages/user/register",
    body('firstName').notEmpty().withMessage("A first name is required.").bail().trim().isAlpha().withMessage("First name must be alphabetical letters.").escape(),
    body('lastName').notEmpty().withMessage("A last name is required.").bail().trim().isAlpha().withMessage("Last name must be alphabetical letters.").escape(),
    body('email').notEmpty().withMessage("An email address is required.").bail().trim().toLowerCase().escape().isEmail().withMessage("Email address is incorrectly formatted. Example of correct email: ExampleAddress@email.com").bail()
    .custom( value => user.doesUserExist(value).then(results => {
        exists = custValidation.checkUser(results);
        if (!exists) {
            throw new Error("A user with this email already exists.");
        } else {
            return true;
        }
    })),
    body('password').isLength({min: 8}).withMessage("Passwords must be at least 8 characters.").bail().escape(), // Add .isStrongPassword() in production setting.
    body('confirmPassword').escape()
    .custom((value, {req}) => { return value === req.body.password; }).withMessage("Passwords do not match.").bail(),
    body('password').customSanitizer(value => custValidation.hashPassword(value)), // Password hashing is done after confirmation so that it doesn't have to be done twice.
function(req, res) {
    const errors = validationResult(req);
    // if no errors then make user and redirect to login.
    if (errors.array().length <= 0) {
        const data = matchedData(req);
        user.registerUser(data.firstName, data.lastName, data.email, data.password);

        res.redirect('/pages/user/login');
    }
    // else if errors then send error messages to client and stay on the registration page.
    else if (errors.array().length > 0) {
        console.log(errors.array());
        res.send( {errors: errors.array()} );
    }
});

// User login POST request. Does server-side validation on the POST request then handles logging in the user.
app.post("/pages/user/login",
    body('email').notEmpty().withMessage("An email address is required for login.").bail().trim().toLowerCase().escape().isEmail().withMessage("Email address is incorrectly formatted. Example of correct email: ExampleAddress@email.com").bail().custom(value => user.doesUserExist(value).then(results => {
        exists = custValidation.checkUser(results);
        if (exists) {
            throw new Error("No user with this email exists in our system.");
        } else {
            return true;
        }
    })),
    body('password').notEmpty().withMessage("Please input your account password.").bail().escape().custom((value, {req}) => user.fetchPassword(req.body.email, value).then(results => custValidation.verifyPassword(results[0], results[1]))),
async function(req, res) {
    const errors = validationResult(req)
    // if no errors then redirect to event list page.
    if (errors.array().length <= 0) {
        const data = matchedData(req);
        const userID = await user.fetchUserID(data.email);
        req.session.userID = userID;
        req.session.loggedIn = true;
        req.session.cookie.maxAge = 43200000; // Cookie lasts for 12 hours.
        res.redirect('/pages/events/event-list');
    }
    // else if errors then send error messages to client and stay on the login page.
    else if (errors.array().length > 0) {
        console.log(errors.array());
        res.status(400).json( {errors: errors.array(), messageID: "loginMessage"} );
    }
});

// Event creation POST request.
app.post("/pages/events/event-create",
    body('eventName').notEmpty().withMessage("An event name is required.").bail().trim().isAlphanumeric('en-US', {ignore: ' '}).withMessage("Please keep the event name as only numbers, alphabetic letters, and spaces.").escape(),
    body('eventDateTime').isISO8601().withMessage("An event date and time are required.").toDate().escape(),
    body('eventStreetAddress').notEmpty().withMessage("An event address is required.").bail().trim().isAlphanumeric('en-US', {ignore: ' '}).withMessage("Please keep the event address as only numbers, alphabetic letters, and spaces.").escape(),
    body('eventCity').notEmpty().withMessage("The city an event takes place in is is required.").bail().trim().isAlphanumeric('en-US', {ignore: ' '}).withMessage("Please keep the city as only numbers, alphabetic letters, and spaces.").escape(),
    body('eventState').escape().custom(async value => {
        const isValid = await event.validState(value);
        if (!isValid) {
            throw new Error("The state the event takes place in is required");
        } else {
            return true;
        }
    }),
    body('eventZIP').notEmpty().withMessage("The ZIP code / postal code where your event is taking place is required.").bail().isPostalCode('US').escape(),
    body('eventDescription').trim().isAlphanumeric('en-US', {ignore: /\s/}).withMessage("Please keep the description as only numbers, alphabetic letters, and spaces/linebreaks.").bail().isLength({max: 500}).withMessage("The event description must be 500 characters or less.").escape(),
function(req, res) {
    const errors = validationResult(req);
    if (errors.array().length <= 0) {
        const data = matchedData(req);
        //const newDateTime = custValidation.convertDateTime(data.eventDateTime);
        event.createEvent(req.session.userID, data.eventName, data.eventDateTime /*newDateTime*/, data.eventStreetAddress, data.eventCity, data.eventState, data.eventZIP, data.eventDescription);
        res.redirect("/pages/events/event-list");
    }
    else if (errors.array().length > 0) {
        console.log(errors.array());
        res.redirect("/pages/events/event-create");
    }
});


// Redirect all invalid urls/routes to home screen.
app.all('*', function(req, res) {
    res.status(404).send('Page not found! <a href="/">Click here to go to the Home Page.</a>');
});


// Start Server
app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
