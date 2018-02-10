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
app.post('/todos', authenticate, async (req, res) => {
  try{
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed,
      completedAt:req.body.completedAt,
      _creator: req.user._id
    });
    const doc = await todo.save();
    res.status(201).send(doc);
  }catch(error){
    res.status(400).send(error);
  }
});

// get all todo's
app.get('/todos', authenticate, async (req, res) => {
  try{
    const todos = await Todo.find({_creator: req.user._id});
    res.send({
      todos
    });
  }catch(error){
    response.status(400).send(error);
  }
});

app.get('/todos/:id', authenticate, async (req,res) => {
  try{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOne({_id:id, _creator: req.user._id});
    if(!todo){
      return res.status(404).send();
    }else{
      return res.send({todo});
    }
  }catch(error){
    return res.status(400).send();
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {

  try{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOneAndRemove({_id:id, _creator:req.user._id});
    if(!todo){
      res.status(404).send();
    }else{
      res.send({todo});
    }
  }catch(error){
    res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
  try{
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    }else{
      body.completed = false;
      body.completedAt = null;
    }
    const todo = await Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new:true});
    if(!todo){
      res.status(404).send();
    }else{
      res.send({todo});
    }
  }catch(error){
    res.status(400).send();
  }
});

// async
app.post('/users', async (req, res) => {
  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }catch(e){
    res.status(400).send(e);
  }
});

app.post('/users/login', async (req, res) => {

  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }catch(e){
    res.status(400).send();
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate,  async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
