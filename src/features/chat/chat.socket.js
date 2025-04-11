const chatService = require('./chat.service');
const messageService = require('../message/message.service');

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
  chatNamespace.emit('status_account', getUserStatus(accountId));

  console.log(`User ${accountId} is ${status}`);
};

const setupChatSocket = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);
    // Handle online status when user connects
    socket.on('online', (accountId) => {
      handleStatusAccount(chatNamespace, accountId, 'online', socket.id);
      socket.join(accountId);
    });

    // Get status of a specific account
    socket.on('get_status_account', (data) => {
      const { accountId, targetAccountId } = data;
      socket.emit('status_account', getUserStatus(targetAccountId));
    });
    // Join a chat room
    socket.on('join_chat', (chat) => {
      socket.join(chat);
      console.log(`User ${socket.id} joined chat: ${chat}`);
    });
    // Leave a chat room
    socket.on('leave_chat', (chat) => {
      socket.leave(chat);
      console.log(`User ${socket.id} left chat: ${chat}`);
    });
    // Fetch chat history
    socket.on('fetch_chat_history', async (data) => {
      try {
        const chatHistory = await chatService.getAllPagination(data);

        socket.emit('chat_history', chatHistory);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    // Fetch chat by slug
    socket.on('fetch_chat_by_slug', async (slug) => {
      try {
        const chat = await chatService.getDetailBySlug(slug);
        socket.emit('chat_by_slug', chat);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    // Create chat
    socket.on('create_chat', async (data) => {
      try {
        const chat = await chatService.create(data);

        socket.emit('chat_created', chat);
      } catch (error) {
        socket.emit('error', { message: error.message });
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
        chatNamespace.to(data.chat).emit('new_message', message);
        chatNamespace.to(chat.seller._id).emit('chat_updated', chat);
        chatNamespace.to(chat.buyer._id).emit('chat_updated', chat);
        chatNamespace.to(chat.seller._id).emit('count_not_read', countSeller);
        chatNamespace.to(chat.buyer._id).emit('count_not_read', countBuyer);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    socket.on('read_message', async (data) => {
      try {
        console.log('data', data);
        const message = await messageService.updateStatus(data);
        if (message.length === 0) return;
        console.log('message read', message);
        const chat = await chatService.update({
          chat: data.chat,
          ...message[0],
        });
        const countSeller = await chatService.countNotRead(chat.seller._id);
        const countBuyer = await chatService.countNotRead(chat.buyer._id);

        chatNamespace.to(data.chat).emit('message_read', message);

        chatNamespace.to(chat.seller._id).emit('chat_read', chat);
        chatNamespace.to(chat.seller._id).emit('count_not_read', countSeller);

        chatNamespace.to(chat.buyer._id).emit('chat_read', chat);
        chatNamespace.to(chat.buyer._id).emit('count_not_read', countBuyer);
        console.log('message', message);
        console.log('chat', chat);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    // Fetch message history
    socket.on('fetch_messages', async (data) => {
      try {
        const messages = await messageService.getAllPagination(data);
        socket.emit('message_history', messages);
      } catch (error) {
        socket.emit('error', { message: error.message });
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
        socket.emit('count_not_read', count);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('last_message', async (data) => {
      const message = await messageService.getLastMessageByChat(data);
      socket.emit('last_message', message);
    });
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
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
