var mongoose  = require('mongoose');
var plugin    = require('..');
var assert    = require('assert');

var Schema, Model;

/**
 * Creates a new model with options
 * @param   {Object} options
 * @param   {Object} [options.definition]   The schema definition
 * @param   {Object} [options.settings]     The plugin settings
 * @param   {Object} [options.create]       Whether an instance of the model should be instanciated
 * @returns {Model}
 */
function createModel(options) {
	options = options || {};

	Schema = new mongoose.Schema(options.definition || {
		name: String
	});

	Schema.plugin(plugin, options.settings);

	Model = mongoose.model('User', Schema);

	if (options.create !== false) {
		return new Model();
	}

}

describe('plugin', function() {

	beforeEach(function(done) {
		mongoose.connect('localhost/test');
		done();
	});

	afterEach(function(done) {

		if (Model) {
			Model.remove({}, function(err) {
				if (err) console.log(err);
				mongoose.models = {};
				mongoose.modelSchemas = {};
				mongoose.disconnect(done);
			});
		} else {
			mongoose.models = {};
			mongoose.modelSchemas = {};
			mongoose.disconnect(done);
		}


	});

	it('should add a hashed property', function() {

		var user = new createModel();

		user.password = 'password';

		assert.equal(typeof(user.password), 'undefined');
		assert.notEqual(user.password_hashed, '');
		assert.notEqual(user.password_hashed, 'password');

	});

	it('should match the hashed property when I use a correct password', function(done) {

		var user = new createModel();

		user.password = 'password';

		user.authenticate('password', function(err, match) {
			assert.equal(err, undefined);
			assert(match);
			done();
		});

	});

	it('should not match the hashed property when I use an incorrect password', function(done) {

		var user = new createModel();

		user.password = 'password';

		user.authenticate('foobar', function(err, match) {
			assert.equal(err, undefined);
			assert(!match);
			done();
		});

	});

	it('should use a different hashed property when I configure it to', function() {

		var user = createModel({
			settings: {field: 'foobar'}
		});

		user.foobar = 'foo';
		assert.equal(typeof(user.foobar), 'undefined');
		assert.notEqual(user.foobar_hashed, '');
		assert.notEqual(user.foobar_hashed, 'foo');
	});


	it('should use a different match method when I configure it to', function() {

		var user = createModel({
			settings: {authMethod: 'checkPassword'}
		});

		assert.equal(typeof(user.authenticate), 'undefined');
		assert.equal(typeof(user.checkPassword), 'function');
	});

});