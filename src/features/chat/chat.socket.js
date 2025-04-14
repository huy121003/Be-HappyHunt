const chatService = require('./chat.service');
const messageService = require('../message/message.service');
const socketHandler = require('../../helpers/socketHandler.helper');
// Map to store online users
const onlineUsers = new Map();

const formatTime = (date) => {
  return date.toISOString();
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
  chatNamespace,
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
  chatNamespace.emit('status_account', socketHandler.success(getUserStatus(accountId)));


};

const setupChatSocket = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {

    // Handle online status when user connects
    socket.on('online', (accountId) => {
      handleStatusAccount(chatNamespace, accountId, 'online', socket.id);
      socket.join(accountId);
    });

    // Get status of a specific account
    socket.on('get_status_account', (data) => {
      const { accountId, targetAccountId } = data;
      socket.emit('status_account', socketHandler.success(getUserStatus(targetAccountId)  ));
    });
    // Join a chat room
    socket.on('join_chat', (chat) => {
      socket.join(chat);
    
    });
    // Leave a chat room
    socket.on('leave_chat', (chat) => {
      socket.leave(chat);
    
    });
    // Fetch chat history
    socket.on('fetch_chat_history', async (data) => {
      try {
        const chatHistory = await chatService.getAllPagination(data);

        socket.emit('chat_history', socketHandler.success(chatHistory));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });
    // Fetch chat by slug
    socket.on('fetch_chat_by_slug', async (slug) => {
      try {
        const chat = await chatService.getDetailBySlug(slug);
        socket.emit('chat_by_slug', socketHandler.success(chat));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });
    // Create chat
    socket.on('create_chat', async (data) => {
      try {
        const chat = await chatService.create(data);

        socket.emit('chat_created', socketHandler.success(chat));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });
    // Send a message
    socket.on('send_message', async (data) => {
      try {
        // Create new message
        const message = await messageService.create(data);
        const chat = await chatService.update({
          chat: data.chat,
          ...message,
        });
        const countSeller = await chatService.countNotRead(chat.seller._id);
        const countBuyer = await chatService.countNotRead(chat.buyer._id);
        chatNamespace.to(data.chat).emit('new_message', socketHandler.success(message));
        chatNamespace.to(chat.seller._id).emit('chat_updated', socketHandler.success(chat));
        chatNamespace.to(chat.buyer._id).emit('chat_updated', socketHandler.success(chat));
        chatNamespace.to(chat.seller._id).emit('count_not_read', socketHandler.success(countSeller));
        chatNamespace.to(chat.buyer._id).emit('count_not_read', socketHandler.success(countBuyer));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });
    socket.on('read_message', async (data) => {
      try {
   
        const message = await messageService.updateStatus(data);
        if (message.length === 0) return;

        const chat = await chatService.update({
          chat: data.chat,
          ...message[0],
        });
        const countSeller = await chatService.countNotRead(chat.seller._id);
        const countBuyer = await chatService.countNotRead(chat.buyer._id);

        chatNamespace.to(data.chat).emit('message_read', socketHandler.success(message));

        chatNamespace.to(chat.seller._id).emit('chat_read', socketHandler.success(chat));
        chatNamespace.to(chat.seller._id).emit('count_not_read', socketHandler.success(countSeller));

        chatNamespace.to(chat.buyer._id).emit('chat_read', socketHandler.success(chat));
        chatNamespace.to(chat.buyer._id).emit('count_not_read', socketHandler.success(countBuyer));

      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });
    // Fetch message history
    socket.on('fetch_messages', async (data) => {
      try {
        const messages = await messageService.getAllPagination(data);
        socket.emit('message_history', socketHandler.success(messages));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });

    // Handle typing status
    socket.on('typing', (data) => {
      socket.to(data.chat).emit('user_typing', data);
    });

    // Handle stop typing
    socket.on('stop_typing', (data) => {
      socket.to(data.chat).emit('user_stop_typing', data);
    });
    // Count not read
    socket.on('count_not_read', async (data) => {
      try {
        const count = await chatService.countNotRead(data);
        socket.emit('count_not_read', socketHandler.success(count));
      } catch (error) {
        socket.emit('error', socketHandler.error(error.message));
      }
    });

    socket.on('last_message', async (data) => {
      const message = await messageService.getLastMessageByChat(data);
      socket.emit('last_message', socketHandler.success(message));
    });
    // Handle disconnect
    socket.on('disconnect', () => {
   
      // Find and remove the disconnected user from onlineUsers
      for (const [accountId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          handleStatusAccount(chatNamespace, accountId, 'offline');
          break;
        }
      }
    });
  });
};

module.exports = setupChatSocket;
