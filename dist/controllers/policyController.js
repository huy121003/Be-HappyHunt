const policyData = require('../data/policyData');
const Policy = require('../models/policy');
const autoCreatePolicy = async () => {
  try {
    const policy = await Policy.find({});
    if (policy.length === 0) {
      const result = await Policy.insertMany(policyDataData);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  autoCreatePolicy
};