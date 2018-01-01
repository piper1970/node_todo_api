'use strict';

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // findOneAndUpdate
  // https://docs.mongodb.com/manual/reference/operator/update/ for second parameter types
  // 5a4988aed1c1117e2532cbc0
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a4988aed1c1117e2532cbc0')
  // },{
  //   $set:{completed: true}
  // },{
  //   returnOriginal:false
  // })
  //   .then((results) => {
  //     console.log(results);
  //   });

    // findOneAndUpdate - 5a491eca8b7b855b7fa7a26f : change name to George, and increment age by one
    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5a491eca8b7b855b7fa7a26f')
    },{
      $set:{
        name: 'George Sargent'
      },
      $inc:{
        age: 1
      }
    },{
      returnOriginal:false
    })
      .then((results) => {
        console.log(results.value);
      })
      .catch((error) => {
        console.log('Could not update document in Users collection', error);
      });

  // client.close();
});
