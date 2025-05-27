const { Message } = require('../../models');
const { uploadSingle } = require('../file/file.service');
const exportFilter = require('./message.filter');
const uploadBase64ToCloudinary = require('../../helpers/convertBase64ToBuffer');
const create = async (data) => {
  try {
    let imageUrl = data.image
      ? await uploadSingle({ data: uploadBase64ToCloudinary(data.image) })
      : null;

    const message = await Message.create({
      chat: data.chat,
      sender: data.sender,
      message: data.message,
      image: imageUrl,
      timeSend: new Date(),
      status: 'SENT',
    });

    const populatedMessage = await message.populate(
      'sender',
      'name avatar slug'
    );
    if (!populatedMessage) {
      throw new Error('notfound');
    }
    return populatedMessage;
  } catch (error) {
    throw new Error('Failed to create message');
  }
};

const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, messages] = await Promise.all([
      Message.countDocuments(filter),
      Message.find(filter)
        .populate('sender', 'name avatar slug')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .lean()
        .exec(),
    ]);

    if (!messages) {
      throw new Error('notfound');
    }
    return {
      documentList: messages,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error('Failed to get messages');
  }
};
const updateStatus = async (data) => {
  try {
    const timeRead = new Date();
    const getMessage = await Message.find({
      chat: data.chat,
      sender: data.sender,
      status: 'SENT',
    })
      .populate('sender', 'name avatar slug')
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    if (!getMessage) return [];
    const message = await Message.updateMany(
      { chat: data.chat, sender: data.sender, status: 'SENT' },
      { $set: { status: 'READ', timeRead: timeRead } },
      { new: true }
    ).exec();
    if (!message || message.modifiedCount === 0) return [];
    return getMessage.map((item) => {
      return {
        ...item,
        status: 'READ',
        timeRead: timeRead,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  create,
  getAllPagination,
  updateStatus,
};
