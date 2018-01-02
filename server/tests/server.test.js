'use strict';

const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongoDB');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text: 'First test todo',
    _id: new ObjectID()
  },
  {
    text: 'Second test todo',
    _id: new ObjectID()
  }
];

beforeEach( (done) => {
  Todo.remove({}).then( () =>  {
    return Todo.insertMany(todos).then(() => done());
  });
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(201).
      expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end( (err, response) => {
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create TODO with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end( (error, response) => {
        if(error) {
          return done(error);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => done(error));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return a 404 if id parameter is invalid', (done) => {
    // make sure a 404 is returned.
    let id = '123';
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if no results are found', (done) => {
    // make sure a 404 is returned
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return the Todo document when found', (done) => {
    let id = todos[0]['_id'].toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0]['text']);
      })
      .end(done);
  });
})
