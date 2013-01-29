/**
 * Created with JetBrains WebStorm.
 * User: ynonperek
 * Date: 1/28/13
 * Time: 9:49 PM
 * Basic example for using hashedField.js
 */

var mongoose    = require('mongoose');
var hashedField = require('../src/hashedField.js');

mongoose.connect('localhost/test');

var UserSchema = new mongoose.Schema({
  name: String
});

UserSchema.plugin( hashedField );

var User = mongoose.model('User', UserSchema);

var me = new User({name: 'Ynon'});

me.password = 'foo';

me.authenticate( 'foo', function(err, res) {
  // true
  console.log( res );
});

me.authenticate( 'goo', function(err, res) {
  // false
  console.log( res );
});




