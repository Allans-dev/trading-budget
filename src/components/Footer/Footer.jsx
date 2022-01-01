import React from "react";
import { Link } from "react-router-dom";

import "./footer_styles.css";

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-top">
        <span>
          <Link className="privacy-policy" to="/privacy-policy">
            Privacy Policy
          </Link>
        </span>
        |
        <span>
          <Link className="disclaimer" to="/disclaimer">
            Disclaimer
          </Link>
        </span>
      </div>
      <div className="copyright">
        Copyright &copy; 2021 code.allan | All rights Reserved
      </div>
    </section>
  );
};

export default Footer;
