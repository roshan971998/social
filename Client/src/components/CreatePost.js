import React, { Component } from "react";
import { connect } from "react-redux";
import { createPost } from "../actions/posts";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
  }

  handleOnClick = () => {
    // dispatch action
    this.props.dispatch(createPost(this.state.content));
    this.setState({
      content: "",
    });
  };

  handleChange = (e) => {
    this.setState({
      content: e.target.value,
    });
  };
  render() {
    return (
      <div className="create-post">
        <textarea
          className="add-post"
          value={this.state.content}
          onChange={this.handleChange}
        />

        <div>
          <button id="add-post-btn" onClick={this.handleOnClick}>
            Add Post
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(CreatePost); //since if we dont want anything from redux store then we have
//option that we need not to pass a callback function inside connect()();
//but benefit of such call is that we get access to dispatch function in our component via props
