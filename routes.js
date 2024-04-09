const express = require("express");
const router = express.Router();
const Page = require("./controllers/page");
const Auth = require("./controllers/auth");
const isUserLoggedIn = require("./utils/checkLogin");
const Module = require("./controllers/module");
const Test = require("./controllers/test");
const Question = require("./controllers/question");
const SuperAdmin = require("./controllers/admin");

// rendering pages - ejs
router.get("/", isUserLoggedIn, Page.homePage);
router.get("/login", Page.login);
router.get("/register", Page.register);

// Admin
router.get("/students", SuperAdmin.viewStudents);
router.get("/lecturers", SuperAdmin.viewLecturers);
router.get("/user/edit/:userId", SuperAdmin.viewEditUser);
router.post("/user/edit", SuperAdmin.editUser);

// User
router.get("/modules", Page.viewModules);
router.get("/modules/:moduleName", Page.viewModule);
router.get("/tests/:testId", Page.viewModuleTest);

// Lecturer
router.get("/test/view/:module_id", isUserLoggedIn, Page.viewTest);
router.get("/question/view", Page.viewQuestion);

// AUTH
router.post("/auth/register", Auth.register);
router.post("/auth/login", Auth.login);
router.get("/auth/logout", Auth.logout);

// MODULE
router.post("/module/create", Module.create);
router.delete("/module/delete/:moduleID", Module.delete);

// TEST
router.post("/test/create", Test.create);
router.get("/test/delete/:testId/:moduleId", Test.delete);
router.post("/test/update/:testID/:moduleID", Test.update);

// QUESTION
router.post("/question/create", Question.create);
router.get("/question/delete/:questionID/:testId", Question.delete);
router.post("/question/update/:questionID/:testId", Question.update);

module.exports = router;
