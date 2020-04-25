import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import AuthService from "../services/AuthService";
import '../styles/Signin.css';

type FormData = {
  email: string;
  password: string;
};
const inputStyle = {
    display: 'block',
    width: '100%',
    borderRadius: '2px',
    color: '#686868',
    lineHeight: '1.2',
    '-webkit-transition': 'all 0.4s',
    '-o-transition': 'all 0.4s',
    '-moz-transition': 'all 0.4s',
    'transition': 'all 0.4s',
    'margin-top': '10px',
    'height': '42px',
    'outline': 'none',
    'margin': '0',
    'border-radius': '0%'
}

export default (props: any) => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  let history = useHistory();

  useEffect(() => {
    // Check if user is authenticated 
    if( AuthService.isAuthenticated() ) {
      // Redirect to home page
      history.push('/');
      window.location.reload();
    }
  });

  const onSubmit = (data: {email: string, password: string}) => {
    console.log(data);
  };

  return (
    <div className="row mt-5">
      <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8 mx-auto bg-light shadow p-3 mb-5 rounded">
        <div className="col-12 text-center font-weight-bold display-4">
          Sign In To Your Account
        </div>
        <div className="col-12 text-center mt-2">
          <FontAwesomeIcon icon="user-circle" size="6x" />
        </div>
        {/** Sign In Form */}
        <div className="col-12 p-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                style={inputStyle}
                name="email"
                ref={register({
                  required: true,
                  pattern: /^\S+@\S+$/i
                })}
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
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
                ref={register({required: true})}
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
              />
              {/** Required password error */}
                <div className="invalid-feedback">Password is required</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">
              <FontAwesomeIcon icon="sign-in-alt" /> Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
