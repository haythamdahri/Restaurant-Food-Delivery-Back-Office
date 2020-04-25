import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/AuthService";

export default () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/">
              <FontAwesomeIcon icon="home" /> Home{" "}
              <span className="sr-only">(current)</span>
            </NavLink>
          </li>
          {!AuthService.isAuthenticated() && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/signin">
                <FontAwesomeIcon icon="sign-in-alt" /> Sign in
              </NavLink>
            </li>
          )}
          {AuthService.isAuthenticated() && (
            <>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon="tasks" /> Management
                </NavLink>
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
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  <FontAwesomeIcon icon="user-circle" /> Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="#"
                  onClick={(event) => console.log(event)}
                >
                  <FontAwesomeIcon icon="sign-out-alt" /> Sign out
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
