import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectDatabaseEmulator,
  child,
  getDatabase,
  push,
  ref,
  set,
} from "firebase/database";
import { serverRoomToClientRoom } from "./utils/adaptors";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth(app);
const database = getDatabase(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectDatabaseEmulator(database, "127.0.0.1", 9000);
}


export const createRoom = async () => {
  const dbRef = push(child(ref(database), "rooms"));
  const key = dbRef.key;
  const payload = {
    uid: key,
  }
  await set(dbRef, payload);
  return serverRoomToClientRoom(payload);
};
