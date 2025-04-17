const exportFilter = (notification) => {
  const res = {
    ...(notification.page ? { page: Number(notification.page) } : { page: 0 }),
    ...(notification.size ? { size: Number(notification.size) } : { size: 10 }),
    ...(notification.sort
      ? { sort: notification.sort }
      : { sort: '-createdAt' }),
    ...(notification.target && { target: notification.target }),

    ...(notification.createdBy && { createdBy: notification.createdBy }),
    ...(notification.updatedBy && { updatedBy: notification.updatedBy }),
  };
  return res;
};
module.exports = exportFilter;
