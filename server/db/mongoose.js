const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary

mongoose.connect(process.env.MONGODB_URI).then(
  () => { console.log('Connected to MongoDB') },
  err => { console.error(`${err.message}`); }
);

module.exports = {
  mongoose: mongoose
};