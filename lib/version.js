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

  // For collection strategy only
  options.enableTTL = options.enableTTL || false;
  options.TTL_DURATION = options.TTL_DURATION || null;

  if (!strategies[options.strategy]) {
    throw new Error('Strategy ' + options.strategy + ' is unknown');
  }

  if (options.strategies === "collection" && options.enableTTL) {
    if (!options.TTL_DURATION) {
      throw new Error("TTL_DURATION is required to set TTL.");
    }
    if (!Number.isInteger(options.TTL_DURATION)) {
      throw new Error("TTL_DURATION should be a valid number.");
    }
    if (options.TTL_DURATION <= 0) {
      throw new Error("TTL_DURATION should be a positive value.");
    }
  }

  strategies[options.strategy](schema, options);
};
