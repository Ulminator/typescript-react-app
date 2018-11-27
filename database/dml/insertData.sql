INSERT INTO website.users (username, email, password) VALUES ('Ulminator', 'fake@email.com', 'hashed-pass');
INSERT INTO website.users (username, email, password) VALUES ('user1', 'fake@email2.com', 'hashed-pass1');
INSERT INTO website.users (username, email, password) VALUES ('user2', 'fake@email3.com', 'hashed-pass2');
INSERT INTO website.users (username, email, password) VALUES ('user3', 'fake@email4.com', 'hashed-pass3');

INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'Fake Post 1', 111111);
INSERT INTO website.posts (user_id, title, image_id) VALUES (2, 'Fake Post 2', 111112);
INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'Fake Post 3', 111113);

INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 1, 'First!');
INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 2, 'This is a dummy comment.');
INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 3, 'This is a second dummy comment.');

INSERT INTO website.replies (comment_id, user_id, content) VALUES (2, 3, 'user2 replying to the comment of user1');
INSERT INTO website.replies (comment_id, user_id, content) VALUES (3, 4, 'user3 replying to the comment of user2');
INSERT INTO website.replies (comment_id, user_id, content) VALUES (2, 4, 'user3 replying to the comment of user1');
INSERT INTO website.replies (comment_id, user_id, content, created_at) VALUES (2, 1, 'Reply made after others but set in past.', '2016-06-22 19:10:25-07');
