const passport = require("passport");
const cookie = require("cookie");
const { ROLES } = require("../constants/");

const Page = {
  register: (req, res) => {
    res.render("auth/register");
  },
  login: (req, res) => {
    res.render("auth/login");
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