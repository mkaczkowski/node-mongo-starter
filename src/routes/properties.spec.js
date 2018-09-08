const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./../app');

//TODO create a mongodb-memory-server and setup / tearDown fresh DB

describe('Integration API testing', () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.DATABASE,
      { useNewUrlParser: true }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * Testing get properties endpoint
   */
  describe('GET /properties', () => {
    it('should respond with json containing a list of all properties', done => {
      request(app)
        .get('/properties')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // We can assert for specific conditions to be met
          expect(JSON.parse(res.text)).toBeDefined();
          expect(JSON.parse(res.text).length).toBeGreaterThan(0);
          // OR use snapshot match testing
          expect(res.text).toMatchSnapshot();
        })
        .end(err => {
          if (err) throw done(err);
          done();
        });
    });
  });

  /**
   * Testing post user endpoint
   */
  xdescribe('POST /users', function() {
    const data = {
      id: '1',
      name: 'dummy',
      contact: 'dummy',
      address: 'dummy',
    };
    it('respond with 201 created', function(done) {
      request(app)
        .post('/users')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => {
          expect(response).toMatchSnapshot();
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  /**
   * Testing post user endpoint
   */
  xdescribe('POST /users', function() {
    const data = {
      //no id
      name: 'dummy',
      contact: 'dummy',
      address: 'dummy',
    };
    it('respond with 400 not created', function(done) {
      request(app)
        .post('/users')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect('"user not created"')
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
