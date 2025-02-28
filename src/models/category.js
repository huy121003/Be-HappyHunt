const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const categorySchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: [true, 'Name is required'],
      unique: [true, 'Category name already exists'],
    },
    parent: { type: Number, ref: 'category', default: null },
    attributes: [
      {
        name: {
          type: String,
          required: [true, 'Attribute name is required'],
          trim: [true, 'Attribute name is required'],
        },

        values: [
          {
            type: String,
            required: [true, 'Attribute value is required'],
            trim: [true, 'Attribute value is required'],
          },
        ],

        _id: false,
      },
    ],
    keywords: [{ type: String, required: [true, 'Keywords is required'] }],
    description: { type: String, default: '' },
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: [true, 'Category URL already exists'],
    },
    icon: { type: String, required: [true, 'Icon is required'], default: '' },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, categorySchema, 'category');
categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = model('category', categorySchema);

module.exports = Category;
