import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDeByznOnpfKJa_e_vbvkug_kBS_IWQN0Q",
  authDomain: "think-piece-e9bad.firebaseapp.com",
  databaseURL: "https://think-piece-e9bad.firebaseio.com",
  projectId: "think-piece-e9bad",
  storageBucket: "think-piece-e9bad.appspot.com",
  messagingSenderId: "135893116467",
  appId: "1:135893116467:web:87fb2e2f21d8785f616546"
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const signInWithGoogle = () => auth.signInWithPopup(googleAuthProvider);
export const signOut = () => auth.signOut();
export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return null;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();

    try {
      await userRef.set({
        uid: user.uid,
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  return getUserDocument(user.uid);
};

export const getUserDocument = uid => {
  if (!uid) return null;

  try {
    return firestore.doc(`users/${uid}`);
  } catch (e) {
    console.error(e);
  }
};

firestore.settings({ timestampsInSnapshots: true });

export default firebase;
