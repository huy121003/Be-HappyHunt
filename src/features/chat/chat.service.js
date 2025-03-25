const Chat = require('../../models/chat');
const Message = require('../../models/message');

/**
 * Save a new message and update the chat's metadata.
 * @param {Number} chatId - The ID of the chat.
 * @param {Object} messageData - The message data (sender, message, image).
 * @returns {Object} - The saved message.
 */
async function saveMessage(chatId, messageData) {
  // Save the message
  const message = await Message.create({
    chat: chatId,
    ...messageData,
    timeSend: new Date(),
    status: 'SENT',
  });

  // Update the chat's last message
  await Chat.findByIdAndUpdate(chatId, {
    updatedBy: messageData.createdBy,
    updatedAt: new Date(),
  });

  return message;
}

/**
 * Get all messages for a specific chat.
 * @param {Number} chatId - The ID of the chat.
 * @returns {Array} - List of messages.
 */
async function getMessages(chatId) {
  return Message.find({ chat: chatId }).sort({ timeSend: 1 }).lean().exec();
}

module.exports = {
  saveMessage,
  getMessages,
};
