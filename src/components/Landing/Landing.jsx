import React from "react";

import Stocks from "../Stocks/Stocks";
import Budget from "../Budget/Budget";
import Analysis from "../Analysis/Analysis";

import "./landing_styles.css";

const Landing = () => {
  return window.matchMedia("(max-width: 1200px)").matches ? (
    <Stocks />
  ) : (
    <article className="landing">
      <Stocks />
      <Budget />
      <Analysis />
    </article>
  );
};

export default Landing;
