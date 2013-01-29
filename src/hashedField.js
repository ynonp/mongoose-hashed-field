/**
 * Created with JetBrains WebStorm.
 * User: ynonperek
 * Date: 1/28/13
 * Time: 9:14 PM
 *
 * Mongoose plugin that adds a hashed password field
 */

var bcrypt = require('bcrypt');

module.exports = exports = function hashedFieldPlugin( schema, options ) {
  options = options || {};

  var field_name         = options.field       || 'password';
  var auth_method        = options.authMethod  || 'authenticate';
  var hashed_field_name  = options.hashed_name || field_name + '_hashed';
  var salt               = options.salt        || 8;
  var setter_method_name = options.setter;


  var password_setter_function = function( value, callback ) {
    var self = this;
    bcrypt.hash( value, salt, function(err, hash) {
      if ( err ) { return callback.apply(null, err); }
      self[hashed_field_name] = hash;
      callback.apply(null);
    });
  };

  var virtual_setter_functionSYNC = function(value) {
    var hash = bcrypt.hashSync( value, salt );
    this[hashed_field_name] = hash;
  };

  var auth_function = function( password, callback ) {
    bcrypt.compare(password, this[hashed_field_name], callback );
  };


  if ( setter_method_name ) {
    schema.methods[setter_method_name] = password_setter_function;
  } else if ( field_name ) {
    // use virtual field
    schema.virtual( field_name ).set( virtual_setter_functionSYNC );
  }

  schema.methods[auth_method] = auth_function;

  var hashed_password_field = {};
  hashed_password_field[hashed_field_name] = String;
  schema.add( hashed_password_field );

};