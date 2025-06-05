const notificationService = require('./notification.service');
const socketHandler = require('../../helpers/socketHandler.helper');

const setupNotificationSocket = (appNamespace, socket) => {
  socket.on('get_notifications', async (data) => {
    const notifications = await notificationService.getAll(data);

    appNamespace
      .to(data.target)
      .emit('notifications', socketHandler.success(notifications));
  });
  socket.on('not_read_notification', async (accountId) => {
    const count = await notificationService.countNotRead(accountId);
    appNamespace
      .to(accountId)
      .emit('not_read_notification', socketHandler.success(count));
  });

  socket.on('read_notification', async (id) => {
    const notification = await notificationService.read(id);
    const count = await notificationService.countNotRead(id);
    appNamespace.to(notification.target).emit(
      'notification_read',
      socketHandler.success({
        _id: id,
        ...notification,
      })
    );
    appNamespace
      .to(notification.target)
      .emit('not_read_notification', socketHandler.success(count));
  });
};

const create = async (appNamespace, socket, data) => {
  try {
    const notification = await notificationService.create(data);
    if (notification && notification.length > 0) {
      for (const noti of notification) {
        appNamespace
          .to(noti?.target?._id)
          .emit('notification_created', socketHandler.success(noti));

        const count = await notificationService.countNotRead(noti?.target?._id);
        appNamespace
          .to(noti?.target?._id)
          .emit('not_read_notification', socketHandler.success(count));
      }
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  create,
  setupNotificationSocket,
};
