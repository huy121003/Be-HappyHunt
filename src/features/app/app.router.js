const authRouter = require('../auth/auth.router');
const categoryRouter = require('../category/category.router');
const otpRouter = require('../otp/otp.router');
const fileRouter = require('../file/file.router');
const policyRouter = require('../policy/policy.router');
const permissionRouter = require('../permission/permission.router');
const provinceRouter = require('../province/province.router');
const districtRouter = require('../district/district.router');
const wardRouter = require('../ward/ward.router');
const roleRouter = require('../role/role.router');
const bannerRouter = require('../banner/banner.router');
const adminRouter = require('../admin/admin.router');
const userRouter = require('../user/user.router');

const express = require('express');
const app = express();

app.use('/auth/', authRouter);
app.use('/category/', categoryRouter);
app.use('/otp/', otpRouter);
app.use('/file/', fileRouter);
app.use('/policy/', policyRouter);
app.use('/permission/', permissionRouter);
app.use('/province/', provinceRouter);
app.use('/district/', districtRouter);
app.use('/ward/', wardRouter);
app.use('/role/', roleRouter);
app.use('/banner/', bannerRouter);
app.use('/admin/', adminRouter);
app.use('/user/', userRouter);

module.exports = app;
