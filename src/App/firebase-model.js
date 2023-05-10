import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { firebaseConfig } from '../firebase.config';

export const firebaseModel = (setAuthStatus, setIsLoading) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  firebase.auth().useDeviceLanguage();

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
};

export const uiConfig = {
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

export const signInAnon = (setIsLoading) => {
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
