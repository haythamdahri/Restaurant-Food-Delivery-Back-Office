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

function App() {
  return (
    <Router>
      {/** Navbar */}
      <Navbar />

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className="container-fluid">
        <Switch>
          <PrivateRoute exact={true} path="/">
            <Home />
          </PrivateRoute>
          <AuthenticatedGuard path="/signin">
            <SignIn />
          </AuthenticatedGuard>
          <PrivateRoute path="/users">
            <Users />
          </PrivateRoute>
          <PrivateRoute path="/payments">
            <Payments />
          </PrivateRoute>
          <PrivateRoute path="/reviews">
            <Reviews />
          </PrivateRoute>
          <UserRoute path="/profile">
            <Profile />
          </UserRoute>
          <Route path="/notfound">
            <NotFound />
          </Route>
          {/** Not Found Page */}
          <Route path="">
            <Redirect to="/notfound" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
