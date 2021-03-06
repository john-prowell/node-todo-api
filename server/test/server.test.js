const expect = require('expect');
const request = require('supertest');

const {
  ObjectID
} = require('mongodb');
const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');
const {
  User
} = require('./../models/user');

const {
  todos,
  populateTodos,
  users,
  populateUsers
} = require('./seed/seed');

// clear users from database before each test and put in seed users
beforeEach(populateUsers);
// clear todos from database before each test and put in seed todos
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should not create todo with a invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });
      });

  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID}.toHexString()`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if id is invalid', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
      it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
          .delete(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            Todo.findById(hexId).then((todo) => {
              expect(todo).toBeNull();
              done();
            }).catch((e) => {
              done(e);
            });
          });
      });  

        it('should remove a todo', (done) => {
          var hexId = todos[0]._id.toHexString();
          request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();
                done();
              }).catch((e) => {
                done(e);
              });
            });
        });

        it('should return 404 if todo not found', (done) => {
          var hexId = new ObjectID().toHexString();
          request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
          request(app)
            .delete('/todos/123abc')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
        });
      });

      describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
          // grab id of first item
          var id = todos[0]._id.toHexString();
          var text = 'Todo PATCH Test';
          // update the text, set completed to true
          request(app)
            .patch(`/todos/${id}`)
            // set user token
            .set('x-auth', users[0].tokens[0].token)
            // update text, set completed to true
            .send({
              text: text,
              completed: true
            })
            // 200
            .expect(200)
            // res.body has a text property = to the text that you sent in
            .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              // completed is true, completed at is a number .toBeA(number)
              expect(res.body.todo.completed).toBe(true);
              expect(typeof (res.body.todo.completedAt)).toBe('number');
            })
            .end(done);
        });

        it('should not update the todo by differenct user', (done) => {
          // grab id of first item
          var id = todos[0]._id.toHexString();
          var text = 'Todo PATCH Test';
          // update the text, set completed to true
          request(app)
            .patch(`/todos/${id}`)
            // set user token
            .set('x-auth', users[1].tokens[0].token)
            // update text, set completed to true
            .send({
              text: text,
              completed: true
            })
            // 200
            .expect(404)
            .end(done);
        });

        it('should clear completed at todo is not completed', (done) => {
          // grab id of second todo item
          var id = todos[1]._id.toHexString();
          var text = 'Todo Second Text'
          // update text to something different, completed to false
          request(app)
            .patch(`/todos/${id}`)
            // set user token
            .set('x-auth', users[1].tokens[0].token)
            .send({
              text: text,
              completed: false
            })
            // 200
            .expect(200)
            // text is changed, completed false, completedAt is null .toBeNull
            .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
        });
      });

      describe('GET /users/me', () => {
        it('Should return user if authenticated', (done) => {
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

        it('Should return a 401 if not authenticated', (done) => {
          // get users/me route
          request(app)
            .get('/users/me')
            // do not pass a x-auth token in header            
            // expect 401 error back
            .expect(401)
            // body is = to empty object because there user is not authenticated sent back toEqual
            .expect((res) => {
              expect(res.body).toEqual({});
            })
            .end(done);
        });
      });    


      describe('POST /users', () => {
        it('Should create a user', (done) => {
          var email = 'example@example.com';
          var password = '123456'

          request(app)
            .post('/users')
            .send({
              email,
              password
            })
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toBeTruthy(); // use bracket notation because of hyphen
              expect(res.body._id).toBeTruthy();
              expect(res.body.email).toBe(email);
            })
            .end((err) => { // after tests run then we can run queries on database and test them
              if (err) {
                return done(err);
              }

              User.findOne({
                email
              }).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
              }).catch((e) => {
                done(e);
              });
            });
        });

        it('Should return validation errors if request invalid', (done) => {
          var email = 'invalid-email.com';
          var password = '123';

          request(app)
            .post('/users')
            .send({
              email,
              password
            })
            .expect(400)
            .end(done)
        });

        it('Should not create user if email in use', (done) => {

          request(app)
            .post('/users')
            .send({
              email: users[0].email,
              password: users[0].password
            })
            .expect(400)
            .end(done);
        });
      });

      describe('POST /users/login', () => {
        it('should login user and return auth token', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: users[1].email,
              password: users[1].password
            })
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              User.findById(users[1]._id).then((user) => {
                expect(user.toObject().tokens[1]).toMatchObject({
                  access: 'auth',
                  token: res.headers['x-auth']
                });
                done();
              }).catch((e) => done(e));
            });
        });

        it('Should reject invalid login', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: users[1].email,
              password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
              expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
              }).catch((e) => done(e));
            });
        });
      });

      describe('DELETE /users/me/token', () => {
        it('should remove auth token on logout', (done) => {
          // DELETE request to users/me/token
          request(app)
            .delete('/users/me/token')
            // Set x-auth equal to token
            .set('x-auth', users[0].tokens[0].token)
            // 200
            .expect(200)
            //  end call
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              // finduser, verify that tokens array has length of zero
              User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
              }).catch((e) => done(e));
            });
        });
      });