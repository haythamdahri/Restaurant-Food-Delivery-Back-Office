import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserService from "../services/UserService";
import ProductService from "../services/ProductService";
import PaymentService from "../services/PaymentService";
import { PaymentModel } from "../models/PaymentModel";
import { OrderModel } from "../models/OrderModel";
import { ReviewModel } from "../models/ReviewModel";
import { MealModel } from "../models/MealModel";
import ReviewService from "../services/ReviewService";
import OrderService from "../services/OrderService";
import { UserModel } from "../models/UserModel";

export default () => {
  const [users, setUsers] = useState(new Array<UserModel>());
  const [payments, setPayments] = useState(new Array<PaymentModel>());
  const [orders, setOrders] = useState(new Array<OrderModel>());
  const [reviews, setReviews] = useState(new Array<ReviewModel>());
  const [meals, setMeals] = useState(new Array<MealModel>());
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  let history = useHistory();
  let abortController: AbortController = new AbortController();

  useEffect(() => {
    let isCancelled = false;
    document.title = "Home";
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      // Redirect to sign in page
      history.push("/signin");
      return;
    } else {
      const fetchData = async () => {
        try {
          // Retrieve users
          const users = await UserService.getUsers();
          if (!isCancelled) {
            setUsers(users);
            setLoadingUsers(false);
          }
        } catch (error) {
          if (!isCancelled) {
            setUsers([]);
            setLoadingUsers(false);
          }
        } 
        try {
          const products = await ProductService.getMeals();
          if (!isCancelled) {
            setMeals(products);
            setLoadingProducts(false);
          }
        } catch (error) {
          if (!isCancelled) {
            setMeals([]);
            setLoadingProducts(false);
          }
        }
        try {
          const payments = await PaymentService.getPayments();
          if (!isCancelled) {
            setPayments(payments);
            setLoadingPayments(false);
          }
        } catch (error) {
          if (!isCancelled) {
            setPayments([]);
            setLoadingPayments(false);
          }
        }
        try {
          const reviews = await ReviewService.getReviews();
          if (!isCancelled) {
            setReviews(reviews);
            setLoadingReviews(false);
          }
        } catch (error) {
          if (!isCancelled) {
            setReviews([]);
            setLoadingReviews(false);
          }
        }
        try {
          const orders = await OrderService.getOrders();
          if (!isCancelled) {
            setOrders(orders);
            setLoadingOrders(false);
          }
        } catch (error) {
          if (!isCancelled) {
            setOrders([]);
            setLoadingOrders(false);
          }
        }
      };
      // Fetch data
      fetchData();
    }
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, []);

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
                {loadingUsers === false ? (
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
                {loadingProducts === false ? (
                  <h1 className="font-weight-bold mt-5 display-4">
                    <FontAwesomeIcon icon="align-left" /> {meals.length}{" "}
                    Products
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
                    "-webkit-linear-gradient(90deg,#ee0979 0%,#ff6a00 100%)",
                  height: "200px",
                }}
              >
                {loadingReviews === false ? (
                  <h1 className="font-weight-bold mt-5 display-4">
                    <FontAwesomeIcon icon="indent" /> {reviews.length} Reviews
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
                    "-webkit-linear-gradient(90deg,#45b649 0%,#dce35b 100%)",
                  height: "200px",
                }}
              >
                {loadingOrders === false ? (
                  <h1 className="font-weight-bold mt-5 display-4">
                    <FontAwesomeIcon icon="shopping-basket" /> {orders.length}{" "}
                    Orders
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
                    " linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                  height: "200px",
                }}
              >
                {loadingPayments === false ? (
                  <h1 className="font-weight-bold mt-5 display-4">
                    <FontAwesomeIcon icon="money-bill" /> {payments.length}{" "}
                    Payments
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
