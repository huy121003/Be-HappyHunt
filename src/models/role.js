const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const roleSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: [true, 'Name is required'],
      unique: [true, 'Role name already exists'],
    },
    permissions: [
      {
        name: {
          type: String,
          required: [true, 'Name is required'],
          trim: [true, 'Name is required'],
        },
        codeName: {
          type: String,
          required: [true, 'Code name is required'],
          trim: [true, 'Code name is required'],
        },
        isView: {
          type: Boolean,
          default: true,
        },
        isCreate: {
          type: Boolean,
          default: true,
        },
        isUpdate: {
          type: Boolean,
          default: true,
        },
        isDelete: {
          type: Boolean,
          default: true,
        },
        _id: false,
      },
    ],
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
