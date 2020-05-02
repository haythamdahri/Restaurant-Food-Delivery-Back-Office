import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Users from "./components/Users";
import PrivateRoute, {
  UserRoute,
  AuthenticatedGuard,
} from "./services/AuthGuard";
import Payments from "./components/Payments";
import Reviews from "./components/Reviews";
import Products from "./components/Products";
import ProductEdit from "./components/ProductEdit";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      {/** Navbar */}
      <Navbar />

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className="container-fluid" style={{minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif'}}>
        <Switch>
          <PrivateRoute exact={true} path="/">
            <Home />
          </PrivateRoute>
          <AuthenticatedGuard exact={true} path="/signin">
            <SignIn />
          </AuthenticatedGuard>
          <PrivateRoute exact={true} path="/users">
            <Users />
          </PrivateRoute>
          <PrivateRoute exact={true} path="/payments">
            <Payments />
          </PrivateRoute>
          <PrivateRoute exact={true} path="/products">
            <Products />
          </PrivateRoute>
          <PrivateRoute exact={true} path="/products/save">
            <ProductEdit />
          </PrivateRoute>
          <PrivateRoute exact={true} path="/products/save/:id">
            <ProductEdit />
          </PrivateRoute>
          <PrivateRoute exact={true} path="/reviews">
            <Reviews />
          </PrivateRoute>
          <UserRoute exact={true} path="/profile">
            <Profile />
          </UserRoute>
          <Route exact={true} path="/notfound">
            <NotFound />
          </Route>
          {/** Not Found Page */}
          <Route path="">
            <Redirect to="/notfound" />
          </Route>
        </Switch>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
