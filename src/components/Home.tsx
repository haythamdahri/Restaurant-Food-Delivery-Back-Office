import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserService from "../services/UserService";
import User from "../models/UserToken";
import Axios from "axios";

export default () => {
  const [users, setUsers] = useState(new Array<User>());
  const [loadings, setLoadings] = useState({
    loadingUsers: true,
    loadingProducts: true,
    loadingReviews: true,
    loadingPayments: true,
    loadingOrders: true,
  });
  let history = useHistory();

  useEffect(() => {
    let usersSubscription: Promise<void>;
    document.title = "Home";
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      // Redirect to sign in page
      history.push("/signin");
    } else {
      // Retrieve users
      usersSubscription = UserService.getUsers()
        .then((users) => {
          setUsers(users);
          setLoadings({...loadings, loadingUsers: false});
        })
        .catch((err) => {
          setLoadings({...loadings, loadingUsers: false});
        });
    }
    return () => {
      usersSubscription.then()
    }
  }, [history, loadings]);

  return (
    <div className="row">
      {/** CARDS */}
      {AuthService.isEmployee() ? (
        <>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto mt-4">
            <div className="card">
              <div
                className="card-body text-center shadow p-3 rounded"
                style={{
                  backgroundImage:
                    "-webkit-linear-gradient(0deg,#766dff 0%,#88f3ff 100%)",
                  height: "200px",
                }}
              >
                {loadings.loadingUsers === false ? (
                  <h1 className="font-weight-bold mt-5 display-4">
                    <FontAwesomeIcon icon="user-circle" /> {users.length} Users
                  </h1>
                ) : (
                  <div
                    className="spinner-border mt-5"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto mt-4">
            <div className="card">
              <div
                className="card-body text-center shadow p-3 rounded"
                style={{
                  backgroundImage:
                    "-webkit-linear-gradient(90deg,#11998e 0%,#38ef7d 100%)",
                  height: "200px",
                }}
              >
                <h1 className="font-weight-bold mt-5 display-4">
                  <FontAwesomeIcon icon="align-left" /> 90 Product
                </h1>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto mt-4">
            <div className="card">
              <div
                className="card-body text-center shadow p-3 rounded"
                style={{
                  backgroundImage:
                    "-webkit-linear-gradient(90deg,#ee0979 0%,#ff6a00 100%)",
                  height: "200px",
                }}
              >
                <h1 className="font-weight-bold mt-5 display-4">
                  <FontAwesomeIcon icon="indent" /> 986 Review
                </h1>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto mt-4">
            <div className="card">
              <div
                className="card-body text-center shadow p-3 rounded"
                style={{
                  backgroundImage:
                    "-webkit-linear-gradient(90deg,#45b649 0%,#dce35b 100%)",
                  height: "200px",
                }}
              >
                <h1 className="font-weight-bold mt-5 display-4">
                  <FontAwesomeIcon icon="shopping-basket" /> 9852 Order
                </h1>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto mt-4">
            <div className="card">
              <div
                className="card-body text-center shadow p-3 rounded"
                style={{
                  backgroundImage:
                    " linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                  height: "200px",
                }}
              >
                <h1 className="font-weight-bold mt-5 display-4">
                  <FontAwesomeIcon icon="money-bill" /> 20 Payment
                </h1>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="col-12">
          <div className="shadow-lg p-3 mb-5 bg-warning rounded mt-5 text-center font-weight-bold display-4">
            <FontAwesomeIcon icon="exclamation" /> You are not authorized to
            access this page
          </div>
        </div>
      )}
    </div>
  );
};
