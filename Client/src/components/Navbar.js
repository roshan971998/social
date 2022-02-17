import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/auth";
import { searchUsers } from "../actions/search";
import * as $ from "jquery";
class Navbar extends React.Component {
  logOut = () => {
    localStorage.removeItem("token");
    this.props.dispatch(logoutUser());
  };
  handleMouseClickOnSearch = () => {
    const { results } = this.props;
    if (results.length > 0) $("#searchResults").show();
  };
  handleSearch = (e) => {
    const searchText = e.target.value;

    this.props.dispatch(searchUsers(searchText));
  };
  render() {
    const { auth, results } = this.props;
    return (
      <nav className="nav">
        <div className="left-div">
          <Link to="/">
            <img
              src="https://ninjasfiles.s3.amazonaws.com/0000000000003454.png"
              alt="logo"
            />
          </Link>
        </div>

        <div
          className="search-container"
          onMouseLeave={() => {
            $("#searchResults").hide();
          }}
        >
          <img
            className="search-icon"
            src="https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg"
            alt="search-icon"
          />
          <input
            placeholder="Search"
            onChange={this.handleSearch}
            onMouseEnter={this.handleMouseClickOnSearch}
          />

          {results.length > 0 && (
            <div className="search-results" id="searchResults">
              <ul>
                {results.map((user) => (
                  <li
                    className="search-results-row"
                    key={user._id}
                    onClick={(e) => {
                      $("#searchResults").hide();
                    }}
                  >
                    <Link to={`/user/${user._id}`}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="user-dp"
                      />
                      <span>{user.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="right-nav">
          {auth.isLoggedIn && (
            <div className="user">
              <Link to="/settings">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="user-dp"
                  id="user-dp"
                />
              </Link>
              <span>{auth.user.name}</span>
            </div>
          )}
          <div className="nav-links">
            <ul>
              {!auth.isLoggedIn && (
                <li>
                  <Link to="/login">Log in</Link>
                </li>
              )}
              {auth.isLoggedIn && <li onClick={this.logOut}>Log out</li>}
              {!auth.isLoggedIn && (
                <li>
                  <Link to="/signup">Register</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    results: state.search.results,
  };
}

export default connect(mapStateToProps)(Navbar);
