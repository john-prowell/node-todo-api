// const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

 
 // Finds user by id and sets completed to true
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5a9879e394e83c095ce55ccb')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false // returns modified document otherwise original would be returned by default
  }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  
  // finds user by id and updates name and increments age
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a9878f38034f2293cb87c86')
  }, {
    $set: {
      name: 'Vegas'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false // returns modified document
  }).then((result) => {
    console.log(result);
  });

  
  
  // client.close();
});