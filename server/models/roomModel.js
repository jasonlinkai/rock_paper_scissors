const { child, push, ref, set } = require("firebase/database");
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
  return {
    createRoom,
  };
}
