require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.POST;
const hostname = process.env.HOST_NAME;
const connection = require("./configs/database");
const filleUpload = require("express-fileupload");
const Account = require("./models/account");

//config file upload
app.use(filleUpload());
//config request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//khai bao cac routes

//connect to database
(async () => {
  try {
    await connection();
    app.listen(port, hostname, () => {
      console.log(`Backend app listening on port http://${hostname}:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
