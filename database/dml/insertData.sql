INSERT INTO website.users (username, email, password) VALUES ('Ulminator', 'fake@email.com', 'hashed-pass');
INSERT INTO website.users (username, email, password) VALUES ('user1', 'fake@email2.com', 'hashed-pass1');
INSERT INTO website.users (username, email, password) VALUES ('user2', 'fake@email3.com', 'hashed-pass2');
INSERT INTO website.users (username, email, password) VALUES ('user3', 'fake@email4.com', 'hashed-pass3');

INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'Fake Post 1', 111111);
INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'Fake Post 2', 111112);
INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'Fake Post 3', 111113);

INSERT INTO website.post_comments (post_id, username, content) VALUES (1, 'Ulminator', 'First!');
INSERT INTO website.post_comments (post_id, username, content) VALUES (1, 'user1', 'This is a dummy comment.');
INSERT INTO website.post_comments (post_id, username, content) VALUES (1, 'user2', 'This is a second dummy comment.');

INSERT INTO website.post_comment_replies (comment_id, username, content) VALUES (2, 'user2', 'user2 replying to the comment of user1');
INSERT INTO website.post_comment_replies (comment_id, username, content) VALUES (3, 'user3', 'user3 replying to the comment of user2');
INSERT INTO website.post_comment_replies (comment_id, username, content) VALUES (2, 'user3', 'user3 replying to the comment of user1');
