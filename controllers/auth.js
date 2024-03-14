const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const dbFunctions = require("../config/dbFunctions");
//const {sendMessage} = require("../utils/nodemailer");
const { STATUS_CODE, ROLES } = require("../constants/");
const { sendMessage } = require("../utils/nodemailer");

const Auth = {
register: async (req, res) => {
  console.log(req.body);
  let { first_name, last_name, email, password_hash, rsa_id, user_role, phone_number, user_address, course_id } = req.body;
  if (!first_name || !last_name || !email || !password_hash || !rsa_id || !user_role , !phone_number , !user_address || !course_id) {
      return res
          .status(STATUS_CODE.Bad_Request)
          .json({ status: false, message: "Fill in all the required fields" });
  }
  try {
      const userExist = await dbFunctions.selectByEmail('users', email);
      if (userExist) {
          return res
              .status(STATUS_CODE.Bad_Request)
              .json({ status: false, message: "Email is already taken" });
      }

      const salt = bcrypt.genSaltSync(10);
      password_hash = bcrypt.hashSync(password_hash, salt);

      const identification_number = generateIdentificationNumber()

      const newUser = {
          identification_number,
          first_name,
          last_name,
          email,
          password_hash,
          rsa_id,
          user_role,
          phone_number,
          user_address,
          registration_date: new Date(),
          course_id,
          created_at: new Date(),
      };
    await dbFunctions.createData('users', newUser);

     const emailStatus = await sendMessage(first_name, last_name, identification_number , email , user_role , 'Registration Confirmation')

     if (emailStatus) {
      console.log("Email sent successfully.");
      res.status(201).json({ status: true, message: "Test created successfully.", emailStatus: true ,          
       user: {
        first_name,
        last_name,
        email,
    },});
    } else {
      console.log("Failed to send email.");
      res.status(500).json({ status: false, message: "Failed to send email.", emailStatus: false });
    }

  } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json({
          status: false,
          message: "Something went wrong, try again...",
          error,
      });
  }
},


login: async (req, res) => {
  console.log(req.body);
  const { identification_number, password } = req.body;
  try {
      const userExist = await dbFunctions.selectWithCondition('users', {"identification_number": identification_number},1);

      console.log(userExist);

      if (!userExist) {
          return res.status(STATUS_CODE.Bad_Request).json({
              status: false,
              message: "Incorrect identification number or password... Enter correct credentials",
          });
      }
      const isMatched = await bcrypt.compare(password, userExist.password_hash);
      if (!isMatched) {
          return res.status(STATUS_CODE.Bad_Request).json({
              status: false,
              message: "Incorrect email or password... Enter correct credentials",
          });
      }
      const payload = {
          id: userExist.user_id,
          email: userExist.email,
      };
      const secretOrPrivateKey = process.env.SECRET_PRIVATE_KEY;
      const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: "1d" });
      res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
              httpOnly: true,
              maxAge: 86400, // Expires in 1 day (1d * 24h * 60m * 60s)
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
          })
      );
      res.status(STATUS_CODE.Success).json({
          status: true,
          message: "User has been successfully logged in.",
      });
  } catch (error) {
      console.error(error);
      res.status(STATUS_CODE.Internal).json({
          status: false,
          message: "Something went wrong, try again...",
          error,
      });
  }
},

  logout: (req, res) => {
    res.clearCookie("token");
    console.log("Logging out the user");
    res.redirect("/");
  },
  resetPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(STATUS_CODE.Bad_Request).json({
        status: false,
        message: "Please provide your email address.",
      });
    }

    try {
      // Check if the user with the provided email exists
      const user = await dbFunctions.selectById('users', email);

      if (!user) {
        return res.status(STATUS_CODE.Not_Found).json({
          status: false,
          message: "User with this email address does not exist.",
        });
      }

      // Generate a unique token for password reset
      const resetToken = generateResetToken();

      // Save the reset token and expiration time in the database
      const resetData = {
        email: user.email,
        resetToken: resetToken,
        resetExpires: Date.now() + 3600000, // Token expires in 1 hour
      };
      await dbFunctions.createData('password_resets', resetData);

      // Send the password reset email with the reset link
      const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
      nodemailer.sendMessage(
        user.username,
        user.email,
        'Password Reset',
        `Click the following link to reset your password: ${resetLink}`
      );

      return res.status(STATUS_CODE.Success).json({
        status: true,
        message: `Password reset link has been sent to ${email}. Check your email.`,
      });
    } catch (error) {
      console.error(error);
      return res.status(STATUS_CODE.Internal).json({
        status: false,
        message: "Something went wrong, try again later.",
        error: error.message,
      });
    }
  },

  createNewPassword: async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(STATUS_CODE.Bad_Request).json({
        status: false,
        message: "Reset token and new password are required.",
      });
    }

    try {
      // Check if there is a matching reset token in the database
      const resetData = await dbFunctions.selectById('password_resets', 'resetToken', resetToken);

      if (!resetData || resetData.resetExpires < Date.now()) {
        return res.status(STATUS_CODE.Bad_Request).json({
          status: false,
          message: "Invalid or expired reset token.",
        });
      }

      // Update the user's password in the database
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      await dbFunctions.updateData('users', resetData.email, { password: hashedPassword });

      // Delete the used reset token from the database
      await dbFunctions.deleteData('password_resets', resetData.id);

      return res.status(STATUS_CODE.Success).json({
        status: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(STATUS_CODE.Internal).json({
        status: false,
        message: "Something went wrong, try again later.",
        error: error.message,
      });
    }
  },
};

function generateResetToken() {
    const token = require('crypto').randomBytes(20).toString('hex');
    return token;
  }

  function generateIdentificationNumber() {
    // Generate a random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
  
    // Append "22" to the random number
    const studentNumber = `22${randomNumber}`;
  
    return studentNumber;
  }

module.exports = Auth;
