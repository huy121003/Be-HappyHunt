const Account = require('../models/account');
const { autoCreateAdminService } = require('../services/accountService');

const autoCreateAdmin = async () => {
  const account = await Account.find({});
  if (account.length === 0) {
    await autoCreateAdminService();
  }
};
module.exports = {
  autoCreateAdmin,
};
