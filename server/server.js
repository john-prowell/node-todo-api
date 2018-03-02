const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tells mongoose to use built in Promise libary
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

var newTodo = new Todo({
    text: 'Eat dinner',
    completed: true,
    completedAt: 5
})

newTodo.save().then((doc) => {
    console.log('Saved Todo ', JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log('Unable to save Todo', e);
});

