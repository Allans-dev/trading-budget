import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
    bottom: 0,
    width: "100%",
    maxWidth: width,
    backgroundColor: "black",
    padding: "20px 0",
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

export default Footer;
