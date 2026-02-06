// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Make them available to app.js
export const auth = getAuth(app);
export const db = getFirestore(app);
