import React from "react";
import { Link } from "react-router-dom";

import "./footer_styles.css";

const Footer = () => {
  return (
    <section class="footer">
      <div class="footer-top">
        <span>
          <Link class="privacy-policy" to="/privacy-policy">
            Privacy Policy
          </Link>
        </span>
        |
        <span>
          <Link class="disclaimer" to="/disclaimer">
            Disclaimer
          </Link>
        </span>
      </div>
      <div class="copyright">
        Copyright &copy; 2021 code.allan | All rights Reserved
      </div>
    </section>
  );
};

export default Footer;
