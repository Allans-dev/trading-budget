import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const docRef = db.collection("users").doc(user.uid);
await docRef.set({
  displayName: user.displayName,
  email: user.email,
});
