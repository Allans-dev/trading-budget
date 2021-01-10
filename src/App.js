import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from "./components/Landing";
import AddShares from "./components/AddShares";
import AddSavings from "./components/AddSavings";
import AddExpenses from "./components/AddExpenses";

import Footer from "./components/Footer";
import Header from "./components/Header";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/add_shares">
          <AddShares />
        </Route>
        <Route path="/add_expenses">
          <AddExpenses />
        </Route>
        <Route path="/add_savings">
          <AddSavings />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
