import React from "react";
import { Link, Redirect } from "react-router-dom";

import firebase from "firebase/app";

import "./header_styles.css";

const Header = () => {
  const signout = () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        <Redirect to="/" />;
        console.log("Signed Out");
      })
      .catch((error) => {
        console.error("Sign Out Error", error);
      });
  return (
    <section className="header">
      <nav>
        <ul className="list-container">
          {window.matchMedia("(max-width: 1200px)").matches ? null : (
            <Link class="list-item" to="/">
              <li>Home</li>
            </Link>
          )}
          <Link className="list-item" to="/stocks">
            <li>Stocks</li>
          </Link>

          <Link className="list-item" to="/budget">
            <li>Budget</li>
          </Link>
          <Link className="list-item" to="/analysis">
            <li>Analysis</li>
          </Link>
        </ul>

        <button className="sign-out action button" onClick={signout}>
          Signout
        </button>
      </nav>
    </section>
  );
};

export default Header;
