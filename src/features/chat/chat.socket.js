const chatService = require('./chat.service');

function setupChatSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a chat room
    socket.on('joinChat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User joined chat room: chat_${chatId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, message, image, createdBy } = data;
        const savedMessage = await chatService.saveMessage(chatId, {
          message,
          image,
          createdBy,
        });

        // Emit the message to all users in the chat room
        io.to(`chat_${chatId}`).emit('newMessage', savedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

module.exports = setupChatSocket;
