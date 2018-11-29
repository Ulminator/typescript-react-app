import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

// /api/comments/3?expand=user,replies&incude=id,content,created_at

describe('Comment Controller Tests', () => {
  it('should get comment by id', (done) => {
    chai.request(app)
      .get('/api/comments/2')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(3);
        expect(body._expandable).to.deep.equal({
          user: '/api/users/2',
          replies: '/api/comments/2/replies',
        });
        expect(body._links).to.deep.equal({ self: '/api/comments/2', post: '/api/posts/1' });

        const { comment } = body;

        expect(comment.id).to.equal(2);
        expect(comment.content).to.equal('This is one serious post! Great job. Learning a lot ☺');
        expect(comment).to.have.property('createdAt');

        done();
      });
  });

  it('should get comment by id and expand user', (done) => {
    chai.request(app)
      .get('/api/comments/2?expand=user')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(3);
        expect(body._expandable).to.deep.equal({ replies: '/api/comments/2/replies' });
        expect(body._links).to.deep.equal({ self: '/api/comments/2', post: '/api/posts/1' });

        const { comment } = body;

        expect(comment.id).to.equal(2);
        expect(comment.content).to.equal('This is one serious post! Great job. Learning a lot ☺');
        expect(comment).to.have.property('createdAt');

        const { user } = comment;

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

  it('should get comment by id and expand replies', (done) => {
    chai.request(app)
      .get('/api/comments/2?expand=replies')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(3);
        expect(body._expandable).to.deep.equal({ user: '/api/users/2' });
        expect(body._links).to.deep.equal({ self: '/api/comments/2', post: '/api/posts/1' });

        const { comment } = body;

        expect(comment.id).to.equal(2);
        expect(comment.content).to.equal('This is one serious post! Great job. Learning a lot ☺');
        expect(comment).to.have.property('createdAt');

        const { replies } = comment;

        expect(replies).to.be.an('Array');
        expect(replies.length).to.equal(2);

        expect(replies[0].id).to.equal(5);
        expect(replies[0].content).to.equal('Reply made after others but set in past.');
        expect(replies[0]).to.have.property('createdAt');
        expect(replies[0]._links).to.deep.equal({
          self: '/replies/5',
          comment: '/comments/2/',
          user: '/users/1',
        });

        expect(replies[1].id).to.equal(4);
        expect(replies[1].content).to.equal('Inserted first but displayed last.');
        expect(replies[1]).to.have.property('createdAt');
        expect(replies[1]._links).to.deep.equal({
          self: '/replies/4',
          comment: '/comments/2/',
          user: '/users/3',
        });

        done();
      });
  });

  it('should get comment by id and expand user and replies', (done) => {
    chai.request(app)
      .get('/api/comments/2?expand=user,replies')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(2);
        expect(body).to.not.have.property('_expandable');
        expect(body._links).to.deep.equal({ self: '/api/comments/2', post: '/api/posts/1' });

        const { comment } = body;

        expect(comment.id).to.equal(2);
        expect(comment.content).to.equal('This is one serious post! Great job. Learning a lot ☺');
        expect(comment).to.have.property('createdAt');

        const { user } = comment;

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

        const { replies } = comment;

        expect(replies).to.be.an('Array');
        expect(replies.length).to.equal(2);

        expect(replies[0].id).to.equal(5);
        expect(replies[0].content).to.equal('Reply made after others but set in past.');
        expect(replies[0]).to.have.property('createdAt');
        expect(replies[0]._links).to.deep.equal({
          self: '/replies/5',
          comment: '/comments/2/',
          user: '/users/1',
        });

        expect(replies[1].id).to.equal(4);
        expect(replies[1].content).to.equal('Inserted first but displayed last.');
        expect(replies[1]).to.have.property('createdAt');
        expect(replies[1]._links).to.deep.equal({
          self: '/replies/4',
          comment: '/comments/2/',
          user: '/users/3',
        });

        done();
      });
  });

  it('should get comment by id and include only content', (done) => {
    chai.request(app)
      .get('/api/comments/2?include=content')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(3);
        expect(body._expandable).to.deep.equal({
          user: '/api/users/2',
          replies: '/api/comments/2/replies',
        });
        expect(body._links).to.deep.equal({ self: '/api/comments/2', post: '/api/posts/1' });

        const { comment } = body;

        expect(comment.content).to.equal('This is one serious post! Great job. Learning a lot ☺');
        expect(comment).to.not.have.property('id');
        expect(comment).to.not.have.property('createdAt');

        done();
      });
  });

  it('should create a reply', (done) => {
    chai.request(app)
      .post('/api/comments/1/reply')
      .send({ userId: 3, content: 'Test Reply' })
      .end((err, res) => {
        expect(res).to.have.status(201);

        const { body } = res;
        expect(Object.keys(body).length).to.equal(2);
        expect(body._links).to.deep.equal({
          self: '/api/replies/6',
          comment: '/api/comments/1',
          user: '/api/users/3',
        });

        const { reply } = body;
        expect(reply.id).to.equal(6);
        expect(reply.content).to.equal('Test Reply');
        expect(reply).to.have.property('createdAt');

        done();
      });
  });

  it('should fail to create a reply due to bad comment id', (done) => {
    chai.request(app)
      .post('/api/comments/100/reply')
      .send({ userId: 3, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(Object.keys(res.body).length).to.equal(0);
        done();
      });
  });

  it('should fail to create a reply due to bad reply user id', (done) => {
    chai.request(app)
      .post('/api/comments/1/reply')
      .send({ userId: 100, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(Object.keys(res.body).length).to.equal(0);
        done();
      });
  });
});
