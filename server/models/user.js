'use strict';

const mongoose = require('mongoose');

const User = mongoose.model ('Users', {
  // email - required - trimmed - string - set min length of 1
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {
  User
};

// let myUser = new User({
//   email: 'whatever@whatever.com'
// });
//
// myUser.save()
//   .then(
//     (doc) => {
//       console.log('Saved user', doc);
//     },
//     (error) => {
//       console.log('Unable to save user', error);
//     });
