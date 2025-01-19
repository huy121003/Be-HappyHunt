const perimissionData = require('../data/permissionData');
const Permission = require('../models/permission');
const autoCreatePermissionMany = async () => {
  try {
    const permission = await Permission.find({});
    if (permission.length === 0) {
      const result = await Permission.insertMany(perimissionData);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  autoCreatePermissionMany
};