import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Post Controller', () => {
  // it('should get all posts', (done) => {
  //   chai.request(app)
  //     .get('/api/posts/')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       const { body } = res;
  //       expect(body).to.be.an('Array');
  //       expect(body).to.have.length(3);

  //       expect(Object.keys(body[0]).length).to.equal(5);
  //       expect(body[0].id).to.equal(1);
  //       expect(body[0].user_id).to.equal(1);
  //       expect(body[0].title).to.equal('Fake Post 1');
  //       expect(body[0].image_id).to.equal('111111');

  //       expect(Object.keys(body[1]).length).to.equal(5);
  //       expect(body[1].id).to.equal(2);
  //       expect(body[1].user_id).to.equal(2);
  //       expect(body[1].title).to.equal('Fake Post 2');
  //       expect(body[1].image_id).to.equal('111112');

  //       expect(Object.keys(body[2]).length).to.equal(5);
  //       expect(body[2].id).to.equal(3);
  //       expect(body[2].user_id).to.equal(1);
  //       expect(body[2].title).to.equal('Fake Post 3');
  //       expect(body[2].image_id).to.equal('111113');

  //       done();
  //     });
  // });

  // it('should get post by post id', (done) => {
  //   chai.request(app)
  //     .get('/api/posts/1')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       const { body } = res;

  //       console.log(res.body);
  //       expect(Object.keys(body).length).to.equal(6);
  //       expect(body.id).to.equal(1);
  //       //add username to body?
  //       expect(body.userId).to.equal(1);
  //       expect(body.title).to.equal('Fake Post 1');
  //       expect(body.imageId).to.equal('111111');

  //       const { comments } = body;
  //       expect(comments).to.be.an('Array');
  //       expect(comments).to.have.length(3);

  //       // comment 1
  //       expect(Object.keys(comments[0]).length).to.equal(6);
  //       expect(comments[0].comment_id).to.equal(1);
  //       expect(comments[0].content).to.equal('First!');
  //       expect(comments[0].user_id).to.equal(1);
  //       expect(comments[0].username).to.equal('Ulminator');
  //       expect(comments[0].replies).to.be.an('Array');
  //       expect(comments[0].replies.length).to.equal(0);

  //       // comment 2
  //       expect(Object.keys(comments[1]).length).to.equal(6);
  //       expect(comments[1].comment_id).to.equal(2);
  //       expect(comments[1].content).to.equal('This is a dummy comment.');
  //       expect(comments[1].user_id).to.equal(2);
  //       expect(comments[1].username).to.equal('user1');
  //       expect(comments[1].replies).to.be.an('Array');

  //       let { replies } = comments[1];
  //       expect(replies.length).to.equal(3);
  //       expect(Object.keys(replies[0]).length).to.equal(5);
  //       expect(replies[0].reply_id).to.equal(4);
  //       expect(replies[0].content).to.equal('Reply made after others but set in past.');
  //       expect(replies[0].user_id).to.equal(1);
  //       expect(replies[0].username).to.equal('Ulminator');

  //       expect(Object.keys(replies[1]).length).to.equal(5);
  //       expect(replies[1].reply_id).to.equal(1);
  //       expect(replies[1].content).to.equal('user2 replying to the comment of user1');
  //       expect(replies[1].user_id).to.equal(3);
  //       expect(replies[1].username).to.equal('user2');

  //       expect(Object.keys(replies[2]).length).to.equal(5);
  //       expect(replies[2].reply_id).to.equal(3);
  //       expect(replies[2].content).to.equal('user3 replying to the comment of user1');
  //       expect(replies[2].user_id).to.equal(4);
  //       expect(replies[2].username).to.equal('user3');

  //       // comment 3
  //       expect(Object.keys(comments[2]).length).to.equal(6);
  //       expect(comments[2].comment_id).to.equal(3);
  //       expect(comments[2].content).to.equal('This is a second dummy comment.');
  //       expect(comments[2].user_id).to.equal(3);
  //       expect(comments[2].username).to.equal('user2');
  //       expect(comments[2].replies).to.be.an('Array');

  //       replies = comments[2].replies;
  //       expect(replies.length).to.equal(1);
  //       expect(Object.keys(replies[0]).length).to.equal(5);
  //       expect(replies[0].reply_id).to.equal(2);
  //       expect(replies[0].content).to.equal('user3 replying to the comment of user2');
  //       expect(replies[0].user_id).to.equal(4);
  //       expect(replies[0].username).to.equal('user3');

  //       done();
  //     });
  // });

});
