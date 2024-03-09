const express = require("express");
const router = express.Router();
const Page = require("./controllers/page");
const Auth = require("./controllers/auth");
const isUserLoggedIn = require('./utils/checkLogin')

// rendering pages - ejs
// router.get("/", isUserLoggedIn, Page.homePage);
router.get("/login",  Page.login);
router.get("/register",  Page.register);

// Admin

// User

// Lecturer


// AUTH 

router.post('/auth/register', Auth.register)


module.exports = router;