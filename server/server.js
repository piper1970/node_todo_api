'use strict';

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



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
