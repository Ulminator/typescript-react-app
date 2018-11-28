import * as React from 'react';
import { Link } from 'react-router-dom';

interface Post { id: number; title: string; user_id: number, image_id: number, created_at: Date }

interface PostCardProps { key: number, post: Post }

const PostCard = (postCardProps: PostCardProps) => {
  return (
    <Link to={`/posts/${postCardProps.post.id}`} style={{ position: 'relative',
                                                               textDecoration: 'none',
                                                               top: 100 }}>
      <p style={{ border: '2px',
                  borderStyle: 'solid', 
                  padding: '16px', 
                  margin: '25px'}}
        id={`${postCardProps.post.id}`}>
          {postCardProps.post.title}
      </p>
    </Link>
  );
};

export default PostCard;
