import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 YOUR FIREBASE CONFIG (replace this)
const firebaseConfig = {
  apiKey: "AIzaSyA7QalpI0BpOsa_n8yo0LZJtxTANGwaqiQ",
  authDomain: "bloxdstudios-64c5c.firebaseapp.com",
  projectId: "bloxdstudios-64c5c",
  storageBucket: "bloxdstudios-64c5c.firebasestorage.app",
  messagingSenderId: "249633308553",
  appId: "1:249633308553:web:db796690613e1c48cbab58",
  measurementId: "G-5GRGWGTK19"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// AUTH EXPORTS
export {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
doc,
setDoc,
getDoc,
collection,
addDoc,
getDocs,
updateDoc
};
