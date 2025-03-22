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
      trim: [true, 'Name must not contain leading or trailing whitespaces'],
      required: [true, 'Name is required'],
      unique: [true, 'Duplicate name'],
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
    expiredAt: { type: String, default: null },
    isSold: { type: Boolean, default: false },
    isIndividual: { type: Boolean, default: false },
    address: {
      province: { type: Number, required: true, ref: 'province' },
      district: { type: Number, required: true, ref: 'district' },
      ward: { type: Number, required: true, ref: 'ward' },
      specificAddress: { type: String, required: true, trim: true },
    },
    slug: { type: String, default: '', unique: true, reuqired: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },

    reasonHidden: { type: String, default: '' },
    reasonSold: { type: String, default: '' },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, postSchema, 'post');
postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Post = model('post', postSchema);
module.exports = Post;
