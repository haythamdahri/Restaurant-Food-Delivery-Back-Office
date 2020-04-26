import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import AuthService from "../services/AuthService";
import loginImage from "../loginImage.jpg";

type FormData = {
  email: string;
  password: string;
};
const inputStyle = {
  display: "block",
  width: "100%",
  borderRadius: "2px",
  color: "#686868",
  lineHeight: "1.2",
  WebkitTransition: "all 0.4s",
  OTransition: "all 0.4s",
  MozTransition: "all 0.4s",
  transition: "all 0.4s",
  marginTop: "10px",
  height: "42px",
  outline: "none",
  margin: 0,
  BorderRadius: "0%",
};
const bodyStyle = {
  backgroundImage: `url(${loginImage})`,
  backgroundSize: "cover",
  minHeight: "500px",
  borderRadius: "0 10px 10px 0",
  padding: 0,
  height: "100vh",
};

export default (props: any) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  let history = useHistory();

  useEffect(() => {
    document.title = "Sign In";
    // Check if user is authenticated
    if (AuthService.isAuthenticated()) {
      // Redirect to home page
      history.push("/");
    }

  });

  const onSubmit = (data: { email: string; password: string }) => {
    // Set loading to true
    // Unset error with message
    setLoading(true);
    setMessage("");
    setError(false);
    // Login user using AuthService
    AuthService.signin(data)
      .then((response) => {
        // Rdirect user to home page
        history.push("/");
        // window.location.reload();
        setLoading(false);
      })
      .catch((err) => {
        // Set error with message
        setMessage(
          "Unsuccessful attempt, please check your email or password!"
        );
        setError(true);
        setLoading(false);
      });
  };

  return (
    <div className="row" style={bodyStyle}>
      <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8 mx-auto bg-light shadow p-3 mb-5 rounded mt-5">
        <div className="col-12 text-center font-weight-bold display-4">
          Sign In To Your Account
        </div>
        <div className="col-12 text-center mt-2">
          <FontAwesomeIcon icon="user-circle" size="6x" />
        </div>
        {/** Sign In Form */}

        {/** Sign in error */}
        {error && (
          <>
            <div
              className="alert alert-warning alert-dismissible fade show font-weight-bold text-center mt-3"
              role="alert"
            >
              <FontAwesomeIcon icon="exclamation" /> {message}
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </>
        )}
        <div className="col-12 p-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                style={inputStyle}
                name="email"
                ref={register({
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                aria-describedby="emailHelp"
              />
              {/** Required email error */}
              {errors.email && errors.email.type === "required" && (
                <div className="invalid-feedback">Email is required</div>
              )}
              {/** Invalid email error */}
              {errors.email && errors.email.type === "pattern" && (
                <div className="invalid-feedback">Invalid email</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                style={inputStyle}
                name="password"
                ref={register({ required: true })}
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
              />
              {/** Required password error */}
              <div className="invalid-feedback">Password is required</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">
              {!loading ? (
                <>
                  <FontAwesomeIcon icon="sign-in-alt" /> Sign in
                </>
              ) : (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>{" "}
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <div className="w-100 shadow-sm p-1 mb-3 bg-dark rounded"></div>
        <div className="col-12">
          <h4 className="text-center mt-5">
            <FontAwesomeIcon icon="user-clock" /> If you are facing problems
            during session sign in, please contact your administrator!
          </h4>
        </div>
      </div>
    </div>
  );
};
