var cloneSchema = require('../lib/clone-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var expect = require('chai').expect;

var selectPaths = function(schema) {
  var paths = [];
  schema.eachPath(function(key, path) {
    paths.push(path);
  });

  return paths;
};

describe('clone-schema', function() {
  it('should clone schema', function() {
    var testSchema = new Schema({ name: String, date: Date });

    var cloned = cloneSchema(testSchema);

    expect(cloned).to.exist;
  });

  it('should clone all schema path', function() {
    var testSchema = new Schema({ name: String, date: Date });
    var cloned = cloneSchema(testSchema);

    var paths = selectPaths(cloned);
    expect(paths.length).to.equal(3); // 2 fields plus _id
  });

  it('should clone all schema path with correct data types', function() {
    var testSchema = new Schema({ name: String, date: Date });
    var cloned = cloneSchema(testSchema);

    var namePath = cloned.path('name');
    expect(namePath.options.type).to.equal(String);

    var datePath = cloned.path('date');
    expect(datePath.options.type).to.equal(Date);
  });

  it('should clone all schema path with required validators', function() {
    var testSchema = new Schema({
      name: { type: String, required: true },
      date: { type: Date, required: true }
    });

    var cloned = cloneSchema(testSchema);

    var namePath = cloned.path('name');

    expect(namePath.options.required).to.equal(true);
    expect(namePath.validators.length).to.equal(1);

    var datePath = cloned.path('date');
    expect(datePath.options.required).to.equal(true);
    expect(datePath.validators.length).to.equal(1);
  });

  it('should clone all schema path with custom validators', function() {
    function validator(val) {
      return val;
    }

    var testSchema = new Schema({
      name: { type: String, validate: validator },
      date: { type: Date, validate: validator }
    });

    var cloned = cloneSchema(testSchema);

    var namePath = cloned.path('name');

    expect(namePath.options.validate).to.equal(validator);
    expect(namePath.validators.length).to.equal(1);

    var datePath = cloned.path('date');
    expect(datePath.options.validate).to.equal(validator);
    expect(datePath.validators.length).to.equal(1);
  });

  it('should clone all schema path without indexes when authIndex is set to false', function() {
    var TTL_DURATION = 1000;
    var testSchema = new Schema({
      name: { type: String, index: true },
      date: { type: Date, expires: TTL_DURATION }
    });
    var options = {
      autoIndex: false
    };

    var cloned = cloneSchema(testSchema, null, options);

    var namePath = cloned.path('name');
    expect(namePath.options.index).to.equal(undefined);
    expect(namePath._index).to.equal(null);

    var datePath = cloned.path('date');
    expect(datePath.options.expires).to.equal(undefined);
    expect(datePath._index).to.equal(null);
  });

  it('should clone all schema path with indexes when authIndex is set to true', function() {
    var TTL_DURATION = 1000;
    var testSchema = new Schema({
      name: { type: String, index: true },
      date: { type: Date, expires: TTL_DURATION }
    });
    var options = {
      autoIndex: true
    };

    var cloned = cloneSchema(testSchema, null, options);

    var namePath = cloned.path('name');
    expect(namePath.options.index).to.equal(true);
    expect(namePath._index).to.equal(true);

    var datePath = cloned.path('date');
    expect(datePath.options.expires).to.equal(TTL_DURATION);
    expect(datePath._index.expireAfterSeconds).to.equal(TTL_DURATION);
  });
});