const parseFilterQuery = require('../../helpers/parseFilterQuery');
const { Banner } = require('../../models');
const { uploadSingle } = require('../file/file.service');
require('dotenv').config();
const create = async (banner) => {
  const imageUrl = banner.image ? await uploadSingle(banner.image) : null;
  const result = await Banner.create({
    ...banner,
    image: imageUrl,
  });

  if (!result) throw new Error('Banner creation failed');
  return result;
};
const getAllPagination = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;

  const [totalDocuments, result] = await Promise.all([
    Banner.countDocuments(parseFilterQuery(filter)),
    Banner.find(parseFilterQuery(filter))
      .select('name _id image isShow link ')
      .populate('createdBy', 'name _id')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch  banner failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getAll = async (data) => {
  const result = await Banner.find(parseFilterQuery(data))
    .select('name _id image isShow link')
    .exec();
  if (!result) throw new Error('Fetch banners failed');

  return result;
};
const getById = async (id) => {
  const result = await Banner.findById(id)
    .select('name image link description')
    .exec();

  if (!result) throw new Error('Banner not found');

  return result;
};
const update = async (id, banner) => {
  const imageUrl = banner.image ? await uploadSingle(banner.image) : null;
  const result = await Banner.findByIdAndUpdate(
    id,
    {
      ...banner,
      ...(imageUrl && { image: imageUrl }),
    },
    {
      new: true,
    }
  ).exec();
  if (!result) throw new Error('Update banner failed');

  return result;
};
const remove = async (id) => {
  const result = await Banner.findByIdAndDelete(id).exec();
  if (!result) throw new Error('Delete banner failed');

  return result;
};
const show = async (id, isShow) => {
  const result = await Banner.findByIdAndUpdate(
    id,
    { isShow },
    { new: true }
  ).exec();
  if (!result) throw new Error('Show banner failed');

  return result;
};
module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  show,
  getAllPagination,
};
