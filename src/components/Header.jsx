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
    <section style={styles.root}>
      <nav>
        <ul style={styles.listContainer}>
          <Link style={styles.listItem} to="/">
            <li>Home</li>
          </Link>

          <Link style={styles.listItem} to="/stocks">
            <li>Stocks</li>
          </Link>

          <Link style={styles.listItem} to="/budget">
            <li>Budget</li>
          </Link>
        </ul>
        <button style={styles.btn} onClick={signout}>
          Signout
        </button>
      </nav>
    </section>
  );
};

const styles = {
  root: {
    position: "relative",
    display: "grid",
    gridArea: "Header",
    height: "3em",
    lineHeight: "3em",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
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
    textAlign: "center",
    textDecoration: "none",
    color: "#ededed",
    width: "10%",
    height: "100%",
  },
  btn: { position: "absolute" },
};

export default Header;
