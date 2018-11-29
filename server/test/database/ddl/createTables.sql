CREATE SCHEMA IF NOT EXISTS website;

CREATE TABLE IF NOT EXISTS website.users
(
  id serial NOT NULL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamp default now(),
  active boolean default false
);

CREATE TABLE IF NOT EXISTS website.posts
(
  id serial NOT NULL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES website.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  image_id text NOT NULL,
  created_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS website.comments
(
    id serial NOT NULL PRIMARY KEY,
    post_id integer NOT NULL REFERENCES website.posts (id) ON DELETE CASCADE,
    user_id integer NOT NULL REFERENCES website.users (id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS website.replies
(
    id serial NOT NULL PRIMARY KEY,
    comment_id integer NOT NULL REFERENCES website.comments (id) ON DELETE CASCADE,
    user_id integer NOT NULL REFERENCES website.users (id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp default now()
);
