const authJwt = require('./authJwt.middleware');
const permissionApi = require('./permissionApi.middleware');
module.exports = {
  authJwt,
  permissionApi,
};
