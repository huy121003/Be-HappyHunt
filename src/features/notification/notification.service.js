const { Notification, Follower } = require('../../models');
const exportFilter = require('./notification.filter');

const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('target', 'name avatar slug')
        .populate('post', 'name slug images createdAt ')
        .populate('createdBy', 'name avatar slug')
        .populate('updatedBy', 'name avatar slug')
        .sort(sort)
        .skip(page * size)
        .limit(size),
      Notification.countDocuments(filter),
    ]);
    return {
      documentList: notifications,
      totalDocuments: total,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDetail = async (data) => {
  const notification = await Notification.findOne({
    target: data.target,
    post: data.post,
    type: data.type,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
  })
    .populate('target', '_id name avatar slug')
    .populate('post', '_id name slug images createdAt ')
    .populate('createdBy', '_id name avatar slug')
    .exec();
  return notification;
};
const create = async (data) => {
  let notifications = [];
  try {
    if (
      data.type === 'POST_WAITING_APPROVE' ||
      data.type === 'POST_REJECTED' ||
      data.type === 'POST_EXPIRED' ||
      data.type === 'POST_DELETED' ||
      data.type === 'FOLLOW_ACCOUNT' ||
      data.type === 'FIRST_LOGIN' ||
      data.type === 'VIP_EXPIRED' ||
      data.type === 'VIP_ACTIVE'
    ) {
      const notification = await Notification.create({
        target: data.target,
        ...(data.post && { post: data.post }),
        type: data.type,
        createdBy: data.createdBy,
      });
      const getNotification = await getDetail(notification);
      if (getNotification) notifications.push(getNotification);
    } else if (data.type === 'NEW_POST') {
      const followId = await Follower.find({ following: data.target })
        .lean()
        .exec();

      if (followId.length > 0) {
        for (const follow of [
          ...followId.map((item) => item.createdBy),
          data.target,
        ]) {
          const notification = await Notification.create({
            target: follow,
            post: data.post,
            type: data.type,
            createdBy: data.createdBy,
          });
          const getNotification = await getDetail(notification);
          if (getNotification) notifications.push(getNotification);
        }
      }
    }
    return notifications;
  } catch (error) {
    throw new Error(error.message);
  }
};
const countNotRead = async (accountId) => {
  const count = await Notification.countDocuments({
    target: accountId,
    read: false,
  });
  return count;
};
const read = async (id) => {
  const notification = await Notification.findByIdAndUpdate(id, {
    read: true,
  });
  return notification;
};
module.exports = { getAll, create, countNotRead, read };
