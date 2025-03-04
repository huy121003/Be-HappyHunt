const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const bannerSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: [true, 'Name is required'],
      unique: [true, 'Name already exists'],
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: [true, 'Image is required'],
    },
    link: {
      type: String,
      default: '',
      required: [true, 'Link is required'],
      trim: [true, 'Link is required'],
    },
    isShow: {
      type: Boolean,
      required: [true, 'Is show is required'],
      default: true,
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, bannerSchema, 'banner');
bannerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Banner = model('banner', bannerSchema);
module.exports = Banner;
