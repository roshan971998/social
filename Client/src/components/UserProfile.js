import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUserProfile } from "../actions/profile";
import { APIUrls } from "../helpers/urls";
import { getAuthTokenFromLocalStorage } from "../helpers/utils";
import { addFriend, removeFriend } from "../actions/friends";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      successMessage: null,
    };
  }
  componentDidMount() {
    const { match } = this.props;
    if (match.params.userId) {
      //dispatch an action to fetch that particular user from api and hence our action creator is asynchronous type
      this.props.dispatch(fetchUserProfile(match.params.userId));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      match: { params: prevParams },
    } = prevProps;
    const {
      match: { params: currentParams },
    } = this.props;

    if (
      prevParams &&
      currentParams &&
      prevParams.userId !== currentParams.userId
    ) {
      this.setState({
        success: null,
        error: null,
        successMessage: null,
      });
      this.props.dispatch(fetchUserProfile(currentParams.userId));
    }
  }

  checkIfUserIsAFriend = () => {
    console.log("this.props", this.props);
    const { match, friends } = this.props;
    const userId = match.params.userId;

    const index = friends.map((friend) => friend.to_user._id).indexOf(userId);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  handleAddFriendClick = async () => {
    const userId = this.props.match.params.userId;
    const url = APIUrls.addFriend(userId);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.success) {
      this.setState({
        success: true,
        successMessage: "Added friend successfully!",
      });

      this.props.dispatch(addFriend(data.data.friendship));
    } else {
      this.setState({
        success: null,
        error: data.message,
      });
    }
  };

  handleRemoveFriendClick = async () => {
    // Mini Assignment
    const {
      match: { params },
    } = this.props;
    const url = APIUrls.removeFriend(params.userId);

    const extra = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    };

    const response = await fetch(url, extra);
    const data = await response.json();
    //console.log("await data", data);

    if (data.success) {
      // show user message
      this.setState({
        success: true,
        successMessage: "Removed friends successfully!",
      });
      this.props.dispatch(removeFriend(params.userId)); //once we remove a friend from api we need to remove from our store also
    } else {
      this.setState({
        success: null,
        error: data.message,
      });
    }
  };
  render() {
    // const { user } = this.props.location.state;  /use if we pass some object in to property from PostList.js
    const { profile } = this.props;
    //here props are the default props passed be react router to its different route components
    //props looks like ---
    //{
    //  dispatch:f,
    //  friends:[],
    //  history:{length:31,action:'REPLACE' or 'PUSH,replace:f,push:f,location:{same as below location object},etc},
    //  location:{pathname:"/user/61ed44e96938bd457a869ca5",search:'',hash:'',key:,state:undefined},
    //  match:{isExact:true,params:{userId:"61ed44e96938bd457a869ca5"},path:"/user/:userId",url:"/user/61ed44e96938bd457a869ca5",},
    //  profile:{},user:{},staticContext
    //}

    //
    console.log("params", this.props);

    if (profile.inProgress) {
      return (
        <div>
          <img
            src="https://gifimage.net/wp-content/uploads/2018/04/loading-gif-transparent-background-bergerak-11.gif"
            style={{ width: 1500, height: 678 }}
            alt="user-dp"
          />
        </div>
      );
    }

    const { success, error, successMessage } = this.state;
    const user = profile.user;
    const isUserAFriend = this.checkIfUserIsAFriend();

    return (
      <div className="settings">
        <div className="img-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="user-dp"
            id="user-dp"
          />
        </div>
        <div className="field">
          <div className="field-label">Name</div>
          <div className="field-value">{user.name}</div>
        </div>
        <div className="field">
          <div className="field-label">Email</div>
          <div className="field-value">{user.email}</div>
        </div>
        <div className="btn-grp">
          {!isUserAFriend ? (
            <button
              className="button save-btn"
              onClick={this.handleAddFriendClick}
            >
              Add Friend
            </button>
          ) : (
            <button
              className="button save-btn"
              onClick={this.handleRemoveFriendClick}
            >
              Remove Friend
            </button>
          )}

          {success && (
            <div className="alert success-dailog">{successMessage}</div>
          )}
          {error && <div className="alert error-dailog">{error}</div>}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ profile, friends }) {
  return {
    profile,
    friends,
  };
}

export default connect(mapStateToProps)(UserProfile);
