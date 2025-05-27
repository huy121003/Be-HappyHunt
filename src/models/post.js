const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const postSchema = new Schema(
  {
    _id: Number,
    category: { type: Number, ref: 'category' },
    categoryParent: { type: Number, ref: 'category', default: null },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    price: { type: Number, required: true, min: 1000 },
    description: { type: String, default: '' },
    images: [
      {
        url: { type: String, required: true },
        index: { type: Number, required: true },
        reasonReject: { type: [String], default: [] },
        _id: false,
      },
    ],

    status: {
      type: String,
      enum: [
        'SELLING',
        'EXPIRED',
        'REJECTED',
        'WAITING',
        'HIDDEN',
        'AI_CHECKING_FAILED',
        'DELETED',
      ],
      default: 'WAITING',
    },
    clickCount: { type: Number, default: 0 },
    attributes: [
      {
        name: { type: String, trim: true },
        value: { type: String, Number, Boolean },
        _id: false,
      },
    ],
    expiredAt: { type: Date, default: null },
    isSold: { type: Boolean, default: false },
    isIndividual: { type: Boolean, default: false },
    address: {
      province: { type: Number, required: true, ref: 'province' },
      district: { type: Number, required: true, ref: 'district' },
      ward: { type: Number, required: true, ref: 'ward' },
      specificAddress: { type: String, required: true, trim: true },
    },
    slug: { type: String, default: '', unique: true, required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
    pushedAt: { type: Date, default: null },
    isNotify: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, postSchema, 'post');
postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
postSchema.index(
  {
    name: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 10,
      description: 5,
    },
  }
);
const Post = model('post', postSchema);
module.exports = Post;
