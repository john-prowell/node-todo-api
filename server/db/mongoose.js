const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose: mongoose
};