const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('./app'); // Assuming app.js is your main file and exports the server

chai.use(chaiHttp);

describe('Login Functionality', () => {
  it('should return "Login successful" for correct credentials', (done) => {
    chai.request(app)
      .post('/login')
      .type('form')
      .send({ username: 'admin', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Login successful');
        done();
      });
  });

  it('should return "Invalid username or password" for incorrect credentials', (done) => {
    chai.request(app)
      .post('/login')
      .type('form')
      .send({ username: 'wronguser', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.equal('Invalid username or password');
        done();
      });
  });
});
