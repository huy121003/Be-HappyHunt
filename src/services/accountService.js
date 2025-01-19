const Account = require('../models/account');
require('dotenv').config();
const bcrypt = require('bcrypt');
const autoCreateAdminService = async (roleId) => {
  const bycryptedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10);

  await Account.create({
    fullName: process.env.FULLNAME_ADMIN,
    password: bycryptedPassword,
    phoneNumber: process.env.PHONE_ADMIN,
    isBanned: false,
    address: '',
    avatar: '',
    isVip: true,
    role: roleId,
  });
};
module.exports = {
  autoCreateAdminService,
};
