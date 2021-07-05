const keysToIgnore = ["ttlDuration"];

module.exports = function(schema, options) {
  for (var key in options) {
    if (keysToIgnore.includes(key)) continue;

    if (options.hasOwnProperty(key)) {
      schema.set(key, options[key]);
    }
  }
};