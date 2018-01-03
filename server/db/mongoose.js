'use strict'

const mongoose = require('mongoose');

const connection = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodApp';

mongoose.Promise = global.Promise;
mongoose.connect(connection);


module.exports = {
  mongoose
};
