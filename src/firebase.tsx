// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyNgMOXsysAGDm7SdhTjWbSzRuWefEUrw",
  authDomain: "planner-fb0a8.firebaseapp.com",
  projectId: "planner-fb0a8",
  storageBucket: "planner-fb0a8.firebasestorage.app",
  messagingSenderId: "192417973389",
  appId: "1:192417973389:web:f0e28a608c97df10298ec4",
  measurementId: "G-3E3QFN8NLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = app.firestore();

