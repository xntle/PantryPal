// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClStwur5tK1cGzSgdh00N0D8QoH3aOTUA",
  authDomain: "inventory-management-49254.firebaseapp.com",
  projectId: "inventory-management-49254",
  storageBucket: "inventory-management-49254.appspot.com",
  messagingSenderId: "929465171573",
  appId: "1:929465171573:web:5645935796b58cb998823c",
  measurementId: "G-VX9QHVTZQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export {firestore, storage}