const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const permissionSchema = new Schema(
  {
    method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
    type: String,
    name: String,
    description: String,
    url: String,
  },
  { timestamps: true }
);
permissionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Permission = model('permission', permissionSchema);
module.exports = Permission;
