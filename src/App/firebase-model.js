import { firebaseConfig } from '../firebase.config';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  collection,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const googleAuthSignIn = async () => {
  auth.useDeviceLanguage();
  signInWithRedirect(auth, new GoogleAuthProvider());
};

export const googleRedirectResults = (signInAuth, accessReadFromDb) => {
  getRedirectResult(auth)
    .then((result) => {
      return result.user.uid;
    })
    .then((uid) => {
      if (uid) {
        signInAuth();
        accessReadFromDb();
      } else {
        console.log(`failed to retrieve uid`);
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const anonAuth = (signInAuth, accessReadFromDb) => {
  signInAnonymously(auth)
    .then((result) => {
      console.log(result.user.uid);
      signInAuth();
      accessReadFromDb();
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
};

export const firebaseSignOut = (signOutAuth) => {
  signOut(auth)
    .then((result) => {
      signOutAuth();
      console.log('signed out');
    })
    .catch((error) => {});
};

export const readFromDb = async () => {
  try {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const databaseState = docSnap.data();
      return databaseState;
    } else {
      console.log('No such document!');
    }
  } catch (e) {
    console.error('Error reading document: ', e);
  }
};

export const writeToDb = async (state) => {
  try {
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, auth.currentUser.uid), state, { merge: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
