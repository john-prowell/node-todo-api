const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Determines exactly what is sent back when a mongoose model is converted
// into a JSON value
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); // taking mongoose variable user and converting it
  // to a regular object where only the properties available on the document exist.
  return _.pick(userObject, ['_id', 'email']);
};

// automatically hash the password before its saved to the database
UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) { // only hash the password if it has been modified (or is new)    
    bcrypt.genSalt(10, (err, salt) => { // generate salt
      bcrypt.hash(user.password, salt, (err, hash) => {  // hash with salt
       user.password = hash; // sets user.password to the hash
       next();
      });
    });
  } else { // if password is already hashed then skip
    next();
  }
});

// Generate Token
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  
  user.tokens.push({access, token}); // store token in user model in db
  // user.tokens.concat([{access, token}]); // suggested but doesn't work for me

  return user.save().then(() => {
    return token;
  });  
};

// Remove token
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};
 
// Find by token
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

    try {
      decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  };

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token, // '' quotes are required when you have a . in the value
    'tokens.access': 'auth'
  });
};


// Check email and password match
UserSchema.statics.findByCredentials = function (email, password) {
  var user = this;

  return User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User}