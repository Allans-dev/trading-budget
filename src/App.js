import React, { useState } from 'react';
import { BrowserRouter as Router, Route, matchPath } from 'react-router-dom';

import Landing from './components/Landing';
import Stocks from './components/Stocks';
import Budget from './components/Budget';
import Analysis from './components/Analysis';

import Footer from './components/Footer';
import Header from './components/Header';

import RingLoader from 'react-spinners/RingLoader';

import SignIn from './components/SignIn';

import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import Disclaimer from './components/Disclaimer/Disclaimer';

import { StateProvider } from './main-store';
import { StockStateProvider } from './components/Stocks/stocks-store';
import { BudgetStateProvider } from './components/Budget/budget-store';

import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { firebaseConfig } from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const App = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const signOut = () => setAuthStatus((current) => false);

  firebase.auth().useDeviceLanguage();

  const policyMatch = matchPath('/logged-out-privacy-policy', {
    path: window.location.pathname,
  });

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
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'normal', // 'invisible' or 'compact'
          badge: 'bottomleft', //' bottomright' or 'inline' applies to invisible.
        },
        defaultCountry: 'AU',
      },
    ],
    // Terms of service url.
    tosUrl: '/logged-out-disclaimer',
    // Privacy policy url.
    privacyPolicyUrl: '/logged-out-privacy-policy',
  };

  const signInAnon = () => {
    setIsLoading((prev) => true);
    firebase
      .auth()
      .signInAnonymously()
      .then(() => setIsLoading((prev) => false))
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        throw new Error(errorCode + ': ' + errorMessage);
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
      throw new Error('error');
    }
  });

  if (isLoading) {
    return (
      <article className='loader-background'>
        <RingLoader color={'#4e4e4e'} loading={isLoading} size={100} />
      </article>
    );
  }

  return authStatus ? (
    <article className='root'>
      <Router>
        <Header signOut={signOut} />

        <Route exact path='/privacy-policy'>
          <PrivacyPolicy />
        </Route>

        <Route exact path='/disclaimer'>
          <Disclaimer />
        </Route>
        <StateProvider>
          <StockStateProvider>
            <BudgetStateProvider>
              <Route exact path='/'>
                <Landing />
              </Route>
              <Route exact path='/stocks'>
                <Stocks />
              </Route>
              <Route exact path='/budget'>
                <Budget />
              </Route>
              <Route exact path='/analysis'>
                <Analysis />
              </Route>
            </BudgetStateProvider>
          </StockStateProvider>
        </StateProvider>

        <Footer />
      </Router>
    </article>
  ) : (
    <Router>
      <article className='root' id='login'>
        <Route path='/'>
          <SignIn
            policyMatch={policyMatch}
            signInAnon={signInAnon}
            authStatus={authStatus}
            uiConfig={uiConfig}
            isLoading={isLoading}
          />
        </Route>

        <Route exact path='/logged-out-privacy-policy'>
          <PrivacyPolicy />
        </Route>

        <Route exact path='/logged-out-disclaimer'>
          <Disclaimer />
        </Route>
      </article>
    </Router>
  );
};

export default App;
