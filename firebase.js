// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmDwco5xcX-HAWN6DyOljt97yH57EjtyA",
  authDomain: "inventory-management-337a8.firebaseapp.com",
  projectId: "inventory-management-337a8",
  storageBucket: "inventory-management-337a8.appspot.com",
  messagingSenderId: "1091901669533",
  appId: "1:1091901669533:web:8ce76e6b90b5b1a64f9474",
  measurementId: "G-NZJZ1NHFY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };