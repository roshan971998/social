import {
  ADD_COMMENT,
  ADD_POST,
  UPDATE_POSTS,
  UPDATE_POST_LIKE,
} from "../actions/actionTypes";

export default function posts(state = [], action) {
  switch (action.type) {
    case UPDATE_POSTS:
      return action.posts;
    case ADD_POST:
      return [action.post, ...state];
    case ADD_COMMENT:
      //in order to add comment we need to find the post to which it should be added
      const newPosts = state.map((post) => {
        if (post._id === action.postId) {
          //if we got the required post in which comment is to be added we are just
          //creating a new post (i.e post object ) with all the old values (using ...post)
          //and in that post we are changing the comment array as [action.comment, ...post.comments]
          return {
            ...post,
            comments: [action.comment, ...post.comments],
          };
        }
        return post;
      });
      return newPosts;
    case UPDATE_POST_LIKE:
      const newPostsWithLikes = state.map((post) => {
        if (post._id === action.postId) {
          return {
            ...post,
            likes: [...post.likes, action.userId],
          };
        }
        return post;
      });
      return newPostsWithLikes;
    default:
      return state;
  }
}
