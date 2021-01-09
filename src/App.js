import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import AddShares from "./components/AddShares";
import AddSavings from "./components/AddSavings";
import AddExpenses from "./components/AddExpenses";

import './App.css';

function App() {

  const Home = () => {
    return (<div>Title</div>);
  }

  return (
    <div className="App">
      <Router>
      <div>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add_shares">Shares</Link>
            </li>
            <li>
              <Link to="/add_expenses">Expenses</Link>
            </li>
            <li>
              <Link to="/add_savings">Savings</Link>
            </li>
          </ul>
        </nav>

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
            <Home />
          </Route>
        </Switch>

      </div>
    </Router>
    </div>
  );
}

export default App;