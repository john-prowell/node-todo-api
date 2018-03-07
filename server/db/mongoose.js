const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary
// check heroku mlab mongodb addon or use local machine
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// Use mlab account directly or use local machine
mongoose.connect('mongodb://todoapp:todoapp@ds157818.mlab.com:57818/todoapp' || 'mongodb://localhost:27017/TodoApp')

module.exports = {
  mongoose: mongoose
};