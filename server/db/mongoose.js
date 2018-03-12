const mongoose = require('mongoose');

// tells mongoose to use built in Promise libary
mongoose.Promise = global.Promise; 

// env settings in server/config.js
mongoose.connect(process.env.MONGODB_URI).then(
  () => { console.log('Connected to MongoDB') },
  err => { console.error(`${err.message}`); }
);

module.exports = {
  mongoose: mongoose
};