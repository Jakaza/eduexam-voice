const express = require("express");
const router = express.Router();
const Page = require("./controllers/page");
const Auth = require("./controllers/auth");
const isUserLoggedIn = require('./utils/checkLogin');
const Module = require("./controllers/module");
const Test = require("./controllers/test");

// rendering pages - ejs
router.get("/", isUserLoggedIn, Page.homePage);
router.get("/login",  Page.login);
router.get("/register",  Page.register);


// Admin

// User

// Lecturer
router.get("/test/view/:module_id",  Page.viewTest);


// AUTH 
router.post('/auth/register', Auth.register)
router.post('/auth/login', Auth.login)
router.get('/auth/logout', Auth.logout)

// MODULE
router.post('/module/create', Module.create)
router.delete('/module/delete/:moduleID', Module.delete)

// TEST
router.post('/test/create', Test.create)
router.delete('/test/delete/:testID', Test.delete)


module.exports = router;