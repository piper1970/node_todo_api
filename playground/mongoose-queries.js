'use strict';

const {ObjectID} = require('mongoDB');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = "5a4aae9ad243a08b3e99d591";

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}

User.findById(id)
  .then((user) => {
    if(!user){
      return console.log('User not found');
    }
    console.log('User', user);
  }).catch( (error) => {
    console.log(error);
  });

// Todo.find({
//   _id: id
// }).then((todos) => {
//   if(todos.length === 0){
//     return console.log('No todos found');
//   }
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Single Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Single Todo by ID', todo);
// }).catch((error) => {
//   console.log(error);
// });
