import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Profile from './components/Profile';
import Users from './components/Users';

function App() {
  return (
    <Router>
      {/** Navbar */}
      <Navbar />

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <div className="container-fluid">
        <Switch>
          <Route exact={true} path="/">
            <Home />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
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