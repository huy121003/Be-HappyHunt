const {
  callGemini,
  callGeminiDescription,
} = require('../../configs/gemini.config');
const { Category } = require('../../models');
const QaChatbot = require('../../models/qa-chatbot');
const exportFilter = require('./qaChatBot.filter');

const create = async (data) => {
  try {
    const result = await QaChatbot.create(data);
    if (!result) {
      throw new Error('create');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, data) => {
  try {
    const result = await QaChatbot.findByIdAndUpdate(id, data, { new: true });
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await QaChatbot.deleteById(id);
    if (!result) throw new Error('remove');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      QaChatbot.countDocuments(filter),
      QaChatbot.find(filter)
        .populate('createdBy', 'name _id')
        .sort(sort)
        .skip(page * size)
        .limit(size)
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
const getAll = async () => {
  try {
    const result = await QaChatbot.find();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await QaChatbot.findById(id);
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAnswer = async (dataReq) => {
  try {
    const data = await QaChatbot.find();
    if (!data) throw new Error('notfound');
    const answer = await callGemini(
      data.map((item) => {
        return {
          question: item.question,
          answer: item.answer,
        };
      }),
      dataReq.message,
      dataReq.history
    );
    return answer;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDescription = async (data) => {
  try {
    let categoryName;
    if (data.category) {
      const res = await Category.findById(data.category)
        .select('name')
        .populate('parent', 'name');
      categoryName = `${res.name} - ${res.parent.name}`;
    } else {
      const res = await Category.findOne(data.categoryParent).select('name');
      categoryName = res.name;
    }
    const res = await callGeminiDescription({
      name: data.name,
      price: data.price,
      category: categoryName,
      attributes: data.attributes || [],
    });
    if (!res) throw new Error('notfound');
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};
const checkContent = async (text) => {
  try {
    const res = await callGeminiDescription(data);
    if (!res) throw new Error('notfound');
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  update,
  remove,
  getAllPagination,
  getAll,
  getById,
  getAnswer,
  getDescription,
  checkContent,
};
