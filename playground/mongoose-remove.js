'use strict';

const {ObjectID} = require('mongoDB');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) // clears everything

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({_id: new ObjectId}).then((todo) => {
//   console.log(todo);
// });

// Todo.findByIdAndRemove('5a4ce691d1c1117e2533ea84').then((todo) => {
//   console.log(todo);
// });
