var strategies = require('./strategies');

module.exports = function(schema, options) {
  if (typeof(options) == 'string') {
    options = {
      collection: options
    }
  }

  options = options || {};
  // accept the existing `collection` option as `model` for clarity
  options.collection = options.model || options.collection || 'versions';
  options.logError = options.logError || false;
  options.strategy = options.strategy || 'array';
  options.maxVersions = options.maxVersions || Number.MAX_VALUE;
  options.suppressVersionIncrement = options.suppressVersionIncrement !== false;
  options.suppressRefIdIndex = options.suppressRefIdIndex !== false;
  options.mongoose = options.mongoose || require('mongoose');
  options.removeVersions = !!options.removeVersions;
  options.ignorePaths = options.ignorePaths || [];

  // Custom Options for extra features
  options.customOpts = options.customOpts || {};
  // TTL
  options.customOpts.ttlDuration = options.customOpts.ttlDuration || null;

  if (!strategies[options.strategy]) {
    throw new Error('Strategy ' + options.strategy + ' is unknown');
  }

  // TTL only for collection strategy
  if (options.customOpts && options.strategies === "collection") {
    if (options.customOpts.ttlDuration) {
      if (!Number.isInteger(options.ttlDuration)) {
        throw new Error("ttlDuration should be a valid number.");
      }
      if (options.customOpts.ttlDuration <= 0) {
        throw new Error("ttlDuration should be a positive value.");
      }
    }
  }

  strategies[options.strategy](schema, options);
};
