// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq8fPAYEDmlnSWzZtuXY0AxK2oz5bR5XQ",
  authDomain: "ph03nix-valentine.firebaseapp.com",
  projectId: "ph03nix-valentine",
  storageBucket: "ph03nix-valentine.firebasestorage.app",
  messagingSenderId: "513393274812",
  appId: "1:513393274812:web:9dcd2c04e139c2e62e85b9",
  measurementId: "G-LM4F12NEXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
