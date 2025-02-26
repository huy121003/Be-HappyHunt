const ProvinceService = require('../province/province.service');
const DistrictService = require('../district/district.service');
const WardService = require('../ward/ward.service');
const perimissionData = require('../permission/permission.data');
const { Permission, Account, Role } = require('../../models');
require('dotenv').config();
const bcrypt = require('bcrypt');

const createAutoAddress = async (provincesData) => {
  const provincePromises = provincesData?.map(async (province) => {
    await ProvinceService.create({
      name: province.name,
      _id: province.code,
      codeName: province.codename,
    });

    const districtPromises = province.districts.map(async (district) => {
      await DistrictService.create({
        name: district.name,
        _id: district.code,
        provinceId: province.code,
        codeName: district.codename,
      });

      const wardPromises = district.wards.map((ward) =>
        WardService.create({
          name: ward.name,
          _id: ward.code,
          provinceId: province.code,
          districtId: district.code,
          codeName: ward.codename,
        })
      );

      return Promise.all(wardPromises);
    });

    return Promise.all(districtPromises);
  });

  await Promise.all(provincePromises);

  return true;
};
const autoCreatePermission = async () => {
  for (const permission of perimissionData) {
    await Permission.create(permission);
    console.log('Inserted permission:', permission);
  }
  if (perimissionData.length > 0) {
    console.log('All permissions inserted successfully');
  }
  return true;
};
const autoCreateRole = async (permissions) => {
  const res = await Role.insertMany([
    {
      _id: 1,
      name: 'Super Admin',
      description: 'Super Admin role',
      permissions: permissions?.map((item) => item._id),
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
  return true;
};
const autoCreateAdmin = async (roleId) => {
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
  return true;
};

module.exports = {
  createAutoAddress,
  autoCreatePermission,
  autoCreateRole,
  autoCreateAdmin,
};
