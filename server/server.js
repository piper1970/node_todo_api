'use strict';

require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongoDB');
const bodyParser = require('body-parser');
const express = require('express');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT;
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
  let id = req.params.id;

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

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((error) => {
      return res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, { new:true})
    .then((todo) => {
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((error) => res.status(400).send());
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);
  user.save()
    .then(
      () => {
        return user.generateAuthToken();
      })
      .then((token) => {
        res.header('x-auth', token).send(user);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      })
    }).catch((error) => {
      res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate,  (req, res) => {
  let user = req.user;
  user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
