const ProvinceService = require('../province/province.service');
const DistrictService = require('../district/district.service');
const WardService = require('../ward/ward.service');
const perimissionData = require('../permission/permission.data');
const { Permission, Account, Role, Policy } = require('../../models');

require('dotenv').config();
const bcrypt = require('bcrypt');

const policyData = require('../policy/policy.data');
const removeDiacritics = require('../../helpers/removeDiacritics');

const createAutoAddress = async (provincesData) => {
  // Xử lý từng tỉnh một cách tuần tự để đảm bảo ID chính xác
  for (const province of provincesData) {
    // Tạo tỉnh
    const createdProvince = await ProvinceService.create({
      name: removeDiacritics(province.name),
      codeName: province.codename,
      divisionType: province.division_type,
      phoneCode: province.phone_code,
      createdBy: 1,
      updatedBy: 1,
    });

    if (!createdProvince?._id) {
      throw new Error(`Failed to create province: ${province.name}`);
    }

    // Xử lý từng huyện trong tỉnh
    for (const district of province.districts) {
      const createdDistrict = await DistrictService.create({
        name: removeDiacritics(district.name),
        province: createdProvince._id,
        codeName: district.codename,
        divisionType: district.division_type,
        shortCodeName: district.short_codename,
        createdBy: 1,
        updatedBy: 1,
      });

      if (!createdDistrict?._id) {
        throw new Error(
          `Failed to create district: ${district.name} in province: ${province.name}`
        );
      }

      // Tạo tất cả phường/xã trong huyện
      const wardPromises = district.wards.map((ward) =>
        WardService.create({
          name: removeDiacritics(ward.name),
          province: createdProvince._id,
          district: createdDistrict._id,
          codeName: ward.codename,
          divisionType: ward.division_type,
          shortCodeName: ward.short_codename,
          createdBy: 1,
          updatedBy: 1,
        }).catch((error) => {
          console.error(`Error creating ward ${ward.name}:`, error);
          throw error;
        })
      );

      await Promise.all(wardPromises);
    }
  }

  console.log('All addresses created successfully');
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
      province: null,
      district: null,
      ward: null,
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
