const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const roleSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true, trim: true },
    permissions: [{ type: Number, ref: 'permission', default: [] }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, roleSchema, 'role');
roleSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Role = model('role', roleSchema);
module.exports = Role;
