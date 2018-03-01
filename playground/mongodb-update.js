// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  
  db.collection('Todos').findOneAndUpdate(
    { _id: new ObjectID('5a9758ee0fff053e56076967') },
    { completed: true })
    
  

  // client.close();
});