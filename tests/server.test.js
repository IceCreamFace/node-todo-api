const expect = require('expect');
const request = require('supertest');

const {
  app
} = require('../server/server');
const {
  Todo
} = require('../server/models/todo')
const todos = [{
  "text": "First test todo"
}, {
  "text": "secound test todo"
}]


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());


});
describe('POST /todos', () => {
  it('Should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
        it("Should not create todo with invalid body data", (done) => {
          var text = undefined;

          request(app)
            .post('/todos')
            .send({
              text
            })
            .expect(400)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
            })
        })

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e))

      })
  })
})
