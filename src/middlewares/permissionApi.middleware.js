//Check user permission for API access
const roleService = require('../features/role/role.service');
const permissionUser = (req, res, next) => {
  if (req.userAccess.role) {
    // Có role nghĩa là admin → không được truy cập
    return res.status(403).json({
      message:
        'Access denied. Only users (not admins) can access this resource.',
    });
  }
  next();
};

const permissionAdmin = (codeName, type) => {
  return async (req, res, next) => {
    const role = req.userAccess.role;

    if (!role) {
      return res.status(403).json({
        message: 'Access denied. Admin only.',
      });
    }
    const roleData = await roleService.getById(role._id);
    const permissions = roleData?.permissions || [];
    const hasPermission = permissions.some(
      (permission) =>
        permission?.codeName === codeName && permission?.[type] === true
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: 'Access denied. You do not have the required permission.',
      });
    }

    next();
  };
};
module.exports = {
  permissionUser,
  permissionAdmin,
};
