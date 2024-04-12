const firebase = require("firebase/database");
const { child, push, ref, set, onValue } = firebase;

class RoomModel {
  constructor({ database }) {
    this.database = database;
  }
  async create(snapshot) {
    const dbRef = push(child(ref(this.database), "rooms"));
    const uid = dbRef.key;
    const mergedSnapshot = {
      ...snapshot,
      uid,
    };
    await set(dbRef, mergedSnapshot);
    return mergedSnapshot;
  }
  async read(uid) {
    return new Promise((resolve) => {
      const dbRef = child(child(ref(this.database), "rooms"), uid);
      onValue(dbRef, function (snapshot) {
        const val = snapshot.val();
        if (val) {
          resolve(val);
        } else {
          resolve(null);
        }
      });
    });
  }
  async update(snapshot) {
    const dbRef = child(child(ref(this.database), "rooms"), snapshot.uid);
    await firebase.update(dbRef, snapshot);
    return snapshot;
  }
}

module.exports = RoomModel;
