const { HistorySearch } = require('../../models');
const exportFilter = require('./search.filter');

const create = async (data, found) => {
  try {
    let result = null;
    if (found) {
      result = await HistorySearch.findOneAndUpdate(
        { createdBy: data.createdBy, keyword: data.keyword },
        { $set: { updatedAt: new Date() } },
        { new: true }
      );
    } else {
      result = await HistorySearch.create(data);
    }
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      HistorySearch.countDocuments(filter),
      HistorySearch.find(filter)
        .select('keyword _id ')
        .limit(size)
        .skip(page * size)
        .sort(sort)
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
    console.log(error);
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await HistorySearch.deleteById(id);
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  create,
  getAllPagination,
  remove,
};
