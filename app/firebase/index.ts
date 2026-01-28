import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAGbvVLYbkVPp50k6dbO8X7qpwwSLUED9k",
  authDomain: "omcc-5f0b2.firebaseapp.com",
  databaseURL:
    "https://omcc-5f0b2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "omcc-5f0b2",
  storageBucket: "omcc-5f0b2.firebasestorage.app",
  messagingSenderId: "161212442792",
  appId: "1:161212442792:web:1533adfb09d47b7750ba9d",
  measurementId: "G-QJ3207HWPD",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
// connect to emulators when running in dev mode only

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, window.location.hostname, 8080);
  connectAuthEmulator(auth, `http://${window.location.hostname}:9099`);
  connectStorageEmulator(storage, window.location.hostname, 9199);
  connectDatabaseEmulator(realtimeDb, window.location.hostname, 9000);
}
