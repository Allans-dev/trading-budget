import React, { useEffect } from "react";

import "./disclaimer_styles.css";

const Disclaimer = () => {
  useEffect(() => {
    const OAuthUI = document.getElementById("OAuthUI");

    OAuthUI.innerHTML = null;
  }, []);

  return (
    <article className="disclaimer-page">
      <div className="disclaimer-block">
        <h2>Disclaimer</h2>
        <span>
          The information on this website is for general information only. It
          should not be taken as constituting professional advice from the
          website owner – code.allan
        </span>
        <span>
          Code.allan is not a financial adviser. You should consider seeking
          independent legal, financial, taxation or other advice to check how
          the website information relates to your unique circumstances.
        </span>
        <span>
          Code.allan is not liable for any loss caused, whether due to
          negligence or otherwise arising from the use of, or reliance on, the
          information provided directly or indirectly, by use of this website.
        </span>
        <span>Our website address is: tradingbudget.web.app</span>
      </div>
    </article>
  );
};
export default Disclaimer;
