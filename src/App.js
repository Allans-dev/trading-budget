import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, matchPath } from "react-router-dom";

import Landing from "./components/Landing/Landing";
import Stocks from "./components/Stocks/Stocks";
import Budget from "./components/Budget/Budget";
import Analysis from "./components/Analysis/Analysis";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
// import SignIn from "./components/SignIn/SignIn";

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

  const privacyMatch = matchPath("/logged-out-privacy-policy", {
    path: window.location.href,
    exact: true,
  });

  const disclaimerMatch = matchPath("/logged-out-disclaimer", {
    path: window.location.href,
    exact: true,
  });

  const homeMatch = matchPath("/", {
    path: window.location.href,
    exact: true,
  });

  const signInAnon = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": " + errorMessage);
        // ...
      });
  };

  useEffect(() => {
    if (
      (privacyMatch === null && typeof homeMatch === "object") ||
      (disclaimerMatch === null && typeof homeMatch === "object")
    ) {
      OAuthUI.insertAdjacentHTML("beforeend", googleLoginUI);

      ui.start("#firebaseui-auth-container", uiConfig);
    } else OAuthUI.innerHTML = null;
  }, [authStatus]);

  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());

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

  const googleLoginUI = '<div id="firebaseui-auth-container"></div>';
  const OAuthUI = document.getElementById("OAuthUI");

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in.
      // const docRef = db.collection("users").doc(user.uid);
      // await docRef.set(
      //   {
      //     displayName: user.displayName,
      //     email: user.email,
      //   },
      //   { merge: true }
      // );
      OAuthUI.innerHTML = null;
      setAuthStatus(true);
      setIsLoading(false);
    } else if (!user) {
      setAuthStatus(false);
      setIsLoading(false);

      // document.getElementById("#firebaseui-auth-container")
      //   ? ui.reset()
      //   :

      // if (document.getElementById("firebaseui-auth-container")) {
      //   ui.start("#firebaseui-auth-container", uiConfig);
      //   ui.reset();
      // } else if (document.getElementById("login")) {
      //   // document
      //   //   .getElementById("login")
      //   //   .insertAdjacentHTML(
      //   //     "beforeend",
      //   //     "<div id='firebaseui-auth-container'></div>"
      //   //   );
      //   ui.start("#firebaseui-auth-container", uiConfig);
      // }
    } else {
      setIsLoading(true);
      console.log("error");
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
      <article id="withinApp">
        <Router>
          <Header />

          <BudgetStateProvider>
            <Route exact path="/budget">
              <Budget />
            </Route>
          </BudgetStateProvider>

          <StockStateProvider>
            <Route exact path="/stocks">
              <Stocks />
            </Route>
          </StockStateProvider>

          <StockStateProvider>
            <BudgetStateProvider>
              <Route exact path="/analysis">
                <Analysis />
              </Route>
            </BudgetStateProvider>
          </StockStateProvider>

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
            </BudgetStateProvider>
          </StockStateProvider>

          <Footer />
        </Router>
      </article>
    </StateProvider>
  ) : (
    <Router>
      <article id="landing">
        <Route path="/">
          <button className="anon-sign-btn" onClick={signInAnon}>
            Guest Sign In
          </button>
        </Route>
        <Route exact path="/logged-out-privacy-policy">
          <PrivacyPolicy />
        </Route>

        <Route exact path="/logged-out-disclaimer">
          <Disclaimer />
        </Route>
      </article>
    </Router>
  );
};

export default App;
