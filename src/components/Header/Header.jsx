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
    <section class="header">
      <nav>
        {/* <div>menu</div> */}
        <ul class="list-container">
          <Link class="list-item" to="/">
            <li>Home</li>
          </Link>

          <Link class="list-item" to="/stocks">
            <li>Stocks</li>
          </Link>

          <Link class="list-item" to="/budget">
            <li>Budget</li>
          </Link>
        </ul>
        <button class="sign-out action button" onClick={signout}>
          Signout
        </button>
      </nav>
    </section>
  );
};

export default Header;
