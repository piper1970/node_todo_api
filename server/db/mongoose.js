'use strict'

const mongoose = require('mongoose');

const connection = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(connection);


module.exports = {
  mongoose
};

'production', 'development', 'test'
