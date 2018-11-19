import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('GET - Base route', () => {
  it('should GET a 200 response', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
});