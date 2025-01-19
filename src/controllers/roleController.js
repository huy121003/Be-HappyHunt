const Role = require('../models/role');
const Permission = require('../models/permission');
const autoCreateRole = async (req, res) => {
  try {
    const role = await Role.find({});
    if (role.length !== 0) {
      return;
    }
    const permission = await Permission.find({});
    if (permission.length === 0) {
      return;
    }
    const result = await Role.insertMany([
      {
        name: 'Super Admin',
        description: 'Super Admin role',
        permissions: permission.map((item) => item._id),
      },
      {
        name: 'Normal User',
        description: 'Normal User role',
        permissions: [],
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  autoCreateRole,
};
