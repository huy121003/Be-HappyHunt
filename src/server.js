require('dotenv').config();
const express = require('express');
const { i18next, i18nextHttpMiddleware } = require('./i18n');
const cors = require('cors');
const app = express();
const port = process.env.POST;
const hostname = process.env.HOST_NAME;
const connection = require('./configs/database');
//const filleUpload = require("express-fileupload");
//config file upload
//app.use(filleUpload());
//config request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', //cho phép tất cả các domain truy cập
    credentials: true, //cho phép gửi cookie
    origin: true, //cho phép gửi cookie
  })
);
//config i18n
app.use(i18nextHttpMiddleware.handle(i18next));
//khai bao cac routes

//connect to database
(async () => {
  try {
    await connection();
    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
