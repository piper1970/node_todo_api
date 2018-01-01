'use strict';

const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach( (done) => {
  Todo.remove({}).then( () =>  done());
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
        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });
});
