const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const server = require('./app'); // Import the server

chai.use(chaiHttp);

describe('Login Functionality', () => {
  let testServer;

  // Before all tests, start the server
  before((done) => {
    testServer = server.listen(3001, () => {
      console.log('Test server running on port 3001');
      done();
    });
  });

  // After all tests, close the server
  after((done) => {
    if (testServer) {
      testServer.close(() => {
        console.log('Test server closed');
        done();
      });
    } else {
      done();
    }
  });

  it('should return "Login successful" for correct credentials', (done) => {
    chai.request(testServer)
      .post('/login')
      .type('form')
      .send({ username: 'admin', password: 'password123' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Login successful');
        done();
      });
  });

  it('should return "Invalid username or password" for incorrect credentials', (done) => {
    chai.request(testServer)
      .post('/login')
      .type('form')
      .send({ username: 'wronguser', password: 'wrongpassword' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(401);
        expect(res.text).to.equal('Invalid username or password');
        done();
      });
  });
});
