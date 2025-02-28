const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const permissionSchema = new Schema(
  {
    _id: Number,
    method: { type: String, enum: ['GET', 'POST', 'PATCH', 'DELETE'] },
    type: {
      type: String,
      required: [true, 'Permission type is required'],
      trim: [
        true,
        'Permission type must not have leading or trailing whitespace',
      ],
    },
    name: {
      type: String,
      required: [true, 'Permission name is'],
      trim: [
        true,
        'Permission name must not have leading or trailing whitespace',
      ],
      unique: [true, 'Permission name already exists'],
    },
    description: { type: String, default: '' },
    url: {
      type: String,
      required: [true, 'Permission URL is required'],
      unique: [true, 'Permission URL already exists'],
      trim: [
        true,
        'Permission URL must not have leading or trailing whitespace',
      ],
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, permissionSchema, 'permission');
permissionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Permission = model('permission', permissionSchema);
module.exports = Permission;
