import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Comment } from "./";
import { addLike, createComment } from "../actions/posts";

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
    };
  }
  handleAddComment = (e) => {
    const { comment } = this.state;
    const { post } = this.props;

    if (e.key === "Enter") {
      this.props.dispatch(createComment(comment, post._id));

      // clear comment
      this.setState({
        comment: "",
      });
    }
  };

  handleOnCommentChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  handlePostLike = () => {
    const { post, user } = this.props;
    this.props.dispatch(addLike(post._id, "Post", user._id)); //if we want to like a comment we send likeType as 'Comment'
  };

  render() {
    const { post, user } = this.props;
    const { comment } = this.state;

    const isPostLikedByUser =
      post.likes.indexOf(user._id) === -1 ? false : true;
    //let at some post initial likes count is 2
    //once we have liked the post our id will get stored in the likes array(as we have choosed to define like that) of that post i.e likescount=3
    //that we are doing this in the reducer but as soon as we referesh the webpage after liking the post
    //what happens is that codial API does sth wrong and instead of putting the user id in the likes array
    //it puts the id of the likes array object itself stored in database at server  (i.e likes count is still 3 but red heart gone)
    //and hence we dont see red haeart then but since there is some id in likes array it count is still maintained at 3
    //and hence it shows the number of likes as 3 still and if we click the heart icon again it will toggle the like
    //that is it reduces the count of likes array by 1 at server but in frontend we will see red heart as well as likes count increased to=4
    //but as soon as we refresh again we see likes back to 2 or the previous count it was on

    return (
      <div className="post-wrapper" key={post._id}>
        <div className="post-header">
          <div className="post-avatar">
            <Link
              // to={{
              //   pathname: "/user",
              //   state: {
              //     user: post.user,
              //   },
              // }}
              to={`/user/${post.user._id}`}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="user-pic"
              />
            </Link>
            <div>
              <span className="post-author">{post.user.name}</span>
              <span className="post-time">{post.createdAt}</span>
            </div>
          </div>
          <div className="post-content">{post.content}</div>

          <div className="post-actions">
            <button className="post-like no-btn" onClick={this.handlePostLike}>
              {isPostLikedByUser ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1029/1029183.png"
                  alt="liked-the-post"
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
                  alt="not-likes-icon"
                />
              )}
              <span>{post.likes.length}</span>
            </button>

            <div className="post-comments-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png"
                alt="comments-icon"
              />
              <span style={{ marginLeft: 8, marginRight: 7 }}>
                {post.comments.length}
              </span>
            </div>
          </div>
          <div className="post-comment-box">
            <input
              placeholder="Add a Comment..."
              onChange={this.handleOnCommentChange}
              onKeyPress={this.handleAddComment}
              value={comment}
            />
          </div>

          <div className="post-comments-list">
            {post.comments.map((comment) => (
              <Comment comment={comment} key={comment._id} postId={post._id} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

function mapStateToprops({ auth }) {
  return {
    user: auth.user,
  };
}
export default connect(mapStateToprops)(Post);

//export default connect()(Post);
//to connect function it is not necessary to pass callback function as in case
// a component does not need anything from store but if it wants dispatch reference then
//we can acall connect likes this so that component will not get anything from store as props
//but will get dispatch reference
