const { Permission, Role, Account, Policy } = require('../../models');
const District = require('../../models/district');
const Province = require('../../models/province');
const Ward = require('../../models/ward');
const policyService = require('../policy/policy.service');
const appService = require('./app.service');
require('dotenv').config();
const API_PROVINCE = process.env.API_PROVINCE;

const createAutoAddress = async () => {
  try {
    const [province, district, ward] = await Promise.all([
      Province.find(),
      District.find(),
      Ward.find(),
    ]);
    if (province.length > 0 || district.length > 0 || ward.length > 0) {
      return;
    }
    const response = await fetch(API_PROVINCE);
    if (!response.ok) {
      throw new Error('Cannot fetch provinces data');
    }
    const provincesData = await response.json();
    const res = appService.createAutoAddress(provincesData);
    return res;
  } catch (error) {
    console.error(error);
  }
};
const autoCreatePermission = async () => {
  try {
    const permissions = await Permission.find({});
    if (permissions.length > 0) return;
    const result = appService.autoCreatePermission();
    return result;
  } catch (error) {
    console.error(error);
  }
};
const autoCreateRole = async () => {
  try {
    const roleCount = await Role.countDocuments();
    if (roleCount > 0) {
      return;
    }
    const permissions = await Permission.find();
    if (permissions.length === 0) {
      return;
    }
    const result = appService.autoCreateRole(permissions);
    return result;
  } catch (error) {
    console.error(error);
  }
};
const autoCreateAdmin = async () => {
  try {
    const admin = await Account.findOne({ role: 1 });
    if (admin) {
      return;
    }
    const role = await Role.findOne({ name: 'Super Admin' });
    if (!role) {
      return;
    }
    const result = appService.autoCreateAdmin(role._id);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const autoCreatePolicy = async () => {
  try {
    const policy = await Policy.find({});
    if (policy.length === 0) {
      await appService.autoCreatePolicy();
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createAutoAddress,
  autoCreatePermission,
  autoCreateRole,
  autoCreateAdmin,
  autoCreatePolicy,
};
