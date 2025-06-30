import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdP1JXGjvxN62mqHR0fNmu_sqHCNb8fqw",
  authDomain: "cohesive-amp-402814.firebaseapp.com",
  projectId: "cohesive-amp-402814",
  storageBucket: "cohesive-amp-402814.appspot.com",
  messagingSenderId: "747367454232",
  appId: "1:747367454232:web:ce5588c18e5fd9ae5c156d",
  measurementId: "G-6ZJZJZJZJZ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Storage
const storage = getStorage(app);

export { app, storage };