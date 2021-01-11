import React from "react";
import { Link } from "react-router-dom";

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
