'use strict';

const {ObjectID} = require('mongoDB');
const bodyParser = require('body-parser');
const express = require('express');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const port = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());

// create new todo post
app.post('/todos', (req, res) => {
  console.log(req.body);
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt:req.body.completedAt
  });
  todo.save().then((doc) => {
    res.status(201).send(doc)
  }, (error) => {
    res.status(400).send(error);
  });
});

// get all todo's
app.get('/todos', (req, res) => {
  Todo.find().then( (todos) => {
    res.send({
      todos
    });
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/todos/:id', (req,res) => {
  let id = req.params.id

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    return res.send({todo});
  }, (error) => {
    return res.status(400).send();
  });
});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
