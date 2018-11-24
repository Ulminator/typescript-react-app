import axios from 'axios';
import * as React from 'react';
import { Link, match } from 'react-router-dom';
import ListingCard from './ListingCard';

interface PostsProps {
  history: History
  // location: Location
  match: match
}

interface Listing { id: number; title: string; user_id: number, image_id: number, created_at: Date }

const initialState: { listings: Listing[] } = { listings: [] };

type State = Readonly<typeof initialState>

class PostsPage extends React.Component<PostsProps, State> {
  readonly state: State = initialState;

  componentDidMount() {
    const baseUrl = 'http://localhost:8080';

    axios.get(`${baseUrl}/api/posts`)
      .then((res) => {
        console.log(res.data);
        this.setState({ listings: res.data });
      })
      .catch((err) => { console.log(err); });
  }

  render() {
    const { listings } = this.state;
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
        { listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    );
  }
}

{/* <a href={`/posts/${listingCardProps.listing.id}`} style={{ textDecoration: 'none' }}>
<p 
  style={{ border: '2px', borderStyle: 'solid', padding: '1em', margin: '25px' }}
  id={`${listingCardProps.listing.id}`}>
    {listingCardProps.listing.title}
</p>
</a> */}

export default PostsPage;