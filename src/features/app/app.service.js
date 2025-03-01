const ProvinceService = require('../province/province.service');
const DistrictService = require('../district/district.service');
const WardService = require('../ward/ward.service');
const perimissionData = require('../permission/permission.data');
const { Permission, Account, Role, Policy } = require('../../models');

require('dotenv').config();
const bcrypt = require('bcrypt');

const policyData = require('../policy/policy.data');

const createAutoAddress = async (provincesData) => {
  try {
    const provincePromises = provincesData.map(async (province) => {
      const createdProvince = await ProvinceService.create({
        name: province.name,
        codeName: province.codename,
        divisionType: province.division_type,
        phoneCode: province.phone_code,
      });

      const districtPromises = province.districts.map(async (district) => {
        const createdDistrict = await DistrictService.create({
          name: district.name,
          provinceId: createdProvince._id,
          codeName: district.codename,
          divisionType: district.division_type,
          shortCodeName: district.short_codename,
        });

        const wardPromises = district.wards.map((ward) =>
          WardService.create({
            name: ward.name,
            provinceId: createdProvince._id,
            districtId: createdDistrict._id,
            codeName: ward.codename,
            divisionType: ward.division_type,
            shortCodeName: ward.short_codename,
          })
        );

        return Promise.all(wardPromises);
      });

      return Promise.all(districtPromises);
    });

    await Promise.all(provincePromises);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tạo địa chỉ:', error);
    return false;
  }
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
  console.log('permissions', permissions);
  const res = await Role.insertMany([
    {
      _id: 1,
      name: 'Super Admin',
      description: 'Super Admin role',
      permissions: permissions?.map((item) => ({
        name: item.name,
        codeName: item.codeName,
        isDelete: item.isDelete,
        isUpdate: item.isUpdate,
        isCreate: item.isCreate,
        isView: item.isView,
      })),
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
const autoCreatePolicy = async () => {
  const result = await Policy.create(policyData);
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
