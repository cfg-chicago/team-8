var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
//var validate = require('mongoose-validator');


var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  avatar: {
    type: String
  },
  type: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date

});

var User = module.exports = mongoose.model('User', UserSchema);


// Create a new user
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          newUser.password = hash;
          newUser.save(callback);
      });
  });
};

// Retrieve user by username
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
};

// Retrieve user by id
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

// Compare the password
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
  });
};



