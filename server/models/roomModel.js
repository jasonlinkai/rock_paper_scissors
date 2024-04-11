const { child, push, ref, set, onValue } = require("firebase/database");
const { serverRoomToClientRoom } = require("../utils/adaptors");

module.exports = (database) => {
  const createRoom = async () => {
    const dbRef = push(child(ref(database), "rooms"));
    const key = dbRef.key;
    const payload = {
      uid: key,
    };
    await set(dbRef, payload);
    return serverRoomToClientRoom(payload);
  };
  const readRoom = async ({ roomId }) => {
    const dbRef = child(child(ref(database), "rooms"), roomId);
    return new Promise((resolve) => {
      onValue(dbRef, function (snapshot) {
        const val = snapshot.val();
        if (val) {
          resolve(serverRoomToClientRoom(val)) 
        } else {
          resolve(null);
        }
      });
    });
  };
  return {
    createRoom,
    readRoom,
  };
};
