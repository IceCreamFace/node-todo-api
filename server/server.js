const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

var {
  mongoose
} = require('./db/mongoose');
var {
  Todo
} = require('./models/todo');
var {
  User
} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
  console.log(req.body);
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
      res.send({
        todos
      })
    }, (e) => {
      res.status(400).send()
    })
  })
  //Get todos/124124124
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  //validate ID
  //404 if not valid - empty body
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // findById
  Todo.findById(id).then((todo) => {
      //fail to find
      if (!todo) {
        return res.status(404).send();
      }
      //sucess
      res.send(todo);

    }, (e) => {
      if (e) {
        return res.status(400).send();
      }
    })
    //error
    //400 - print e - send empty body

})

app.listen(3000, () => {
  console.log('Started on port 3000');
});
module.exports = {
  app
}
