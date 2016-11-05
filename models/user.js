/**
 *            user
 *
 * Created by marcusjwhelan on 11/5/16.
 *
 * Contact: marcus.j.whelan@gmail.com
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password
// before saving a model run this function
userSchema.pre('save', function (next) {
  // context of this func is the user model.
  const user = this; // can get specific email password from this user

  // generate a salt then run cb(). salt level = 10
  bcrypt.genSalt(10, function (err, salt) {
    if(err) { return next(err);}

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if(err) { return next(err);}

      // overwrite plain text password with encrypted password
      user.password = hash;

      // go ahead and save the model.
      next();
    });
  })
});


// whenever we create a user object they will have access to the methods object
userSchema.methods.comparePassword = function (candidatePassword, callback) { // this.password is this user's instance password
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if(err) return callback(err);
    // I am guessing isMatch is a boolean true or false
    callback(null, isMatch);
  })
};


// create the model class
const ModelClass = mongoose.model('user', userSchema); // loads the schema into mongoose. Corresponding to a collection names 'user'


// export the model
module.exports = ModelClass;