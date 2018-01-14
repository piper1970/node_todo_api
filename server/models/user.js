'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const hashSecret = '123abc!';
const saltLength = 10;

let UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique:true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required:true,
    minlength: 6
  },
  tokens:[{
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

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id.toHexString(),access}, hashSecret).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {return token;});
};

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;

  try{
    decoded = jwt.verify(token, hashSecret);
  }catch(error){
    return Promise.reject('authorization failed');
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function(next) {
  let user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(saltLength, (err, salt) => {
      if(!err){
        bcrypt.hash(user.password, salt, (err, hash) => {
          if(!err){
            user.password = hash;
          }
          next();
        })
      }
    });
  }else{
    next();
  }
});

const User = mongoose.model ('User', UserSchema);

module.exports = {
  User
};
