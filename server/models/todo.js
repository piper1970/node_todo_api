'use strict';

const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength:1,
    trim:true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator:{
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {
  Todo
};


//
// let newTodo = new Todo({
//   text: 'Go to bed',
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }).catch((error) => {
//   console.log('Unable to save Todo', error);
// });

// save a new Todo with all fields added
// let myTodo = new Todo({
//   text: 'Do example run',
//   completed: true,
//   completedAt: Date.now()
// });
// myTodo.save()
//   .then((doc) => {
//     console.log('Saved Todo document', doc);
//   })
//   .catch((error) => console.log('Unable to create document in Todo collection', error));
  //
  // let myTodo = new Todo({
  //   text: " Whatever  "
  // });
  // myTodo.save()
  //   .then((doc) => {
  //     console.log('Saved Todo document', doc);
  //   })
  //   .catch((error) => console.log('Unable to create document in Todo collection', error));
