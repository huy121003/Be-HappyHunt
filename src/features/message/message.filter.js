const exportFilter = (message) => {
  const res = {
    ...(message.page ? { page: Number(message.page) } : { page: 0 }),
    ...(message.size ? { size: Number(message.size) } : { size: 10 }),
    ...(message.sort ? { sort: message.sort } : { sort: '-createdAt' }),
    ...(message.chat && { chat: Number(message.chat) }),
    ...(message.createdBy && { createdBy: message.createdBy }),
  };
  return res;
};

module.exports = exportFilter;
