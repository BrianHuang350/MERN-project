const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const apiUserRoute = require("./routes").apiUser;
const courseRoute = require("./routes").course;
const authGoogleRoute = require("./routes").authGoogle;
const passport = require("passport");
// require("./config/passport")(passport);
require("./config/passport");
const cors = require("cors");
const { apiUser } = require("./routes");

// 連結MongoDB
mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", apiUserRoute);
app.use("/auth/google", authGoogleRoute);
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080...");
});
