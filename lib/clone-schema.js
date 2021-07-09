module.exports = function(schema, mongoose, opts) {
  'use strict';

  mongoose = mongoose || require('mongoose');

  var clonedSchema = new mongoose.Schema();

  schema.eachPath(function(key, path) {
    if (key === "_id") {
      return;
    }

    var clonedPath = {};

    clonedPath[key] = path.options;
    delete clonedPath[key].unique;

    if (opts && opts.autoIndex === false) {
      delete clonedPath[key].expires;
      delete clonedPath[key].index;
    }

    clonedSchema.add(clonedPath);
  });

  return clonedSchema;
};