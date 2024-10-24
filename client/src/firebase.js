import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estates-07-df43a.firebaseapp.com",
  projectId: "mern-estates-07-df43a",
  storageBucket: "mern-estates-07-df43a.appspot.com",
  messagingSenderId: "788887008195",
  appId: "1:788887008195:web:62d839cd995784c223c376"
};

export const app = initializeApp(firebaseConfig);