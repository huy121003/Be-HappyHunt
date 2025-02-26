const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const categorySchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true, trim: true },
    parent: { type: Number, ref: 'category', default: null },
    attributes: [
      {
        name: { type: String, required: true },
        values: [{ type: String, required: true }],
        _id: false,
      },
    ],
    keywords: [{ type: String, required: true }],
    description: String,
    url: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, categorySchema, 'category');
categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = model('category', categorySchema);

module.exports = Category;
