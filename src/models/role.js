const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const roleSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    permissions: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        codeName: {
          type: String,
          required: true,
          trim: true,
        },
        isView: { type: Boolean, default: true },
        isCreate: { type: Boolean, default: true },
        isUpdate: { type: Boolean, default: true },
        isDelete: { type: Boolean, default: true },
        _id: false,
      },
    ],
    version: { type: Number, default: 1 },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, roleSchema, 'role');
roleSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Role = model('role', roleSchema);
module.exports = Role;
