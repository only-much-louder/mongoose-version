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

  /**
   * For collection strategy only
   * 
   * `extraFields` and `onSave` gives the implementor the power to save
   * fields on the versions based on the custom logic they have on `onSave`
   * and fields set via `extraFields`
   */
  options.extraFields = options.extraFieldsOnVersions || {};
  options.onSave = options.onSave || null; 

  // For collection strategy only
  options.enableTTL = options.enableTTL || false;
  options.TTL_DURATION = options.TTL_DURATION || null;

  if (!strategies[options.strategy]) {
    throw new Error('Strategy ' + options.strategy + ' is unknown');
  }

  if (options.strategies === "collection") {
    if (options.enableTTL) {
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
    if (options.onSave && typeof options.onSave !== "function") {
      throw new Error("onSave is expected to be a function");
    }
  }

  strategies[options.strategy](schema, options);
};
