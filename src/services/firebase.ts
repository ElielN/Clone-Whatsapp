import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth" // New import
import { push, get, off, remove, update, set } from "firebase/database";
import { doc, setDoc, getDoc, getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {

    apiKey: process.env.REACT_APP_API_KEY,
  
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  
    projectId: process.env.REACT_APP_PROJECT_ID,
  
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  
    appId: process.env.REACT_APP_APP_ID,
  
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  
  };

const firestore = initializeApp(firebaseConfig);

const auth = getAuth(firestore);
const database = getFirestore(firestore);

export { update, remove, off, set, doc, setDoc, getDoc, get, push, auth, database, GoogleAuthProvider, signInWithPopup }