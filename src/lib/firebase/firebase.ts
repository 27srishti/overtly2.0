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
  apiKey: "AIzaSyCjYy_RraVW2Hf0sBsgeSnUK8_xDSD6wgY",
  authDomain: "pr-ai-99.firebaseapp.com",
  projectId: "pr-ai-99",
  storageBucket: "pr-ai-99.appspot.com",
  messagingSenderId: "87008435117",
  appId: "1:87008435117:web:65e8ba2e71d39a857fdf24",
  measurementId: "G-MBRGDSTQWG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const drive = {
  GOOGLE_CLIENT_ID: "179570525467-k0aj1jv4io9oni0obl4q1ckaamqbihf6.apps.googleusercontent.com",
  GOOGLE_API_KEY: "AIzaSyCT_lsDdCC6dhNe1oL4ycEkxQFG5Yqvlbg",
}