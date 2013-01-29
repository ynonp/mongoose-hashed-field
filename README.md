mongoose-hashed-field
=====================

This plugin let you add a `hashed` field to your schema. It automatically creates an async setter method for you,
as well as a setter virtual property.

Whenever you assign a value to the hashed field, it'll be hashed using bcrypt.

Plugin is intended to simplify the process of saving hashed passwords in the database.

## Schema Example

Take this schema as example:

```javascript
var mongoose    = require('mongoose');
var hashedField = require('../src/hashedField.js');

var UserSchema = new mongoose.Schema({
  name: String
});

UserSchema.plugin( hashedField );

var User = mongoose.model('User', UserSchema);

var me = new User({name: 'John'});

// Save the hashed value of secret in a new field named password_hashed
// password is not saved in DB, only password_hashed
me.password = 'secret';

```

Later you can authenticate a password using an auto generated authenticate method:

```javascript
me.authenticate( 'guess', function(err, result) {
  // true if guess matches hashed password
  console.log( result );
});

```


## Plugin Options

You can pass the following options to Schema#plugin when creating the hashedField plugin:

1. `field`: a virtual setter name (defaults to password)
2. `authMethod`: the name for the authentication method (defaults to authenticate)
3. `hashed_name`: the real name of the hashed field in the DB (defaults to field_hash)
4. `salt`: salt value to pass on to bcrypt (defaults to 8)
5. `setter`: [optional] async setter function name

## Author

Ynon Perek