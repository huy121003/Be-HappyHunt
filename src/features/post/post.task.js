const cron = require('node-cron');
const { Post } = require('../../models');
require('dotenv').config();
const dayjs = require('dayjs');
const { socketStore } = require('../app/app.socket');
const {
  create: createNotification,
} = require('../notification/notification.soket');
const postService = require('./post.service');

cron.schedule('*/1 * * * *', async () => {
  try {
    const posts = await Post.find({ status: 'WAITING' });
    if (posts.length === 0) return;

    for (const post of posts) {
      const { newStatus, updatedImages } =
        await postService.processPostImages(post);

      await postService.updateCheckingStatus(post._id, {
        status: newStatus,
        images: updatedImages,
        expriedAt: post.expiredAt,
      });
    }
  } catch (error) {
    console.error('Error checking posts:', error.message);
  }
});
cron.schedule('*/5 * * * *', async () => {
  try {
    const posts = await Post.find({
      status: { $in: ['WAITING', 'WAITING|AI_CHECKING_FAILED', 'REJECTED'] },
    });
    for (const post of posts) {
      if (dayjs().diff(dayjs(post.updatedAt), 'days') > 1) {
        await Post.findByIdAndUpdate(post._id, {
          status: 'DELETED',
        });
      }
    }
  } catch (error) {
    console.error(' Error checking posts:', error);
  }
});
cron.schedule('*/5 * * * *', async () => {
  try {
    const posts = await Post.find({
      status: 'SELLING',
    });
    for (const post of posts) {
      if (dayjs().diff(dayjs(post.expiredAt), 'days') > 0) {
        await Post.findByIdAndUpdate(post._id, {
          status: 'EXPIRED',
        });
        await createNotification(
          socketStore.appNamespace,
          socketStore.socketOn,
          {
            target: post.createdBy,
            post: post._id,
            type: 'POST_EXPIRED',
            createdBy: post.createdBy,
          }
        );
      }
    }
  } catch (error) {
    console.error(' Error checking posts:', error);
  }
});
// Chạy mỗi phút để kiểm tra các bài đã đẩy tin
cron.schedule('* * * * *', async () => {
  try {
    const posts = await Post.find({
      pushedAt: { $ne: null },
      status: 'SELLING',
    });

    for (const post of posts) {
      const hoursDiff = dayjs().diff(dayjs(post.pushedAt), 'hour');

      if (hoursDiff >= 12) {
        await postServicervice.clearPushedAt(post._id);
      }
    }
  } catch (error) {
    console.error('Error checking pushed posts:', error);
  }
});

module.exports = cron;
