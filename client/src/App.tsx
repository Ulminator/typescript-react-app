import * as React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import PostsPage from './components/posts/PostsPage';
import NewPostPage from './components/posts/NewPostPage';

const Home = () => <h2><li><Link to="/posts">Posts</Link></li></h2>;

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/posts" component={PostsPage} />
        <Route exact path='/posts/new' component={NewPostPage}/>
        <Route exact path='/posts/:postid' render= {({match}) =>( <div> <h3> {match.params.postid} </h3></div>)}/>
      </Switch>
    </div>
  </Router>
);

export default App;
