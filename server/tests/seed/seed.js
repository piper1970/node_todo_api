'use strict';
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const hashSecret = '123abc!';
let access = 'auth';

const users = [{
  _id: userOneID,
  email: 'whatever@whatever.com',
  password: 'userOnePass',
  tokens:[{
    access,
    token: jwt.sign({_id:userOneID, access},hashSecret, {noTimestamp: true }).toString()
  }]
}, {
  _id: userTwoID,
  email: 'someoneelse@whatever.com',
  password:'userTwoPass'
}];

const todos = [
  {
    text: 'First test todo',
    _id: new ObjectID()
  },
  {
    text: 'Second test todo',
    _id: new ObjectID(),
    completed:true,
    completedAt:123
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then( () =>  {
    return Todo.insertMany(todos).then(() => done());
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {

    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {
  todos, populateTodos, users, populateUsers
};
