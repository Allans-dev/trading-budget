import { firebaseConfig } from '../firebase.config';

import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;

export const googleAuth = () => {
  auth.useDeviceLanguage();
  const googleProvider = new GoogleAuthProvider();

  signInWithRedirect(auth, googleProvider);

  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      currentUser = result.user.uid;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log('signed in');
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      console.log(errorMessage);
    });
};

export const boolUser = () => {
  return currentUser ? true : false;
};

export const authSignOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log('signed out');
    })
    .catch((error) => {
      // An error happened.
    });
};

export const readFromDb = async () => {
  try {
    const databaseState = await getDoc(doc(db, 'user', currentUser)).data;
    console.log(`read state`);
    return databaseState;
  } catch (e) {
    console.error('Error reading document: ', e);
  }
};

export const writeToDb = async (state) => {
  try {
    await setDoc(doc(db, 'user', currentUser), state, {
      merge: true,
    });
    console.log(`saved state`);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
