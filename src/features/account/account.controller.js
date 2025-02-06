const { Role, Account } = require('@models');
const accountService = require('./account.service');

const autoCreateAdmin = async () => {
  const account = await Account.find({});
  if (account.length !== 0) {
    return;
  }
  const role = await Role.findOne({ name: 'Super Admin' });
  if (!role) {
    return;
  }
  try {
    await accountService.autoCreateAdmin(role._id);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  autoCreateAdmin,
};
