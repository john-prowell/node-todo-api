// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  
  // deketeMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Tyodos').deleteOne({ text: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete 
  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({ name: 'Roger' }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({ _id: new ObjectID('5a97773d0fff053e56077368') }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });


  // client.close();
});