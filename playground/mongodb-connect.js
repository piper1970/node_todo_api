'use strict';

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'First todo',
  //   completed: false
  // }, (error, result) => {
  //   if(error){
  //     return console.log('Unable to insert todo', error);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert user {name, age, location} into Users
  // db.collection('Users').insertOne({
  //   name: 'Steve Sargent',
  //   age: 47,
  //   location: 'home'
  // }, (error, response) => {
  //   if(error){
  //     return console.log('Unable to insert user into Users collection', error);
  //   }
  //   console.log(JSON.stringify(response.ops[0]._id.getTimestamp()));
  // });

  // insert user with objectID
  db.collection('Users').insertOne({
    _id: new ObjectID(),
    name: 'George Sargent',
    age: 47,
    location: 'Portland'
  }, (error, results) => {
    if(error){
      return console.log('Unable to insert user into Users collection', error);
    }
    console.log(results.ops[0]._id.getTimestamp());
    console.log(results.ops);
  });

  client.close();
});
