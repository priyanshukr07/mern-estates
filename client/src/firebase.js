import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estates-7.firebaseapp.com",
  projectId: "mern-estates-7",
  storageBucket: "mern-estates-7.appspot.com",
  messagingSenderId: "642095422682",
  appId: "1:642095422682:web:0e91f8444fb7bf034819e3"
};

export const app = initializeApp(firebaseConfig);