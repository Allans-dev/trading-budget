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
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const googleAuthSignIn = () => {
  auth.useDeviceLanguage();
  signInWithRedirect(auth, new GoogleAuthProvider());
};

export const anonAuth = (accessReadFromDb) => {
  signInAnonymously(auth)
    .then((result) => {
      if (result.user) {
        accessReadFromDb();
      } else return;
    })
    .catch((error) => {
      throw new Error(error.message);
      // ...
    });
};

export const firebaseSignOut = (toggleAuthStatus) => {
  signOut(auth)
    .then(() => {
      toggleAuthStatus(false);
      console.log('signed out');
    })
    .catch(() => {
      throw new Error(`unable to sign out`);
    });
};

export const readFromDb = async () => {
  try {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const databaseState = docSnap.data();
      return databaseState;
    } else {
      throw new Error('No such document!');
    }
  } catch (e) {
    throw new Error('Error reading document: ', e);
  }
};

export const writeToDb = async (state) => {
  try {
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, auth.currentUser.uid), state, { merge: true });
  } catch (e) {
    throw new Error('Error adding document: ', e);
  }
};

export const googleAuthStateChange = (accessReadFromDb, toggleLoading) => {
  toggleLoading(true);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      accessReadFromDb();
    }
  });
};
