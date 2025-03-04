const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const postSchema = new Schema(
  {
    _id: Number,
    category: {
      type: Number,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    categoryParent: {
      type: Number,
      ref: 'categoryChild',
      default: null,
    },
    seller: {
      type: Number,
      ref: 'account',
      required: [true, 'Seller is required'],
    },
    buyer: {
      type: Number,
      ref: 'account',
      default: null,
    },
    name: {
      type: String,
      trim: [true, 'Name should not have leading or trailing whitespaces'],
      required: [true, 'Name is required'],
      unique: [true, 'Name already exists'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    description: { type: String, default: '' },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['SELLING', 'SOLD', 'REJECTED', 'WAITING'],
      default: 'WAITING',
    },
    clickCount: { type: Number, default: 0 },
    attribute: [
      {
        name: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    url: {
      type: String,
      trim: [true, 'Url should not have leading or trailing whitespaces'],
      required: [true, 'Url is required'],
      unique: [true, 'Url already exists'],
    },
    address: {
      province: {
        type: Number,
        required: [true, 'Province is required'],
      },
      district: {
        type: Number,
        required: [true, 'District is required'],
      },
      ward: { type: Number, required: [true, 'Ward is required'] },
      specificAddress: {
        type: String,
        required: [true, 'Specific address is required'],
        trim: [
          true,
          'Specific address should not have leading or trailing whitespaces',
        ],
      },
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
