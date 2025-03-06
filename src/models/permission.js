const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const permissionSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true, trim: true, unique: true },
    codeName: { type: String, required: true, trim: true, unique: true },
    isView: { type: Boolean, default: false },
    isCreate: { type: Boolean, default: false },
    isUpdate: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, permissionSchema, 'permission');
permissionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Permission = model('permission', permissionSchema);
module.exports = Permission;
