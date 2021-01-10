import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
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
    </div>
  );
};

export default Header;
