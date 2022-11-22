// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyx3Bdsa7jICYdqNDKBDxJfw2uW13xl9Y",
  authDomain: "todo-c1e0d.firebaseapp.com",
  projectId: "todo-c1e0d",
  storageBucket: "todo-c1e0d.appspot.com",
  messagingSenderId: "1092704539925",
  appId: "1:1092704539925:web:cc996cf2c7afe52e1e451c",
  measurementId: "G-G1MKLC1MFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage =getStorage();
const analytics = getAnalytics(app);