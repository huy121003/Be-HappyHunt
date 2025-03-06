const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const postSchema = new Schema(
  {
    _id: Number,
    category: { type: Number, ref: 'category', required: true },
    categoryParent: { type: Number, ref: 'category', default: null },
    seller: { type: Number, ref: 'account', required: true },
    buyer: { type: Number, ref: 'account', default: null },
    name: { type: String, trim: true, required: true, unique: true },
    price: { type: Number, required: true, min: 1000 },
    description: { type: String, default: '' },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['SELLING', 'SOLD', 'REJECTED', 'WAITING', 'HIDDEN'],
      default: 'WAITING',
    },
    clickCount: { type: Number, default: 0 },
    attribute: [
      {
        name: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    url: { type: String, trim: true, required: true, unique: true },
    address: {
      province: { type: Number, required: true },
      district: { type: Number, required: true },
      ward: { type: Number, required: true },
      specificAddress: { type: String, required: true, trim: true },
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, postSchema, 'post');
postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Post = model('post', postSchema);
module.exports = Post;
