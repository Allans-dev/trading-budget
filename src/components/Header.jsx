import React from "react";
import { Link, Redirect } from "react-router-dom";

import firebase from "firebase/app";

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
        </ul>
        <button onClick={signout}>Signout</button>
      </nav>
    </div>
  );
};

const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const styles = {
  root: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3",
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
