import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from "./components/Landing";
import AddShares from "./components/Stocks";
import AddSavings from "./components/Analysis";
import Budget from "./components/Budget";

import Footer from "./components/Footer";
import Header from "./components/Header";

import { StateProvider } from "./components/store";

import "./App.css";

import firebase from "firebase/app";
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

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());
  const user = firebase.auth().currentUser;

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log("==================================");
        console.log(authResult.credential.accessToken);
        console.log(authResult.user);
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
    signInSuccessUrl: "tradingbudget.web.app",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: "image", // 'audio'
          size: "normal", // 'invisible' or 'compact'
          badge: "bottomleft", //' bottomright' or 'inline' applies to invisible.
        },
        defaultCountry: "AU",
      },
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      setLoggedIn(true);
      console.log(user);
    } else {
      setLoggedIn(false);
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  console.log(loggedIn);

  return loggedIn ? (
    <StateProvider>
      <Router style={styles.root}>
        <Header />
        <Switch>
          <Route path="/stocks">
            <AddShares />
          </Route>
          <Route path="/budget">
            <Budget />
          </Route>
          <Route path="/analysis">
            <AddSavings />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </StateProvider>
  ) : (
    // No user is signed in.
    <div>
      <div id="loader">Loading...</div>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const styles = {
  root: {
    maxWidth: width,
  },
};

export default App;
