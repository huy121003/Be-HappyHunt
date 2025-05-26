const Chat = require('../../models/chat');
const MessageService = require('../message/message.service');
const exportFilter = require('./chat.filter');

const create = async (data) => {
  try {
    const findChat = await Chat.findOne({
      post: data.post,
      seller: data.seller,
      buyer: data.buyer,
    });
    if (findChat) return findChat;
    const chat = await Chat.create({
      ...data,
      slug: `${data.post}${data.seller}${data.buyer}-${new Date().getTime()}`,
      createdBy: data.buyer,
    });
    if (!chat) throw new Error('notfound');
    return chat;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (data) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      data.chat,
      { lastMessage: data },
      { new: true }
    ).exec();

    if (!chat) throw new Error('update');
    const getChat = await getDetailById(data.chat);
    return getChat;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPagination = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  try {
    const [totalDocuments, result] = await Promise.all([
      Chat.countDocuments(filter),
      Chat.find(filter)
        .populate('buyer', 'name avatar slug')
        .populate('seller', 'name avatar slug')
        .populate('post', 'name slug images createdAt ')
        .populate(
          'lastMessage',
          'message image timeSend sender createdAt status'
        )
        .sort(sort)
        .skip(page * size)
        .limit(size)
        .lean()
        .exec(),
    ]);
    if (!result) throw new Error('notfound');
    return {
      documentList: result,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDetailBySlug = async (slug) => {
  try {
    const chat = await Chat.findOne({ slug })
      .populate('lastMessage', 'sender message image timeSend status')
      .populate('buyer', 'name avatar slug isBanned')
      .populate('seller', 'name avatar slug isBanned')
      .populate({
        path: 'post',
        select:
          'name slug images createdAt price status category categoryParent',
        populate: [
          { path: 'category', select: 'messages' },
          { path: 'categoryParent', select: 'messages' },
        ],
      })
      .exec();
    if (!chat) throw new Error('notfound');
    return chat;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDetailById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId)
      .populate('lastMessage', 'sender message image timeSend status')
      .populate('buyer', 'name avatar slug')
      .populate('seller', 'name avatar slug')
      .populate({
        path: 'post',
        select:
          'name slug images createdAt price status category categoryParent',
        populate: [
          { path: 'category', select: 'messages' },
          { path: 'categoryParent', select: 'messages' },
        ],
      })
      .exec();
    if (!chat) throw new Error('notfound');
    return chat;
  } catch (error) {
    throw new Error(error.message);
  }
};
const countNotRead = async (currentUser) => {
  try {
    const chats = await Chat.find({
      $or: [{ seller: currentUser }, { buyer: currentUser }],
    })
      .populate('lastMessage', 'sender status') // Populate lastMessage
      .exec();

    // Lọc các cuộc trò chuyện mà có lastMessage chưa đọc
    const count = chats.filter(
      (chat) =>
        chat.lastMessage.sender !== currentUser &&
        chat.lastMessage.status === 'SENT'
    ).length;

    return count;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  getAllPagination,
  getDetailBySlug,
  update,
  countNotRead,
};
