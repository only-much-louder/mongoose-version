var setSchemaOptions = require('../lib/set-schema-options');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var expect = require('chai').expect;

describe('set-schema-options', function() {
  it('should set options for passed schema', function() {
    var testSchema = new Schema({ name: String, date: Date });

    setSchemaOptions(testSchema, { option: true });

    expect(testSchema.get('option')).to.equal(true);
  });

  it('should set do nothing if no option object was passed as argument', function() {
    var testSchema = new Schema({ name: String, date: Date });

    setSchemaOptions(testSchema);
  });

  describe("customOpts", function () {
    it("should not set `ttlDuration` on options, for passed schema", function () {
      var TTL_DURATION = 10000;
      var testSchema = new Schema({ name: String, date: Date });
      var options = { customOpts: { ttlDuration: TTL_DURATION }, option: true };

      setSchemaOptions(testSchema, options);

      expect(testSchema.get("ttlDuration")).to.equal(undefined);
      expect(testSchema.get("option")).to.equal(true);
    });
  });
});