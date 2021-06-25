var debug = require('debug')('mongoose:version');

var cloneSchema = require('../clone-schema');
var setSchemaOptions = require('../set-schema-options');

module.exports = function(schema, options) {
  var versionedSchema = cloneSchema(schema, options.mongoose);
  var mongoose = options.mongoose;
  var ObjectId = mongoose.Schema.Types.ObjectId;
  var refIdType = options.refIdType || ObjectId;

  setSchemaOptions(versionedSchema, options);

  versionedSchema.add({
    refId: refIdType,
    refVersion: Number
  });

  if (Object.keys(options.extraFields).length) {
    versionedSchema.add({
      ...options.extraFields,
    });
  }

  if (options.enableTTL) {
    versionedSchema.add({
      versionCreatedAt: { type: Date, default: Date.now },
    });

    versionedSchema.index(
      { versionCreatedAt: 1 },
      { expireAfterSeconds: options.TTL_DURATION }
    );
  }

  // Add reference to model to original schema
  schema.statics.VersionedModel = mongoose.model(options.collection, versionedSchema, options.dbCollection);

  schema.pre('save', function(next) {
    if (!options.suppressVersionIncrement) {
      this.increment(); // Increment origins version
    }

    var clone = this.toObject();

    delete clone._id
    clone.refVersion = this._doc.__v;   // Saves current document version
    clone.refId = this._id;        // Sets origins document id as a reference

    if (options.enableTTL) {
      clone.versionCreatedAt = Date.now();
    }

    if (options.onSave) {
      clone = { ...options.onSave(this), ...clone };
    }

    new schema.statics.VersionedModel(clone).save(function(err) {
      if (err) {
        debug(err);
      } else {
        debug('Created versioned model in mongodb');
      }

      next();
    });
  });

  schema.pre('remove', function(next) {
    if (!options.removeVersions) {
      return next();
    }

    schema.statics.VersionedModel.remove({ refId: this._id }, function(err) {
      if (err) {
        debug(err);
      } else {
        debug('Removed versioned model from mongodb');
      }

      next();
    });
  });
};
