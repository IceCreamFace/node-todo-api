var express = require('express');
var bodyParser = require('body-parser');
var {
  ObjectID
} = require('mongodb');

//Destructured imports from different directories in node
var {
  mongoose
} = require('./db/mongoose.js');
var {
  Todo
} = require('./models/todo.js'); //This variable associated with the Todo collection in mongo.
var {
  User
} = require('./models/user.js'); //This variable associated with the User collection in mongo.

const port = process.env.PORT || 3000;

//The basic file structure of a mongoose api is as follows:
/*
  - /'db' - the folder that contains mongoose.js which connects to the mongo server.
  -/'models' - Contains an outile for how the objects being stored will look.
  -/'tests' - Contains server.test.js that is used to test and expect values using mocha, supertest, and require
*/

//Initialize express
var app = express();

//POST to Create
//GET to retrieve

//The middleware that stores all JSON that is stored in the body, Example: using POSTMAN to send data through the body
app.use(bodyParser.json());

//URL is important for REST for resource creation

//This is an http Endpoint for your application
/* app.post('<url of the post>',(request variable, response variable){
    Shit you do with data
    //Then finally save(since it is a POST request) the request using ES6 Promises
});
*/

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text, //The information stored in the body can be found in the request variable.
  });

  todo.save().then((doc) => { //Using the todo model, save the document to the collection using ES6 promises,
    res.send(doc); //respond with what we've saved. This is the resolve case.
  }, (e) => {
    res.status(400).send(e); // If it fucked up respond with why. This is the reject case
  });

  console.log(req.body); //Print out the request that is being stored.
});


//Retrieve all todos inside this collection using the GET protocol
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => { //find everything within the Todo collection. (Resolve case)
    res.send(todos); // (Respond)Send everything in Todo collection
  }, (e) => { // Error handling, reject case
    res.status(400).send(e);
  });
});


//Query fetch todo by ID
//GET /todos/123213123123
app.get('/todos/:id', (req, res) => {
  //parameters that you type in the url can be accessed through req
  var id = req.params.id; // store the ID the user sent to us in the address bar

  //validate id to check with valid
  if (!ObjectID.isValid(id)) {
    //send 404
    //send back empty body
    return res.status(400).send();
    //the get function will break!
  }


  // Look for todo based on ID
  Todo.findById(id).then((todo) => { //Resolve case
    if (!todo) { // If the todo does not exist...
      //send empty page and 400 Code
      return res.status(400).send(); //error handling
    }
    //Otherwise, respond with the todo associated with the _id
    res.send({
      todo
    });
  }, (e) => { //Reject Case
    res.status(400).send(e);
  }).catch((e) => {
    res.status(400).send(e)
  });

});

//wait for connections on port 3000
app.listen(port, () => {
  console.log('Starting on port 3000');
});

module.exports = {
  app
};
