import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Health Check', () => {
  it('should be up', (done) => {
    chai.request(app)
      .get('/api/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('UP');
        done();
      });
    });
});