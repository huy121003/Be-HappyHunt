const { Notification, Follower, Post } = require('../../models');
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
  const notifications = [];

  try {
    const basicTypes = [
      'POST_WAITING_APPROVE',
      'POST_REJECTED',
      'POST_EXPIRED',
      'POST_DELETED',
      'FOLLOW_ACCOUNT',
      'FIRST_LOGIN',
      'VIP_EXPIRED',
      'VIP_ACTIVE',
    ];

    if (basicTypes.includes(data.type)) {
      const noti = await Notification.create({
        target: data.target,
        ...(data.post && { post: data.post }),
        type: data.type,
        createdBy: data.createdBy,
      });
      const detail = await getDetail(noti);
      if (detail) notifications.push(detail);
    }

    if (data.type === 'NEW_POST') {
      const post = await Post.findById(data.post);
      if (!post?.isNotify) {
        // Thông báo cho chủ bài viết
        const selfNoti = await Notification.create({
          target: data.target,
          post: data.post,
          type: data.type,
          createdBy: data.createdBy,
        });
        const selfDetail = await getDetail(selfNoti);
        if (selfDetail) notifications.push(selfDetail);

        // Thông báo cho người theo dõi (loại trừ chính chủ nếu có)
        const followers = await Follower.find(
          { following: data.target },
          'createdBy'
        ).lean();
        const followerIds = followers
          .map((f) => f.createdBy.toString())
          .filter((id) => id !== data.target.toString());

        for (const id of followerIds) {
          const noti = await Notification.create({
            target: id,
            post: data.post,
            type: data.type,
            createdBy: data.createdBy,
          });
          const detail = await getDetail(noti);
          if (detail) notifications.push(detail);
        }

        await Post.findByIdAndUpdate(data.post, { isNotify: true });
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
