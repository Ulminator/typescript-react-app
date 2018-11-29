import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Post Controller', () => {
  it('should get all posts', (done) => {
    chai.request(app)
      .get('/api/posts/')
      .end((err, res) => {
        expect(res).to.have.status(200);

        const { body } = res;
        expect(body._links).to.deep.equal({ self: '/api/posts' });

        const { posts } = body;
        expect(posts).to.be.an('Array');
        expect(posts).to.have.length(5);

        expect(posts[0].id).to.equal(1);
        expect(posts[0].title).to.equal('The Cost Of JavaScript In 2018');
        expect(posts[0].imageId).to.equal('111111');
        expect(posts[0]).to.have.property('createdAt');
        expect(posts[0]._links).to.deep.equal({ self: '/api/posts/1', user: '/api/users/1' });

        expect(posts[1].id).to.equal(2);
        expect(posts[1].title).to.equal('JavaScript fundamentals before learning React');
        expect(posts[1].imageId).to.equal('333333');
        expect(posts[1]).to.have.property('createdAt');
        expect(posts[1]._links).to.deep.equal({ self: '/api/posts/2', user: '/api/users/2' });

        expect(posts[2].id).to.equal(3);
        expect(posts[2].title).to.equal('The Best Explanation of JavaScript Reactivity');
        expect(posts[2].imageId).to.equal('222222');
        expect(posts[2]).to.have.property('createdAt');
        expect(posts[2]._links).to.deep.equal({ self: '/api/posts/3', user: '/api/users/2' });

        expect(posts[3].id).to.equal(4);
        expect(posts[3].title).to.equal('The definitive guide to JavaScript Dates');
        expect(posts[3].imageId).to.equal('999999');
        expect(posts[3]).to.have.property('createdAt');
        expect(posts[3]._links).to.deep.equal({ self: '/api/posts/4', user: '/api/users/1' });

        expect(posts[4].id).to.equal(5);
        expect(posts[4].title).to.equal('How to visually design state in JavaScript');
        expect(posts[4].imageId).to.equal('777777');
        expect(posts[4]).to.have.property('createdAt');
        expect(posts[4]._links).to.deep.equal({ self: '/api/posts/5', user: '/api/users/3' });

        done();
      });
  });

  it('should get post by post id', (done) => {
    chai.request(app)
      .get('/api/posts/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(3);
        expect(body._expandable).to.deep.equal({ comments: '/api/posts/1/comments' });
        expect(body._links).to.deep.equal({ self: '/api/posts/1' });

        const { post } = body;
        expect(post.id).to.equal(1);
        expect(post.title).to.equal('The Cost Of JavaScript In 2018');
        expect(post.imageId).to.equal('111111');
        expect(post).to.have.property('createdAt');

        const { user } = post;
        expect(user.id).to.equal(1);
        expect(user.username).to.equal('Matt');
        expect(user._links).to.deep.equal({
          self: '/api/users/1',
          posts: '/users/1/posts',
          comments: '/users/1/comments',
          replies: '/users/1/replies',
        });

        done();
      });
  });

  it('should get post by post id and expand comments', (done) => {
    chai.request(app)
      .get('/api/posts/1?expand=comments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const { body } = res;

        expect(Object.keys(res.body).length).to.equal(2);
        expect(body).to.not.have.property('_expandable');
        expect(body._links).to.deep.equal({ self: '/api/posts/1' });

        const { post } = body;
        expect(post.id).to.equal(1);
        expect(post.title).to.equal('The Cost Of JavaScript In 2018');
        expect(post.imageId).to.equal('111111');
        expect(post).to.have.property('createdAt');

        const { user } = post;
        expect(user.id).to.equal(1);
        expect(user.username).to.equal('Matt');
        expect(user._links).to.deep.equal({
          self: '/api/users/1',
          posts: '/users/1/posts',
          comments: '/users/1/comments',
          replies: '/users/1/replies',
        });

        const { comments } = post;

        expect(comments).to.be.an('Array');
        expect(comments).to.have.length(3);

        const comment = comments[0];
        expect(comment.id).to.equal(1);
        expect(comment.content).to.equal('First!');
        expect(comment.user).to.deep.equal({
          id: 1,
          username: 'Matt',
          _links: {
            self: '/api/users/1',
            posts: '/users/1/posts',
            comments: '/users/1/comments',
            replies: '/users/1/replies',
          },
        });

        const { replies } = comment;
        expect(replies).to.be.an('Array');
        expect(replies[1].id).to.equal(2);
        expect(replies[1].content).to.equal('Third!!!');
        expect(replies[1]).to.have.property('createdAt');
        expect(replies[1].user).to.deep.equal({
          id: 3,
          username: 'Sally',
          _links: {
            self: '/api/users/3',
            posts: '/users/3/posts',
            comments: '/users/3/comments',
            replies: '/users/3/replies',
          },
        });
        done();
      });

    it('should get post by post id and include only title', (done) => {
      chai.request(app)
        .get('/api/posts/1?include=title')
        .end((err, res) => {
          expect(res).to.have.status(200);
          const { body } = res;

          expect(Object.keys(res.body).length).to.equal(3);
          expect(body._expandable).to.deep.equal({ comments: '/api/posts/1/comments' });
          expect(body._links).to.deep.equal({ self: '/api/posts/1' });

          const { post } = body;
          expect(post).to.not.have.property('id');
          expect(post.title).to.equal('The Cost Of JavaScript In 2018');
          expect(post).to.not.have.property('imageId');
          expect(post).to.not.have.property('createdAt');

          const { user } = post;
          expect(user.id).to.equal(1);
          expect(user.username).to.equal('Matt');
          expect(user._links).to.deep.equal({
            self: '/api/users/1',
            posts: '/users/1/posts',
            comments: '/users/1/comments',
            replies: '/users/1/replies',
          });

          done();
        });
    });
  });

  it('should create a comment', (done) => {
    chai.request(app)
      .post('/api/posts/1/comment')
      .send({ userId: 3, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(201);

        const { body } = res;
        expect(Object.keys(body).length).to.equal(2);
        expect(body._links).to.deep.equal({
          self: '/api/comments/5',
          post: '/api/posts/1',
          user: '/api/users/3',
        });

        const { comment } = body;
        expect(comment.id).to.equal(5);
        expect(comment.content).to.equal('Test Comment');
        expect(comment).to.have.property('createdAt');

        done();
      });
  });

  it('should fail to create a reply due to bad post id', (done) => {
    chai.request(app)
      .post('/api/posts/100/comment')
      .send({ userId: 3, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(Object.keys(res.body).length).to.equal(0);
        done();
      });
  });

  it('should fail to create a reply due to bad user id', (done) => {
    chai.request(app)
      .post('/api/posts/1/comment')
      .send({ userId: 100, content: 'Test Comment' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(Object.keys(res.body).length).to.equal(0);
        done();
      });
  });

});
