const SampleMessage = require('../../models/sampleMessage');

const create = async (data) => {
  try {
    const count = await SampleMessage.countDocuments({
      createdBy: data.createdBy,
    });
    if (count >= 5) throw new Error('max');
    const sampleMessage = await SampleMessage.create(data);

    if (!sampleMessage) {
      throw new Error('create');
    }
    return sampleMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, data) => {
  try {
    const sampleMessage = await SampleMessage.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!sampleMessage) throw new Error('notfound');
    return sampleMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const sampleMessage = await SampleMessage.deleteById(id);
    if (!sampleMessage) throw new Error('notfound');
    return sampleMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAll = async (data) => {
  try {
    const sampleMessages = await SampleMessage.find(data);
    if (!sampleMessages) throw new Error('notfound');
    return sampleMessages;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const sampleMessage = await SampleMessage.findById(id);
    return sampleMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
};
