'use strict';

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // find returns a cursor/toArray returns a promise
  // db.collection('Todos').find().toArray().then( (docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch todos', error);
  // });

  // query based on object id

  // query count
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Number of records in the Todo collection: ${count}`);
  // }, (error) => {
  //   console.log('Unable to fetch documents from Todos collection');
  // });


  // query based on criteria
  // db.collection('Todos').find({
  //   completed: false
  // }).toArray().then((results) => {
  //   console.log('Todos with completed equal to false');
  //   console.log(JSON.stringify(results, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch documents from Todos collection');
  // });

  // query all documents with name = Steve Sargent in Users collection
  db.collection('Users').find({name: 'Steve Sargent'}).toArray()
    .then((docs) => {
      console.log(`Number of documents found: ${docs.length}`);
      return docs;
    })
    .then((docs) => {
      console.log(docs);
    })
    .catch((error) => {
      console.log('Unable to fetch documents from Users collection');
    });

  // client.close();
});
