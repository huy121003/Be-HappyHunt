const { Role, Permission } = require('../../models');

const autoCreateRole = async () => {
  try {
    const roleCount = await Role.countDocuments();
    if (roleCount > 0) {
      console.log('Roles already exist');
      return;
    }
    const permissions = await Permission.find({});
    if (permissions.length === 0) {
      console.log('No permissions found');
      return;
    }

    const res = await Role.insertMany([
      {
        _id: 1,
        name: 'Super Admin',
        description: 'Super Admin role',
        permissions: permissions.map((item) => item._id),
      },
      {
        _id: 2,
        name: 'Normal User',
        description: 'Normal User role',
        permissions: [],
      },
    ]);
    if (res) {
      console.log('Roles created successfully');
    }
  } catch (err) {
    console.error('Error creating roles:', err);
  }
};

module.exports = {
  autoCreateRole,
};
