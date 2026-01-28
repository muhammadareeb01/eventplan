import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxpUsXBBhzPoZ-RFHfghsFyoopVLoYHos",
  authDomain: "eventplan-47374.firebaseapp.com",
  projectId: "eventplan-47374",
  storageBucket: "eventplan-47374.firebasestorage.app",
  messagingSenderId: "678373205697",
  appId: "1:678373205697:web:ee907b4833cefc1a03d640",
  measurementId: "G-CGGR3RF3Y5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
// Analytics only works in the browser
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
