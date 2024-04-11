const { child, push, ref, set, onValue, update } = require("firebase/database");
const ClassRoomEntity = require("../entities/RoomEntity");

class RoomModel {
  constructor({ database }) {
    this.database = database;
  }
  async createRoom({ userId }) {
    const dbRef = push(child(ref(this.database), "rooms"));
    const key = dbRef.key;
    const e = new ClassRoomEntity({
      uid: key,
      roomId: key,
      members: [userId],
      isGaming: false,
    });
    const snapshot = e.snapshot();
    await set(dbRef, snapshot);
    return snapshot;
  }
  async readRoom({ roomId }) {
    return new Promise((resolve) => {
      const dbRef = child(child(ref(this.database), "rooms"), roomId);
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
  async updateRoom({ roomId, updates }) {
    const dbRef = child(child(ref(this.database), "rooms"), roomId);
    await update(dbRef, updates);
    return await this.readRoom({ roomId });
  }
  async onRoomMemberAdd({ roomId, userId }) {
    const room = await this.readRoom({ roomId });
    const roomEntity = new ClassRoomEntity(room);

    roomEntity.memberAdd({ userId });

    return this.updateRoom({
      roomId,
      updates: roomEntity.snapshot(),
    });
  }
  async onRoomGameStart({ roomId }) {
    const room = await this.readRoom({ roomId });
    const roomEntity = new ClassRoomEntity(room);

    roomEntity.gameStart();

    return this.updateRoom({
      roomId,
      updates: roomEntity.snapshot(),
    });
  }
  async onRoomMemberLeave({ roomId, userId }) {
    const room = await this.readRoom({ roomId });
    const roomEntity = new ClassRoomEntity(room);

    roomEntity.memberLeave({ userId });

    return this.updateRoom({
      roomId,
      updates: roomEntity.snapshot(),
    });
  }
}

module.exports = RoomModel;
