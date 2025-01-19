const Account = require('../models/account');
const Role = require('../models/role');
const {
  autoCreateAdminService
} = require('../services/accountService');
const autoCreateAdmin = async () => {
  const account = await Account.find({});
  if (account.length !== 0) {
    return;
  }
  const role = await Role.findOne({
    name: 'Super Admin'
  });
  if (!role) {
    return;
  }
  try {
    const result = await autoCreateAdminService(role._id);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  autoCreateAdmin
};