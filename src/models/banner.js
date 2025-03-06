const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const bannerSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, required: true, trim: true },
    link: { type: String, default: '', required: true, trim: true },
    isShow: { type: Boolean, required: true, default: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, bannerSchema, 'banner');
bannerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Banner = model('banner', bannerSchema);
module.exports = Banner;
