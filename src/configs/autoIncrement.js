const AutoIncrement = require('mongoose-sequence');

module.exports = function applyAutoIncrement(mongoose, schema, modelName) {
  if (!schema.pluginsApplied) {
    schema.plugin(AutoIncrement(mongoose), { inc_field: '_id', id: modelName });
    schema.pluginsApplied = true; // Đánh dấu schema này đã có AutoIncrement
  }
};
