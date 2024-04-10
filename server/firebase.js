const path = require("path");
const configPathes = [
  path.resolve("server", ".env.local"),
  path.resolve("server", ".env"),
];
require("dotenv").config({ path: configPathes });
const { initializeApp } = require("firebase/app");
const { child, getDatabase, push, ref, set } = require("firebase/database");
const { serverRoomToClientRoom } = require("./utils/adaptors");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const createRoom = async () => {
  const dbRef = push(child(ref(database), "rooms"));
  const key = dbRef.key;
  const payload = {
    uid: key,
  };
  await set(dbRef, payload);
  return serverRoomToClientRoom(payload);
};

module.exports = {
  app,
  database,
  models: {
    room: {
      createRoom,
    },
  },
}