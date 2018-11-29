import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Reply Controller', () => {
  it('should get reply by id', (done) => {
    chai.request(app)
      .get('/api/replies/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body).length).to.equal(3);

        const { body } = res;
        expect(body._expandable).to.deep.equal({ user: '/api/users/2' });
        expect(body._links).to.deep.equal({ self: '/api/replies/1', comment: '/api/comments/1' });
        expect(body.reply.id).to.equal(1);
        expect(body.reply.content).to.equal('Second!!');
        expect(body.reply).to.have.property('createdAt');

        done();
      });
  });

  it('should get reply by id and expand user', (done) => {
    chai.request(app)
      .get('/api/replies/1?expand=user')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body).length).to.equal(2);

        const { body } = res;
        expect(body).to.not.have.property('_expandable');
        expect(body._links).to.deep.equal({ self: '/api/replies/1', comment: '/api/comments/1' });

        const { reply } = body;
        expect(reply.id).to.equal(1);
        expect(reply.content).to.equal('Second!!');
        expect(reply).to.have.property('createdAt');

        const { user } = reply;
        expect(user).to.not.have.property('_expandable');
        expect(user._links).to.deep.equal({
          self: '/users/2',
          posts: '/users/2/posts',
          comments: '/users/2/comments',
          replies: '/users/2/replies',
        });
        expect(user.id).to.equal(2);
        expect(user.username).to.equal('John');
        expect(user.email).to.equal('john@gmail.com');
        expect(user).to.have.property('createdAt');

        done();
      });
  });

  it('should get reply by id and only include the content', (done) => {
    chai.request(app)
      .get('/api/replies/1?include=content')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body).length).to.equal(3);

        const { body } = res;
        expect(body._expandable).to.deep.equal({ user: '/api/users/2' });
        expect(body._links).to.deep.equal({ self: '/api/replies/1', comment: '/api/comments/1' });
        expect(body.reply.content).to.equal('Second!!');
        expect(body.reply).to.not.have.property('createdAt');
        expect(body.reply).to.not.have.property('id');

        done();
      });
  });
});
