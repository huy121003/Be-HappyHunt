const socketHandler = require('../../helpers/socketHandler.helper');
const setupChatSocket = require('../chat/chat.socket');
const {
  setupNotificationSocket,
} = require('../notification/notification.soket');
const onlineUsers = new Map();
const offlineTimes = new Map(); // New map to store offline times
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
    timestamp: userData
      ? null
      : offlineTimes.get(accountId) || formatTime(new Date()),
  };
};

const handleStatusAccount = (
  appNamespace,
  accountId,
  status,
  socketId = null
) => {
  if (status === 'online') {
    // Store socketId for online status and clear offline time
    onlineUsers.set(accountId, {
      socketId: socketId,
    });
    offlineTimes.delete(accountId);
  } else if (status === 'offline') {
    // Store offline time
    const offlineTime = formatTime(new Date());
    offlineTimes.set(accountId, offlineTime);
    // Remove user from online users
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
