'use strict';

const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongoDB');
const {app} = require('./../server');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
  it('should get all todos for given user', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return a 404 if id parameter is invalid', (done) => {
    // make sure a 404 is returned.
    let id = '123';
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if no results are found', (done) => {
    // make sure a 404 is returned
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return the Todo document when found', (done) => {
    let id = todos[0]['_id'].toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0]['text']);
      })
      .end(done);
  });

  it('should not return the Todo document when found if it is not the owner', (done) => {
    let id = todos[0]['_id'].toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // query database using findById
        Todo.findById(hexID).then((doc) => {
          expect(doc).toBeFalsy();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not remove a todo created by another user', (done) => {
    let hexID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // query database using findById
        Todo.findById(hexID).then((doc) => {
          expect(doc).toBeTruthy();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return a 404 if not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if object id is invalid', (done) => {
    // make sure a 404 is returned.
    let id = '123';
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    let hexID = todos[0]._id.toHexString();
    let text = "Updated text 1";
    let completed = true;
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({text, completed})
      .expect(200)
      .expect((results) => {
        expect(results.body.todo.text).toBe(text);
        expect(results.body.todo.completed).toBe(completed);
        expect(typeof results.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update todo if not owner', (done) => {
    let hexID = todos[1]._id.toHexString();
    let text = "Updated text 1";
    let completed = true;
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({text, completed})
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexID = todos[1]._id.toHexString();
    let text = "Updated text 2";
    let completed = false;
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text, completed})
      .expect(200)
      .expect((results) => {
        expect(results.body.todo.text).toBe(text);
        expect(results.body.todo.completed).toBe(completed);
        expect(results.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123nbdfe!'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then ((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        })
      });
  });
  it('should return validation errors if request invalid', (done) => {
    let email = 'example#example.com';
    let password = '123457cc'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
  it('should not create user if email is in use', (done) => {
    let email = users[0].email;
    let password = '123457cc'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }else{
            User.findById(users[0]._id).then( (user) => {
              expect(user.toObject().tokens[0]).toMatchObject({
                access:'auth',
                token: res.headers['x-auth']
              });
              done();
            }).catch((err) => done(err));
          }
        });
    });
    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[0].email,
          password: users[0].password + "nope"
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeFalsy();
          done();
        }).catch((err) => done(err));
    });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // DELETE /users/me/tokens
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, res) => {
        if(error){
          return done(error);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((error) => {
            done(error);
          });
      })
  });
});
