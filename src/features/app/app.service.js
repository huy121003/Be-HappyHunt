const ProvinceService = require('../province/province.service');
const DistrictService = require('../district/district.service');
const WardService = require('../ward/ward.service');
const perimissionData = require('../permission/permission.data');
const { Permission, Account, Role, Policy } = require('../../models');

require('dotenv').config();
const bcrypt = require('bcrypt');

const policyData = require('../policy/policy.data');

const createAutoAddress = async (provincesData) => {
  const provincePromises = provincesData.map(async (province) => {
    const createdProvince = await ProvinceService.create({
      name: province.name,
      codeName: province.codename,
      divisionType: province.division_type,
      phoneCode: province.phone_code,
      createdBy: 1,
      updatedBy: 1,
    });

    const districtPromises = province.districts.map(async (district) => {
      const createdDistrict = await DistrictService.create({
        name: district.name,
        provinceId: createdProvince._id,
        codeName: district.codename,
        divisionType: district.division_type,
        shortCodeName: district.short_codename,
        createdBy: 1,
        updatedBy: 1,
      });

      const wardPromises = district.wards.map((ward) =>
        WardService.create({
          name: ward.name,
          provinceId: createdProvince._id,
          districtId: createdDistrict._id,
          codeName: ward.codename,
          divisionType: ward.division_type,
          shortCodeName: ward.short_codename,
          createdBy: 1,
          updatedBy: 1,
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
    await Permission.create({
      name: permission.name,
      codeName: permission.codeName,
      isDelete: permission.isDelete,
      isUpdate: permission.isUpdate,
      isCreate: permission.isCreate,
      isView: permission.isView,
      createdBy: 1,
      updatedBy: 1,
    });
  }

  return true;
};
const autoCreateRole = async (permissions) => {
  const res = await Role.insertMany([
    {
      _id: 1,
      name: 'Super Admin',
      description: 'Super Admin role',
      createdBy: 1,
      updatedBy: 1,
      permissions: permissions?.map((item) => ({
        ...item,
        isDelete: true,
        isUpdate: true,
        isCreate: true,
        isView: true,
        createdBy: 1,
        updatedBy: 1,
      })),
    },
  ]);

  return true;
};
const autoCreateAdmin = async (roleId) => {
  const bycryptedPassword = await bcrypt.hash('123@123a', 10);

  await Account.create({
    name: 'Super Admin',
    password: bycryptedPassword,
    phoneNumber: '0398601186',
    username: 'super.admin',
    isBanned: true,
    address: {
      provinceId: null,
      districtId: null,
      wardId: null,
      specificAddress: '',
    },
    avatar: '',
    isVip: true,
    role: roleId,
    description: '',
    createdBy: null,
    updatedBy: null,
  });
  return true;
};
const autoCreatePolicy = async () => {
  const result = await Policy.create({
    ...policyData,
    createdBy: 1,
    updatedBy: 1,
  });
  if (!result) throw new Error('Create policy failed');
  return true;
};

module.exports = {
  createAutoAddress,
  autoCreatePermission,
  autoCreateRole,
  autoCreateAdmin,
  autoCreatePolicy,
};
