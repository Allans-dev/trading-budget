import React, { useContext } from "react";
import { Link } from "react-router-dom";

import firebase from "firebase/app";

import { store } from "./store";

const signout = () =>
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        const globalState = useContext(store);
        globalState.dispatch({ type: "logout" });
        console.log("Signed Out");
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );

const Header = () => {
  return (
    <div style={styles.root}>
      <nav>
        <ul style={styles.listContainer}>
          <li>
            <Link style={styles.listItem} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link style={styles.listItem} to="/stocks">
              Stocks
            </Link>
          </li>
          <li>
            <Link style={styles.listItem} to="/budget">
              Budget
            </Link>
          </li>
          <li>
            <Link style={styles.listItem} to="/analysis">
              Analysis
            </Link>
          </li>
        </ul>
      </nav>
      <button onClick={signout}>Signout</button>
    </div>
  );
};

const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const styles = {
  root: {
    position: "relative",
    left: 0,
    top: 0,
    maxWidth: width,
    backgroundColor: "black",
    padding: "20px 0",
    marginBottom: "20px",
  },
  listContainer: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  listItem: {
    textDecoration: "none",
    color: "#ededed",
  },
};

export default Header;
