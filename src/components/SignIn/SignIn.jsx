import firebase from "firebase/app";
import "firebase/firestore";

import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";

const SignIn = ({
  policyMatch,
  signInAnon,
  uiConfig,
  authStatus,
  isLoading,
}) => {
  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());

  useEffect(() => {
    document.getElementById("firebaseui-auth-container")
      ? ui.start("#firebaseui-auth-container", uiConfig)
      : ui.reset();
  });

  return (
    <section
      id="signInSection"
      style={{
        display:
          policyMatch !== null && policyMatch.isExact === true
            ? "none"
            : "block",
      }}
    >
      <button className="anon-sign-btn" onClick={signInAnon}>
        Guest Sign In
      </button>
      <div id="firebaseui-auth-container"></div>
    </section>
  );
};

export default SignIn;
