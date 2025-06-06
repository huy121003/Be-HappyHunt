const chatService = require('./chat.service');
const messageService = require('../message/message.service');
const socketHandler = require('../../helpers/socketHandler.helper');

const setupChatSocket = (appNamespace, socket, getUserStatus) => {
  // Get status of a specific account
  socket.on('get_status_account', (data) => {
    const { accountId, targetAccountId } = data;
    socket.emit(
      'status_account',
      socketHandler.success(getUserStatus(targetAccountId))
    );
  });
  // Join a chat room with id
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
      appNamespace
        .to(data.chat)
        .emit('new_message', socketHandler.success(message));
      appNamespace
        .to(chat.seller._id)
        .emit('chat_updated', socketHandler.success(chat));
      appNamespace
        .to(chat.buyer._id)
        .emit('chat_updated', socketHandler.success(chat));
      appNamespace
        .to(chat.seller._id)
        .emit('count_not_read', socketHandler.success(countSeller));
      appNamespace
        .to(chat.buyer._id)
        .emit('count_not_read', socketHandler.success(countBuyer));
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

      appNamespace
        .to(data.chat)
        .emit('message_read', socketHandler.success(message));

      appNamespace
        .to(chat.seller._id)
        .emit('chat_read', socketHandler.success(chat));
      appNamespace
        .to(chat.seller._id)
        .emit('count_not_read', socketHandler.success(countSeller));

      appNamespace
        .to(chat.buyer._id)
        .emit('chat_read', socketHandler.success(chat));
      appNamespace
        .to(chat.buyer._id)
        .emit('count_not_read', socketHandler.success(countBuyer));
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
    socket.to(data.chat).emit('user_typing', socketHandler.success(data));
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(data.chat).emit('user_stop_typing', socketHandler.success(data));
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
};

module.exports = setupChatSocket;
