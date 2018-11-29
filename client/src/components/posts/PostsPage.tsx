import axios from 'axios';
import * as React from 'react';
import { Link, match } from 'react-router-dom';
import PostCard from './PostCard';

interface PostsProps {
  history: History
  location: Location
  match: match
}

interface Post {
  id: number;
  title: string;
  imageId: number,
  createdAt: Date,
  _links: object,
}

const initialState: { posts: Post[] } = { posts: [] };

type State = Readonly<typeof initialState>

class PostsPage extends React.Component<PostsProps, State> {
  readonly state: State = initialState;

  componentDidMount() {
    const { REACT_APP_API_URL } = process.env;

    axios.get(`${REACT_APP_API_URL}/posts`)
      .then((res) => {
        this.setState({ posts: res.data.posts });
      })
      .catch((err) => { console.log(err); });
  }

  render() {
    const { posts } = this.state;
    const { match } = this.props;
    return(
      <div style={{ position: 'relative' }}>
        <Link to={`${match.url}/new`} style={{ 
                                        border: '2px',
                                        borderStyle: 'solid', 
                                        padding: '25px',      
                                        position: 'absolute', 
                                        top: '10px', 
                                        right: '25px', 
                                        textDecoration: 'none' }}>
          Create New Post
        </Link>
        { posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    );
  }
}

export default PostsPage;
