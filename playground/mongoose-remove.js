const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

Todo.findOneAndRemove({_id: '5aa1a8e215c9d35370a80710'}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('5aa1a8e215c9d35370a80710').then((todo) => {
  console.log(todo);
});
