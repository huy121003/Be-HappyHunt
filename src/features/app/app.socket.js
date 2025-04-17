const socketHandler = require('../../helpers/socketHandler.helper');
const setupChatSocket = require('../chat/chat.socket');
const {
  setupNotificationSocket,
} = require('../notification/notification.soket');
const onlineUsers = new Map();
const formatTime = (date) => {
  return date.toISOString();
};
const socketStore = {
  appNamespace: null,
  socketOn: null,
};
const getUserStatus = (accountId) => {
  const userData = onlineUsers.get(accountId);
  return {
    accountId,
    status: userData ? 'online' : 'offline',
    timestamp: userData ? null : formatTime(new Date()),
  };
};

const handleStatusAccount = (
  appNamespace,
  accountId,
  status,
  socketId = null
) => {
  if (status === 'online') {
    // Store only socketId for online status
    onlineUsers.set(accountId, {
      socketId: socketId,
    });
  } else if (status === 'offline') {
    // Remove user from onlineUsers map
    onlineUsers.delete(accountId);
  }

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
      handleStatusAccount(appNamespace, accountId, 'online', socket.id);
      socket.join(accountId);
    });
    socket.on('disconnect', () => {
      // Find and remove the disconnected user from onlineUsers
      for (const [accountId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          handleStatusAccount(appNamespace, accountId, 'offline');
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
