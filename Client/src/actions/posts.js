import { APIUrls } from "../helpers/urls";
import { getAuthTokenFromLocalStorage, getFormBody } from "../helpers/utils";
import {
  ADD_COMMENT,
  ADD_POST,
  UPDATE_POSTS,
  UPDATE_POST_LIKE,
} from "./actionTypes";

export function updatePosts(posts) {
  return {
    type: UPDATE_POSTS,
    posts,
  };
}

export function fetchPosts() {
  return (dispatch) => {
    const url = APIUrls.fetchPosts();
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(updatePosts(data.data.posts)); //storing the posts got from API to our redux store
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function addPost(post) {
  return {
    type: ADD_POST,
    post,
  };
}

export function createPost(content) {
  return async (dispatch) => {
    const url = APIUrls.createPost();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
      body: getFormBody({ content }),
    };
    const response = await fetch(url, options); //here we are storing our post to server through API
    const data = await response.json();

    if (data.success) {
      dispatch(addPost(data.data.post)); //after saving post on server ,here we are storing the newly created post it in our redux store
    }
  };
}

export function createComment(comment, postId) {
  return (dispatch) => {
    const url = APIUrls.createComment();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`, //since we are not passing the user or or usedID
        //to the createComment() function while calling it from src/components/post.js but yet when comment data
        //comes to us from the api user field in comment data is set to the current user who is commenting as
        //as we are passing our jwt token to the api in order to do comment on a post and hence api get our information through our jwt token
        //similarly we will do while lking a post or a comment,we will pass our jwt token in headers
      },
      body: getFormBody({ content: comment, post_id: postId }),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("comment data", data);
          dispatch(addComment(data.data.comment, postId));
        }
      });
  };
}
//after creating comment on the server ,we get data as :
// CommentsDataReceived = {
//   data: {
//     comment: {
//       _id: "",
//       content: "the comment we write",
//       likes: [],
//       post: "",
//       updatedAt: "",
//       user: {user who commented },
//       _v: "",
//       _id: "",
//     },
//   },
//   message: "your comment ispublished",
//   success: true,
// };

export function addComment(comment, postId) {
  return {
    type: ADD_COMMENT,
    comment,
    postId, //giving postid so that we can determine to which post we have add the given comment
  };
}

//in the codial API url to like a comment and  like a post is same we just have to pass liketype
//hence this function will be used by us for liking a comment and liking a post
export function addLike(id, likeType, userId) {
  return (dispatch) => {
    const url = APIUrls.toggleLike(id, likeType);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("like data", data);
        if (data.success) {
          dispatch(addLikeToStore(id, userId));
        }
      });
  };
}
export function addLikeToStore(postId, userId) {
  return {
    type: UPDATE_POST_LIKE,
    postId,
    userId,
  };
}
