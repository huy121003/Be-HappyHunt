const socketHandler = require('../../helpers/socketHandler.helper');
const setupChatSocket = require('../chat/chat.socket');
const {
  setupNotificationSocket,
} = require('../notification/notification.soket');
const onlineUsers = new Map(); // Store online users only
const socketStore = {
  appNamespace: null,
  socketOn: null,
};
const getUserStatus = (accountId) => {
  const userData = onlineUsers.get(accountId);
  return {
    accountId,
    status: userData ? 'online' : 'offline',
  };
};

const handleStatusAccount = (appNamespace, accountId, socketId) => {
  // Store socketId for online status
  onlineUsers.set(accountId, { socketId });
  // Notify all users about status change
  appNamespace.emit(
    'status_account',
    socketHandler.success(getUserStatus(accountId))
  );
};

const setupAppSocket = (io) => {
  const appNamespace = io.of('/app');
  appNamespace.on('connection', (socket) => {
    socket.on('online', (accountId) => {
      handleStatusAccount(appNamespace, accountId, socket.id);
      socket.join(accountId);
    });
    socket.on('disconnect', () => {
      // Find and remove the disconnected user from onlineUsers
      for (const [accountId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          onlineUsers.delete(accountId);
          break;
        }
      }
    });
    socketStore.appNamespace = appNamespace;
    socketStore.socketOn = socket;
    // Setup chat and notification sockets
    setupChatSocket(appNamespace, socket, getUserStatus);
    setupNotificationSocket(appNamespace, socket);
  });
};

module.exports = {
  setupAppSocket,
  socketStore,
};
