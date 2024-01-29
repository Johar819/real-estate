// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c26b1.firebaseapp.com",
  projectId: "mern-estate-c26b1",
  storageBucket: "mern-estate-c26b1.appspot.com",
  messagingSenderId: "957528153264",
  appId: "1:957528153264:web:a9730ef7bf9956bffd2f75"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);