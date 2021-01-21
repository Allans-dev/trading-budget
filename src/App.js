import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from "./components/Landing";
import AddShares from "./components/Stocks";
import AddSavings from "./components/Analysis";
import Budget from "./components/Budget";

import Footer from "./components/Footer";
import Header from "./components/Header";

import { StateProvider } from "./components/store";

import "./App.css";

const App = () => {
  return (
    <StateProvider>
      <Router style={styles.root}>
        <Header />
        <Switch>
          <Route path="/stocks">
            <AddShares />
          </Route>
          <Route path="/budget">
            <Budget />
          </Route>
          <Route path="/analysis">
            <AddSavings />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </StateProvider>
  );
};

const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const styles = {
  root: {
    maxWidth: width,
  },
};

export default App;
