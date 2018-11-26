import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('User Controller', () => {
  it('should create a new post', (done) => {
    chai.request(app)
      .post('/api/users/1/post')
      .send({ title: 'Test Post', imageId: 333, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body).length).to.equal(2);

        const { post, comment } = res.body;
        expect(Object.keys(post).length).to.equal(6);
        expect(post.postId).to.equal(4);
        expect(post.userId).to.equal(1);
        expect(post.title).to.equal('Test Post');
        expect(post.imageId).to.equal(333);
        expect(post.link).to.equal('/api/posts/4');

        expect(Object.keys(comment).length).to.equal(5);
        expect(comment.commentId).to.equal(4);
        expect(comment.postId).to.equal(4);
        expect(comment.userId).to.equal(1);
        expect(comment.content).to.equal('Test Comment');
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
