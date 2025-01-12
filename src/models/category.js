const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: String,
    acttributes: [
      {
        name: String,
        values: [String],
        unit: String,
      },
    ],
    description: String,
    url: String,
  },
  { timestamps: true }
);

categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Category = model('category', categorySchema);
module.exports = Category;
