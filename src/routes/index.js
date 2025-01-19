const express = require('express');
const authRouter = require('./authRouter');
const otpRouter = require('./otpRouter');
const fileRouter = require('./fileRouter');
const categoryRouter = require('./categoryRouter');
const app = express();

app.use('/auth/', authRouter);
app.use('/otp/', otpRouter);
app.use('/file/', fileRouter);
app.use('/category/', categoryRouter);

module.exports = app;
