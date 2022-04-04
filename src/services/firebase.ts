import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth" // New import
import { getDatabase, ref, push, get, onValue, off, remove, update } from "firebase/database";

const firebaseConfig = {

    apiKey: process.env.REACT_APP_API_KEY,
  
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  
    projectId: process.env.REACT_APP_PROJECT_ID,
  
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  
    appId: process.env.REACT_APP_APP_ID,
  
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  
  };

const firebase = initializeApp(firebaseConfig);

const auth = getAuth(firebase);
const database = getDatabase(firebase);

export { update, remove, off, onValue, get, push, ref, auth, database, GoogleAuthProvider, signInWithPopup }