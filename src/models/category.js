const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    nameVn: String,
    nameEn: String,

    attributes: [
      {
        nameVn: { type: String, required: true },
        nameEn: { type: String, required: true },
        values: [{ type: String, required: true }], // Mảng string
        _id: false,
      },
    ],
    description: String,
    url: String,
    icon: String,
  },
  { timestamps: true }
);

categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Category = model('category', categorySchema);
module.exports = Category;
