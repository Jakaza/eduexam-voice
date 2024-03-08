require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const pool = require("./config/connectDB");
// const seedDB = require("./config/seed");
// const passport = require("passport");

async function checkDatabaseConnection() {
    try {
      const client = await pool.connect();
      console.log("Database connected successfully!");
      client.release(); // Release the client back to the pool
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    } finally {
      // Close the pool (optional, depending on your application's needs)
      await pool.end();
    }
  }
  
  // Call the function to check the database connection
  checkDatabaseConnection();


//  middlewares config
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//  setup ESJ engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//  init passport
require("./config/passport");
app.use(passport.initialize());
// routes
app.use(routes);
app.get("/*", (req, res) => res.render("error/404"));
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is up at port ${PORT}`);
});