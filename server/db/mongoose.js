const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); // check heroku mlab mongodb addon or use local machine
mongoose.connect('mongodb://todoapp:todoapp@ds157818.mlab.com:57818/todoapp')

module.exports = {
  mongoose: mongoose
};