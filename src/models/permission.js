const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const permissionSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: [true, 'Name is required'],
      unique: [true, 'Permission name already exists'],
    },
    codeName: {
      type: String,
      required: [true, 'Code name is required'],
      trim: [true, 'Code name is required'],
      unique: [true, 'Code name already exists'],
    },
    isView: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, permissionSchema, 'permission');
permissionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Permission = model('permission', permissionSchema);
module.exports = Permission;
