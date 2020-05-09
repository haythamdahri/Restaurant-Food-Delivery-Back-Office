import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import logo from "../logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/AuthService";

export default () => {
  let history = useHistory();

  const onSignOut = () => {
    AuthService.signout();
    history.push("/signin");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light"
    style={{fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif'}}>
      <Link className="navbar-brand" to="/">
        <img
          src={logo}
          width="70"
          height="30"
          className="d-inline-block align-top"
          alt="Back Office"
        />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {!AuthService.isAuthenticated() && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/signin">
                <FontAwesomeIcon icon="sign-in-alt" /> Sign in
              </NavLink>
            </li>
          )}
          {AuthService.isAuthenticated() && AuthService.isEmployee() && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/">
                  <FontAwesomeIcon icon="home" /> Home{" "}
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon="tasks" /> Management
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="dropdown-item" to="/users">
                    <FontAwesomeIcon icon="users" /> Users
                  </NavLink>
                  <NavLink className="dropdown-item" to="/payments">
                    <FontAwesomeIcon icon="money-bill" /> Payments
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <NavLink className="dropdown-item" to="/products">
                    <FontAwesomeIcon icon="align-left" /> Products
                  </NavLink>
                  <NavLink className="dropdown-item" to="/reviews">
                    <FontAwesomeIcon icon="indent" /> Reviews
                  </NavLink>
                </div>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/support">
                  <FontAwesomeIcon icon="question-circle" /> Support
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-item">
            <NavLink className="nav-link" to="/chat-support">
              <FontAwesomeIcon icon="comment-dots" /> Chat Support
            </NavLink>
          </li>
          {AuthService.isAuthenticated() && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  <FontAwesomeIcon icon="user-circle" /> Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#" onClick={onSignOut}>
                  <FontAwesomeIcon icon="sign-out-alt" /> Sign out
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
