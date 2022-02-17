import {
  FETCH_USER_PROFILE,
  USER_PROFILE_FAILURE,
  USER_PROFILE_SUCCESS,
} from "../actions/actionTypes";
const initialProfileState = {
  user: {},
  error: null,
  success: null,
  inProgress: false,
};
export default function profile(state = initialProfileState, action) {
  switch (action.type) {
    case FETCH_USER_PROFILE:
      return {
        ...state,
        inProgress: true,
      };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.user,
        success: true,
        inProgress: false,
      };
    case USER_PROFILE_FAILURE:
      return {
        ...state,
        inProgress: false,
        error: action.error,
      };
    default:
      return state;
  }
}
