CREATE SCHEMA IF NOT EXISTS website;

CREATE TABLE website.users
(
  id serial NOT NULL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  active boolean default false
);

-- user who posts has original comment
CREATE TABLE website.posts
(
  id serial NOT NULL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES website.users (id),
  title text NOT NULL,
  image_id text,
  created_at timestamp default now()
);

-- in this strategy i would have to write to both posts and post_comments table sequentially...

-- should i reference username or user_id (username would be rendered)
CREATE TABLE website.post_comments
(
    id serial NOT NULL PRIMARY KEY,
    post_id integer NOT NULL REFERENCES website.posts (id),
    user_id integer NOT NULL REFERENCES website.users (id),
    content text NOT NULL,
    created_at timestamp default now()
);

CREATE TABLE website.post_comment_replies
(
    id serial PRIMARY KEY,
    comment_id integer NOT NULL REFERENCES website.post_comments (id),
    user_id integer NOT NULL REFERENCES website.users (id),
    content text,
    created_at timestamp default now()
);

-- to assist the order by for the api/post/:postId route
-- CREATE INDEX post_commnent_replies_comment_id_created_at_idx on website.post_comment_replies(comment_id, created_at);
