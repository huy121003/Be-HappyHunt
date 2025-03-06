const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const categorySchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true, trim: true, unique: true },
    parent: { type: Number, ref: 'category', default: null },
    attributes: [
      {
        name: { type: String, required: true, trim: true },
        values: [{ type: String, required: true, trim: true }],
        _id: false,
      },
    ],
    keywords: [{ type: String, required: true }],
    description: { type: String, default: '' },
    url: { type: String, required: true, unique: true },
    icon: { type: String, required: true, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, categorySchema, 'category');
categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = model('category', categorySchema);

module.exports = Category;
