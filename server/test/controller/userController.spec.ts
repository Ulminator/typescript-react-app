import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('User Controller Tests', () => {
  it('should create a new post', (done) => {
    chai.request(app)
      .post('/api/users/1/post')
      .send({ title: 'Test Post', imageId: 333, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body).length).to.equal(1);

        const { post } = res.body;
        expect(post.title).to.equal('Test Post');
        expect(post.imageId).to.equal(333);
        expect(post.id).to.equal(6);
        expect(post).to.have.property('createdAt');
        expect(post._links).to.deep.equal({ self: '/api/posts/6', user: '/api/users/1' });

        const { comments } = post;
        expect(comments).to.be.an('Array');
        expect(comments.length).to.equal(1);
        expect(comments[0].id).to.equal(8);
        expect(comments[0].content).to.equal('Test Comment');
        expect(comments[0]).to.have.property('createdAt');
        expect(comments[0]._links).to.deep.equal({ self: '/api/comments/8', user: '/api/users/1' });

        done();
      });
  });

  it('should fail to create a new post', (done) => {
    chai.request(app)
      .post('/api/users/999/post')
      .send({ title: 'Test Post', imageId: 333, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(Object.keys(res.body).length).to.equal(0);
        done();
      });
  });
});
