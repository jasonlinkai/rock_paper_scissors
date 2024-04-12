const ClassRoomEntity = require("../entities/RoomEntity");
const { newMessage } = require("../utils/message");
const {
  EVENTS,
  MSG_TYPES,
  RAISE_TYPES_TEXT,
} = require("../../shared-utils/constants");
const { computedRockPaperScissorsResult } = require("../../shared-utils/result");

class RoomController {
  constructor({ app, roomModel, gameModel, io }) {
    this.app = app;
    this.roomModel = roomModel;
    this.gameModel = gameModel;
    this.io = io;
    this.registerRoute(app, roomModel);
  }
  memberAdd({ roomId, userId }) {
    return async () => {
      const roomEntity = await this._getEntityByRoomId(roomId);
      roomEntity.memberAdd({ userId });
      const newSnapshot = await this._saveEntity(roomEntity);
      this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            msgType: MSG_TYPES.SYSTEM_TEXT,
            message: `${userId}加入房間`,
          },
        })
      );
    };
  }
  messageAdd({ roomId, senderId, message }) {
    return () => {
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            senderId,
            msgType: MSG_TYPES.TEXT,
            message,
          },
        })
      );
    };
  }
  memberLeave({ roomId, userId }) {
    return async () => {
      const roomEntity = await this._getEntityByRoomId(roomId);
      roomEntity.memberLeave({ userId });
      const newSnapshot = await this._saveEntity(roomEntity);
      this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            msgType: MSG_TYPES.SYSTEM_TEXT,
            message: `${userId}離開房間`,
          },
        })
      );
      if (newSnapshot.locked) {
        await this.forceGameEnd({ roomId, userId, roomEntity });
      }
    };
  }
  gameStart({ roomId }) {
    return async () => {
      const roomEntity = await this._getEntityByRoomId(roomId);
      roomEntity.resetGame();
      roomEntity.gameStart();
      const newSnapshot = await this._saveEntity(roomEntity);
      this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.GAME_STARTED,
        })
      );
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            msgType: MSG_TYPES.SYSTEM_TEXT,
            message: `遊戲開始!請出拳~`,
          },
        })
      );
    };
  }
  memberRaise({ roomId, userId, raise, socketId }) {
    return async () => {
      const roomEntity = await this._getEntityByRoomId(roomId);
      roomEntity.memberRaise({ userId, raise });
      const newSnapshot = await this._saveEntity(roomEntity);
      this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });
      this.io.to(socketId).emit(
        "message",
        newMessage({
          type: EVENTS.MEMBER_RAISED,
          data: {
            userId,
            raise,
          },
        })
      );
      this.io.to(roomId).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            msgType: MSG_TYPES.SYSTEM_TEXT,
            message: `${userId}已經出好了!`,
          },
        })
      );
      if (newSnapshot.raisedIds.length === newSnapshot.userIds.length) {
        await this.gameEnd({ roomId, roomEntity, snapshot: newSnapshot });
      }
    };
  }
  async gameEnd({ roomId, roomEntity, snapshot }) {
    roomEntity.resetGame();
    const newSnapshot = await this._saveEntity(roomEntity);
    this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });

    const { uid, userIds, raisedIds, raisedRecord } = snapshot;
    userIds.forEach((userId) => {
      const raise = raisedRecord[userId];
      this.io.to(uid).emit(
        "message",
        newMessage({
          type: EVENTS.MESSAGE_ADDED,
          data: {
            msgType: MSG_TYPES.SYSTEM_TEXT,
            message: `${userId}出了${RAISE_TYPES_TEXT[raise]}!`,
          },
        })
      );
    });
    this.io.to(uid).emit(
      "message",
      newMessage({
        type: EVENTS.MESSAGE_ADDED,
        data: {
          msgType: MSG_TYPES.SYSTEM_TEXT,
          message: computedRockPaperScissorsResult(raisedRecord, raisedIds),
        },
      })
    );
    this.io.to(uid).emit(
      "message",
      newMessage({
        type: EVENTS.GAME_ENDED,
      })
    );
  }
  async forceGameEnd({ roomId, userId, roomEntity }) {
    roomEntity.resetGame();
    const newSnapshot = await this._saveEntity(roomEntity);
    this._notifyRoomUpdate({ roomId, snapshot: newSnapshot });

    this.io.to(roomId).emit(
      "message",
      newMessage({
        type: EVENTS.MESSAGE_ADDED,
        data: {
          msgType: MSG_TYPES.SYSTEM_TEXT,
          message: `遊戲提早結束，由於${userId}逃走了~`,
        },
      })
    );
    this.io.to(roomId).emit(
      "message",
      newMessage({
        type: EVENTS.GAME_ENDED,
      })
    );
  }
  registerRoute(app, roomModel) {
    app.post("/create-room", async function (req, res) {
      const data = await roomModel.create({
        userIds: [req.body.userId],
      });
      res.json(data);
    });

    app.post("/enter-room", async function (req, res) {
      const data = await roomModel.read(req.body.roomId);
      res.json(data);
    });
  }
  async _getEntityByRoomId(roomId) {
    const snapshot = await this.roomModel.read(roomId);
    return new ClassRoomEntity(snapshot);
  }
  async _saveEntity(roomEntity) {
    const newSnapshot = roomEntity.snapshot();
    await this.roomModel.update(newSnapshot);
    return newSnapshot;
  }
  _notifyRoomUpdate({ roomId, snapshot }) {
    const s = JSON.parse(JSON.stringify(snapshot));
    delete s.raisedRecord;
    this.io.to(roomId).emit(
      "message",
      newMessage({
        type: EVENTS.ROOM_UPDATED,
        data: s,
      })
    );
  }
}
module.exports = RoomController;
