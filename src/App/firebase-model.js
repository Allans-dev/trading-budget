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

export const googleAuthSignIn = (signInAuth) => {
  auth.useDeviceLanguage();
  const googleProvider = new GoogleAuthProvider();

  signInWithRedirect(auth, googleProvider)
    .then((result) => {
      signInAuth();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage);
    });
};

// export const googleRedirectResults = () => {
//   getRedirectResult(auth)
//     .then((result) => {
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       const user = result.user;
//       console.log(result.user.uid);
//       return user.uid;
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       // const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       // const email = error.customData.email;
//       // The AuthCredential type that was used.
//       // const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...

//       console.log(errorMessage);
//     });
// };

export const anonAuth = (signInAuth, accessReadFromDb) => {
  signInAnonymously(auth)
    .then((result) => {
      console.log(result.user.uid);
      signInAuth();
      accessReadFromDb();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
};

export const firebaseSignOut = (signOutAuth) => {
  signOut(auth)
    .then((result) => {
      // Sign-out successful.
      signOutAuth();
      console.log('signed out');
    })
    .catch((error) => {
      // An error happened.
    });
};

export const readFromDb = async () => {
  try {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const databaseState = docSnap.data();
      console.log('Document data:', databaseState);
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
    console.log(`saved state`);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
