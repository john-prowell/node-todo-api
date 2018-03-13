const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'user1@test.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'user2@test.com',
    password: 'userOnePass'
}]

// Seed todos
const todos = [{
    _id: new ObjectID(), // assigns a new Object ID to _id
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }];

  const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos)
    }).then(() => {
      done();
    });
  };

  const populateUser = (done) => {
      User.remove({}).then(() => {
          
      })
  }

  module.exports = {
      todos,
      populateTodos
  }