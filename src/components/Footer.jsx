import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
      </nav>
    </section>
  );
};

const styles = {
  root: {
    position: "relative",
    display: "grid",
    gridArea: "Footer",
    width: "100%",
    height: "3em",
    lineHeight: "3em",
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
};

export default Footer;
