const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const permissionSchema = new Schema(
  {
    _id: Number,
    method: { type: String, enum: ['GET', 'POST', 'PATCH', 'DELETE'] },
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, permissionSchema, 'permission');
permissionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Permission = model('permission', permissionSchema);
module.exports = Permission;
