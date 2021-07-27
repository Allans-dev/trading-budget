import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Stocks from "./components/stocksPage/Stocks";
import Budget from "./components/budgetPage/Budget";

import Footer from "./components/Footer";
import Header from "./components/Header";

import { StateProvider } from "./components/main-store";

import { StockStateProvider } from "./components/stocksPage/stocks-store";
import { BudgetStateProvider } from "./components/budgetPage/budget-store";

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

const db = firebase.firestore();

const App = () => {
  const [authStatus, setAuthStatus] = useState(false);

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
        document.getElementById("loader").style.display = "none";
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
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in.
      const docRef = db.collection("users").doc(user.uid);
      await docRef.set(
        {
          displayName: user.displayName,
          email: user.email,
        },
        { merge: true }
      );
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  return authStatus ? (
    <StateProvider>
      <article class={"root"}>
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

          <Route exact path="/">
            <Landing />
          </Route>
          <Footer />
        </Router>
      </article>
    </StateProvider>
  ) : (
    <article class={"root"}>
      <div id="loader">Loading...</div>
      <div id="firebaseui-auth-container"></div>
    </article>
  );
};

// const width =
//   window.innerWidth ||
//   document.documentElement.clientWidth ||
//   document.body.clientWidth;

// const height =
//   window.innerHeight ||
//   document.documentElement.clientHeight ||
//   document.body.clientHeight;

// const styles = {
//   root: {
//     // maxWidth: width,
//     // maxHeight: height,
//   },
// };

export default App;
