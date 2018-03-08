const mongoose = require('mongoose');

require('dotenv').config();

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary

// Use LOCAL or REMOTE database - create .env file and set properties
mongoose.connect(process.env.LOCAL_DATABASE).then(
  () => { console.log('Connected to MongoDB') },
  err => { console.error(`${err.message}`); }
);

module.exports = {
  mongoose: mongoose
};