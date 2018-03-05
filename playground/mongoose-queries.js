const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a9a1bc1130bf910805a0c09';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id // mongoose converts string into object ID
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id // mongoose converts string into object ID
// }).then((todo) => {
//   console.log('Todos', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => {
//   console.log(e);
// });

const id = '5a9c8d0caadf1606441ba8b411';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('No user found');
  }
  console.log('User', user);
}, (e) => {
  console.log(e);
});