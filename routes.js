const express = require("express");
const router = express.Router();
const Page = require("./controllers/page");
const Auth = require("./controllers/auth");
const isUserLoggedIn = require('./utils/checkLogin');
const Module = require("./controllers/module");

// rendering pages - ejs
router.get("/", isUserLoggedIn, Page.homePage);
router.get("/login",  Page.login);
router.get("/register",  Page.register);

// Admin

// User

// Lecturer


// AUTH 
router.post('/auth/register', Auth.register)
router.post('/auth/login', Auth.login)
router.get('/auth/logout', Auth.logout)

// MODULE
router.post('/module/create', Module.create)


module.exports = router;