INSERT INTO website.users (username, email, password) VALUES ('Matt', 'matt@gmail.com', 'hashed-pass1');
INSERT INTO website.users (username, email, password) VALUES ('John', 'john@gmail.com', 'hashed-pass2');
INSERT INTO website.users (username, email, password) VALUES ('Sally', 'sally@gmail.com', 'hashed-pass3');
INSERT INTO website.users (username, email, password) VALUES ('Harry', 'fake@gmail.com', 'hashed-pass4');

INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'The Cost Of JavaScript In 2018', 111111);
INSERT INTO website.posts (user_id, title, image_id) VALUES (2, 'JavaScript fundamentals before learning React', 333333);
INSERT INTO website.posts (user_id, title, image_id) VALUES (2, 'The Best Explanation of JavaScript Reactivity', 222222);
INSERT INTO website.posts (user_id, title, image_id) VALUES (1, 'The definitive guide to JavaScript Dates', 999999);
INSERT INTO website.posts (user_id, title, image_id) VALUES (3, 'How to visually design state in JavaScript', 777777);

INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 1, 'First!');
INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 2, 'This is one serious post! Great job. Learning a lot ☺');
INSERT INTO website.comments (post_id, user_id, content) VALUES (1, 4, 'I spent all month optimizing my code — it’s so fast now. Then the ad-man threw 10Mb of ads and auto-play videos on my site. Glad I spent all of that time making my JS so speedy.');
INSERT INTO website.comments (post_id, user_id, content) VALUES (2, 2, 'Only 1 comment on this post.');

INSERT INTO website.replies (comment_id, user_id, content) VALUES (1, 2, 'Second!!');
INSERT INTO website.replies (comment_id, user_id, content) VALUES (1, 3, 'Third!!!');
INSERT INTO website.replies (comment_id, user_id, content) VALUES (1, 4, 'Fourth!!!!');
INSERT INTO website.replies (comment_id, user_id, content) VALUES (2, 3, 'The only reply to this comment');
INSERT INTO website.replies (comment_id, user_id, content, created_at) VALUES (2, 1, 'Reply made after others but set in past.', '2016-06-22 19:10:25-07');
