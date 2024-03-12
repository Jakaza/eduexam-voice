const passport = require("passport");
const cookie = require("cookie");
const { ROLES } = require("../constants/");
const dbFunctions = require('../config/dbFunctions');

const Page = {

  viewModules: async (req, res, next) =>{
    passport.authenticate("jwt", { session: false },async (err, user, info) => {
      if (err) {
          return res.status(500).render("error/server");
      }
      if (!user) {
          return res.render("index", { isAuthenticated: false });
      }

      if (user.user_role === ROLES.Student) {

        const modules = await dbFunctions.selectWithCondition('modules', { "course_id" : user.course_id }, 1);
          return res.render("student/modules", {
              user: user,
              modules : modules ? modules : [],
          });
      }

      res.redirect("/")
  })(req, res, next);
  },

  viewModule: async (req, res, next) =>{
    passport.authenticate("jwt", { session: false },async (err, user, info) => {
      if (err) {
          return res.status(500).render("error/server");
      }
      if (!user) {
          return res.render("index", { isAuthenticated: false });
      }
      if (user.user_role === ROLES.Student) {

        const { moduleName } = req.params;
        const decodedModuleName = moduleName.replace(/%20/g, ' ');

        let modules = await dbFunctions.selectWithCondition('modules', { "module_name" : decodedModuleName }, 1);
        const tests = []
        
        if (modules && modules.length > 0) {
          const module_id = modules[0].module_id;
          tests = await dbFunctions.selectWithCondition('tests', { "module_id" : module_id }, 1);
        }
 
          return res.render("student/module", {
              user: user,
              module_name: decodedModuleName, 
              tests : tests ? tests : [],
          });
      }
      res.redirect("/")
  })(req, res, next);
  },


  viewTest: async (req, res) => {

    const { module_id } = req.params;

    const tests = await dbFunctions.selectWithCondition('tests', { module_id }, 1);
    const modules = await dbFunctions.selectWithCondition('modules', { module_id }, 1);


    console.log("modules ", modules);
    res.render("lecturer/test", { 
      tests : tests ? tests : [],
      module_id: module_id ? module_id : 0,
      module: modules[0]
    });
  },
  viewQuestion: async (req, res) => {
    const testId = req.query.test; // Get the value of the 'test' query parameter
    try {    
      const pageNumber = 1; 
      const questions = await dbFunctions.selectWithCondition('questions', { test_id: testId }, 1);
      const tests = await dbFunctions.selectWithCondition('tests', { test_id: testId }, 1);

      console.log("tests ", tests);


      return res.render("lecturer/question", {
        questions: questions ? questions : [],
        testId: testId,
        test : tests[0]
      });
    }catch(error){
      console.log(error);
    }
  },

  register: async (req, res) => {
    try {
      const pageNumber = 1; 
      const courses = await dbFunctions.selectDataWithPagination('courses', pageNumber);
      res.render("register", { courses });
  } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Internal Server Error');
  }
  },
  login: (req, res) => {
    res.render("index");
  },
  homePage : (req, res, next) => {
    passport.authenticate("jwt", { session: false },async (err, user, info) => {
        if (err) {
            return res.status(500).render("error/server");
        }
        if (!user) {
            return res.render("index", { isAuthenticated: false });
        }

        if (user.user_role === ROLES.Admin) {
            return res.render("admin/main", {
                user: user,
            });
        } else if (user.user_role === ROLES.Lecturer) {

          try {
            
          const pageNumber = 1; 
          const modules = await dbFunctions.selectWithCondition('modules', { course_id: user.course_id }, 1);
          console.log(modules);
          return res.render("lecturer/menu", {
            user: user,
            modules: modules ? modules : []
          });
          } catch (error) {
            console.log(error);
          }

        } else if(user.user_role === ROLES.Student) {


            return res.render("student/menu", {
                user: user,
            });
        }

        res.render("index")
    })(req, res, next);
}
}


module.exports = Page;