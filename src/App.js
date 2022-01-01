import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, matchPath } from "react-router-dom";

import Landing from "./components/Landing/Landing";
import Stocks from "./components/Stocks/Stocks";
import Budget from "./components/Budget/Budget";
import Analysis from "./components/Analysis/Analysis";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

import RingLoader from "react-spinners/RingLoader";

import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer/Disclaimer";

import { StateProvider } from "./main-store";
import { StockStateProvider } from "./components/Stocks/stocks-store";
import { BudgetStateProvider } from "./components/Budget/budget-store";

import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";

import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const firebaseConfig = {
  apiKey: "AIzaSyC238mryUvNxq4lScBrGNHL9dAjjHHPs4Q",
  authDomain: "tradingbudget.firebaseapp.com",
  projectId: "tradingbudget",
  storageBucket: "tradingbudget.appspot.com",
  messagingSenderId: "480429604058",
  appId: "1:480429604058:web:7806497078f4244bff39e3",
  measurementId: "G-555NFL2FQE",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

// const db = firebase.firestore();

const App = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());

  const policyMatch = matchPath("/logged-out-privacy-policy", {
    path: window.location.href,
    exact: true,
  });

  const disclaimerMatch = matchPath("/disclaimer", {
    path: window.location.href,
    exact: true,
  });

  const homeMatch = matchPath("/", {
    path: window.location.href,
    exact: true,
  });

  useEffect(() => {
    if (
      authStatus === false &&
      policyMatch === null &&
      disclaimerMatch === null &&
      typeof homeMatch === "object" &&
      isLoading === false
    ) {
      ui.start("#firebaseui-auth-container", uiConfig);
    } else ui.reset();
  }, [authStatus, isLoading]);

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // {
      //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //   signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      // },
      // {
      //   provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      //   recaptchaParameters: {
      //     type: "image", // 'audio'
      //     size: "normal", // 'invisible' or 'compact'
      //     badge: "bottomleft", //' bottomright' or 'inline' applies to invisible.
      //   },
      //   defaultCountry: "AU",
      // },
    ],
    // Terms of service url.
    tosUrl: "/logged-out-disclaimer",
    // Privacy policy url.
    privacyPolicyUrl: "/logged-out-privacy-policy",
  };

  const signInAnon = () => {
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        throw new Error(errorCode + ": " + errorMessage);
        // ...
      });
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setAuthStatus(true);
      setIsLoading((prev) => false);
    } else if (!user) {
      setAuthStatus(false);
      setIsLoading((prev) => false);
      // }
    } else {
      throw new Error("error");
    }
  });

  if (isLoading) {
    return (
      <article className="loader-background">
        <RingLoader color={"#4e4e4e"} loading={isLoading} size={100} />
      </article>
    );
  }

  return authStatus ? (
    <StateProvider>
      <article className="root">
        <Router>
          <Header />

          <Route exact path="/privacy-policy">
            <PrivacyPolicy />
          </Route>

          <Route exact path="/disclaimer">
            <Disclaimer />
          </Route>

          <StockStateProvider>
            <BudgetStateProvider>
              <Route exact path="/">
                <Landing />
              </Route>
              <Route exact path="/stocks">
                <Stocks />
              </Route>
              <Route exact path="/budget">
                <Budget />
              </Route>
              <Route exact path="/analysis">
                <Analysis />
              </Route>
            </BudgetStateProvider>
          </StockStateProvider>

          <Footer />
        </Router>
      </article>
    </StateProvider>
  ) : (
    <article className="root" id="login">
      <Router>
        {policyMatch === null && disclaimerMatch === null ? (
          <>
            <button className="anon-sign-btn" onClick={signInAnon}>
              Guest Sign In
            </button>
            <div id="firebaseui-auth-container"></div>
          </>
        ) : null}

        <Route exact path="/logged-out-privacy-policy">
          <PrivacyPolicy />
        </Route>

        <Route exact path="/logged-out-disclaimer">
          <Disclaimer />
        </Route>
      </Router>
    </article>
  );
};

export default App;
