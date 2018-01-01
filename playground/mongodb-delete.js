'use strict';

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'First todo'})
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch( (error) => {
  //     console.log('Unable to delete documents from Todos collection.', error);
  //   });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'First todo'})
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch( (error) => {
  //     console.log('Unable to delete documents from Todos collection.', error);
  //   });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({text: 'First todo', completed:true})
  //   .then((document) => {
  //     console.log(document);
  //   })
  //   .catch( (error) => {
  //     console.log('Unable to delete documents from Todos collection.', error);
  //   });

  // //delete many from Users collection
  // db.collection('Users').deleteMany({name: 'George Sargent'})
  //   .then((results) => {
  //     let resultCount = results.result.n;
  //     console.log(`Deleted ${resultCount} documents from Users collection`);
  //   })
  //   .catch((error) => console.log('Unable to delete documents from Users collection', error));

  // delete one from Users collection with given _id
  // db.collection('Users').deleteOne({_id: new ObjectID('5a491eaba865de5b7931b6c2')})
  //   .then((results) => {
  //     let resultCount = results.result.n;
  //     console.log(`Deleted ${resultCount} document(s) from Users collection`);
  //   })
  //   .catch((error) => console.log('Unable to delete documents from Users collection', error));

  // client.close();
});
