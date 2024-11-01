// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDYdlekvtRlMWxBb-FpB9pfi1s3sRt1MJQ",
    authDomain: "pet-dating-5bb59.firebaseapp.com",
    projectId: "pet-dating-5bb59",
    storageBucket: "pet-dating-5bb59.firebasestorage.app",
    messagingSenderId: "744428121760",
    appId: "1:744428121760:web:5d9d72d2f05297ba2523c5"
  };


  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app); // Initialize Firestore