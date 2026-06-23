import { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    isLoggedIn: false,
    errorMessage: "",
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmitSuccess = (token) => {
    Cookies.set("jwt_token", token, { expires: 30 });
    this.setState({ isLoggedIn: true });
  };

  onSubmitFailure = (errorMessage) => {
    this.setState({ errorMessage });
  };

  submitForm = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const url =
      "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };
    const response = await fetch(url, options);
    const fetchedData = await response.json();
    if (response.ok) {
      this.onSubmitSuccess(fetchedData.data.token);
    } else {
      this.onSubmitFailure(fetchedData.message);
    }
  };
  render() {
    const { email, password, isLoggedIn, errorMessage } = this.state;
    if (isLoggedIn || Cookies.get("jwt_token") !== undefined) {
      return <Navigate to="/" />;
    }
    return (
      <div className="login-page-bg">
        <div className="login-form-container">
          <h1 className="login-heading">Go Business</h1>
          <p>Sign in to open your referral dashboard.</p>
          <form className="login-form" onSubmit={this.submitForm}>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="email-input-field"
              value={email}
              onChange={this.onChangeEmail}
              placeholder="you@example.com"
            />
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
            />
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    );
  }
}

export default LoginForm;
