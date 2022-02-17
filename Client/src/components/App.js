import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import PropTypes from "prop-types";
// import * as jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";

import {
  Home,
  Navbar,
  Page404,
  Login,
  Signup,
  Settings,
  UserProfile,
} from "./index";
import { fetchPosts } from "../actions/posts";
import { authenticateUser } from "../actions/auth";
import { getAuthTokenFromLocalStorage } from "../helpers/utils";
import { fetchUserFriends } from "../actions/friends";

// const Settings = (props) => {
//   console.log(props);    this will give the props passed to it by Router if it is rendered through <Route />
//   return <div>Settings</div>;
// };

const PrivateRoute = (privateRouteProps) => {
  const { isLoggedIn, path, component: Component } = privateRouteProps;
  return (
    <Route
      path={path}
      render={(props) => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              //this object we are passing in the "to" property is loaction object passed as props to the component
              //which is to be renderered on the given path mentioned in pathname property
              pathname: "/login",
              state: {
                //here whatever data we give inside the state is passed to the component
                //which is to be renderered on the given path mentioned in pathname property and
                //here on this path we are rendering login component
                from: props.location, // location is a object like { pathname: "/somepath" ,and some other properties }so it is the actual location where user is trying to access
                //
              },
            }}
          />
        );
      }}
    />
  );
};

class App extends Component {
  componentDidMount() {
    //fetch posts from the API
    this.props.dispatch(fetchPosts());
    //Check if some user is present in the browser local storage
    const token = getAuthTokenFromLocalStorage();

    if (token) {
      const user = jwt_decode(token);
      console.log("user present in token ", user);
      this.props.dispatch(
        authenticateUser({
          email: user.email,
          _id: user._id,
          name: user.name,
        })
      );
      //and if some user is present in browser local storage then fetch
      //its friend from the API and also store that friends data in our local Redux Store
      this.props.dispatch(fetchUserFriends());
    }
  }

  render() {
    //console.log("PROPS", this.props);
    const { posts, auth, friends } = this.props;
    //if we directly render components in Routeri.r browser Router
    return (
      <Router>
        <div>
          <Navbar />
          {/*  since navbar is out of <Route /> tag so it is common/displayed in each route */}
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => {
                return (
                  <Home
                    {...props}
                    posts={posts}
                    friends={friends}
                    isLoggedIn={auth.isLoggedIn}
                  />
                );
              }}
            />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            {/* whenver our component is being rendered by <Route /> like this :<Route path="/login" component={Login} /> 
            then Router by default passes some props to the component and it can be accessed inside the component as this.props
             if component is class type else directly as props  
             and props has some property on it as 1-history ,2-location,3-match etc
             ---history tells us about our current navigation that is how we reached here through different urls and it basically utilises browsers history API
             ---location tells us about the nformation about current url
             --match is simple and tells whether the <Route/>  used exact path way or not and some other information*/}

            {/* secondly react's <Route/>  will not take any props as props name untilit is mentioned in react Route tag docuentaion
             i.e here <Route path="/login" component={Login} />  both path and component is neccessary to write in that way only  
             hence in case if we want our component to pass some props we desired then we have to use render method as done for Home component
             render={() => <Home posts={posts} /> } but then here we loose the default props of <Route/> 
             and if we still want to use the default props passed by <Route/> then we simply do is 
              render={(props) => {
                console.log("auth from home is ", auth.isLoggedIn);
                return <Home {...props} posts={posts} />; here {...props}  it means location={location} match={match} like syntax 
              }}
              because  <Route/> will pass its defaults props to the callback function of render in the name of props 
             */}
            <PrivateRoute
              path="/settings"
              component={Settings}
              isLoggedIn={auth.isLoggedIn}
            />
            <PrivateRoute
              path="/user/:userId"
              component={UserProfile}
              isLoggedIn={auth.isLoggedIn}
            />
            <Route component={Page404} />
            {/* <Route render={()=>(<h1>404 Not Found</h1>)} />  another of writting 404 */}
          </Switch>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    auth: state.auth,
    friends: state.friends,
  };
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  friends: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(App);
