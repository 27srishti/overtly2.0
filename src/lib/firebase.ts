// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWXpeZd3kr4ZjyatN3CXfACIyRH3Ni2PA",
  authDomain: "pr-001-f724c.firebaseapp.com",
  projectId: "pr-001-f724c",
  storageBucket: "pr-001-f724c.appspot.com",
  messagingSenderId: "484989195752",
  appId: "1:484989195752:web:c233582ff5a33b897d405d",
  measurementId: "G-1PN65V68NK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);