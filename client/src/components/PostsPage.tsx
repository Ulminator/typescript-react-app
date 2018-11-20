import axios from 'axios';
import * as React from 'react';
import { Link, match } from 'react-router-dom';
import ListingCard from './ListingCard';

interface PostsProps {
  history: History
  // location: Location
  match: match
}

interface listing { title: string; id: number }
const initialState = { listings: [{ title: 'connected', id: 1 }] };

// const initialState = { listings: [] as listing[] };
// const initialState = { listings: new Array<listing>() };
type State = Readonly<typeof initialState>

class PostsPage extends React.Component<PostsProps, State> {
  readonly state: State = initialState;

  componentDidMount() {
    const baseUrl = 'http://localhost:8080';

    axios.get(`${baseUrl}/api/getListings`)
      .then((res) => {
        this.setState({ listings: res.data });
      })
      .catch((err) => { console.log(err); });
  }

  render() {
    const { listings } = this.state;
    const { match } = this.props;
    return(
      <div>
        <button>
          <Link to={`${match.url}/new`}>Create New Post</Link>
        </button>
        { listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    );
  }
}

// const PostsPage = ( props: PostsProps ) => {
//   const { match } = props;

//   return(
//     <div>
//       <button>
//         <Link to={`${match.url}/new`}>Create New Post</Link>
//       </button>

//     </div>
//   );
// }

export default PostsPage;