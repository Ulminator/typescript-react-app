CREATE SCHEMA IF NOT EXISTS website;

CREATE TABLE website.users
(
  id serial NOT NULL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamp default now(),
  active boolean default false
);

-- user who posts has original comment
CREATE TABLE website.posts
(
  id serial NOT NULL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES website.users (id),
  title text NOT NULL,
  image_id text NOT NULL,
  created_at timestamp default now()
);

CREATE TABLE website.comments
(
    id serial NOT NULL PRIMARY KEY,
    post_id integer NOT NULL REFERENCES website.posts (id),
    user_id integer NOT NULL REFERENCES website.users (id),
    content text NOT NULL,
    created_at timestamp default now()
);

CREATE TABLE website.replies
(
    id serial NOT NULL PRIMARY KEY,
    comment_id integer NOT NULL REFERENCES website.comments (id),
    user_id integer NOT NULL REFERENCES website.users (id),
    content text NOT NULL,
    created_at timestamp default now()
);

-- to assist the order by for the api/post/:postId route
-- CREATE INDEX post_commnent_replies_comment_id_created_at_idx on website.post_comment_replies(comment_id, created_at);
