const passport = require("passport");
const cookie = require("cookie");
const { ROLES } = require("../constants/");
const dbFunctions = require('../config/dbFunctions');

const Page = {
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
    homePage: (req, res, next) => {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
          if (err) {
            return res.status(500).render("error/server");
          }
          if (!user) {
            return res.render("index", { isAuthenticated: false });
          }
          if (user.roles == ROLES.Admin) {
            res.render("admin/main",{
              isAuthenticated: req.isAuthenticated,
              user: user,
            });
          }
          else if(user.roles == ROLES.Lecturer){

            // Select Course And Modules









            res.render("lecturer/main", {
              isAuthenticated: req.isAuthenticated,
              user: user,
            });
          }
          return res.render("student/main", {
            isAuthenticated: req.isAuthenticated,
            user: user,
          });
        })(req, res, next);
      }
}


module.exports = Page;