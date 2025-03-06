const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const applyAutoIncrement = require('../configs/autoIncrement');
const { Schema, model } = mongoose;

const favoritePostSchema = new Schema(
  {
    _id: Number,
    account: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, favoritePostSchema, 'favoritePost');
favoritePostSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const FavoritePost = model('favoritePost', favoritePostSchema);
module.exports = FavoritePost;
