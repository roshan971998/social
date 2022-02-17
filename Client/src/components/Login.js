import React, { Component } from "react";
import { connect } from "react-redux";

import { Redirect } from "react-router-dom";
import { clearAuthState, login } from "../actions/auth";
class Login extends Component {
  constructor(props) {
    super(props);
    // this.emailInputRef = React.createRef();  //this is form handling using uncontrolled components managed by react dom
    // this.paswwordInputRef = React.createRef();
    this.state = {
      //this is form handling using controlled components where the state resides in react state managed by us
      email: "",
      password: "",
    };
  }

  componentWillUnmount() {
    this.props.dispatch(clearAuthState());
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  handleFormSubmit = (event) => {
    //event.preventDefault(); //to prevent the form from submitting
    // console.log("emailInputRef ", this.emailInputRef);
    // console.log("paswwordInputRef ", this.paswwordInputRef);
    console.log("Login form state ", this.state);
    const { email, password } = this.state;
    if (email && password) {
      this.props.dispatch(login(email, password));
    }
  };
  render() {
    const { error, inProgress, isLoggedIn } = this.props.auth;
    const { from } = this.props.location.state || { from: { pathname: "/" } }; //hence if theere is no from key value
    //in this.props.location.state object then we will simply render the home page by giving pathname as "/"
    if (isLoggedIn) {
      console.log("redirecting from Login to home");
      return <Redirect to={from} />;
    }
    return (
      <form className="login-form">
        <span className="login-signup-header">Log In</span>
        {error && <div className="alert error-dailog">{error}</div>}
        <div className="field">
          <input
            type="email"
            placeholder="Email"
            required
            //ref={this.emailInputRef}
            onChange={this.handleEmailChange}
          />
        </div>
        <div className="field">
          <input
            type="password"
            placeholder="Password"
            required
            //ref={this.paswwordInputRef}
            autoComplete="current-password"
            onChange={this.handlePasswordChange}
          />
        </div>
        <div className="field">
          {inProgress ? (
            <button onClick={this.handleFormSubmit} disabled={inProgress}>
              Logging in...
            </button>
          ) : (
            <button onClick={this.handleFormSubmit} disabled={inProgress}>
              Log In
            </button>
          )}
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Login);
