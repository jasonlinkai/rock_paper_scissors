const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const { database } = require("./firebase");
const { events } = require("../constants");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;
const MAX_MEMBER_COUNT = 2;

app.use(cors());
app.use(express.json());

// entity class
const ClassRoomEntity = require("./entities/RoomEntity");
// model class
const ClassRoomModel = require("./models/RoomModel");
// controller class
const ClassRoomController = require("./controllers/RoomController");

// model instance
const roomModel = new ClassRoomModel({ database });
// controller instance
const roomController = new ClassRoomController({ app, roomModel });

const checkConnectionValid = async (params) => {
  const { userId, roomId } = params;
  if (!userId) {
    throw Error("no userId");
  }
  if (!roomId) {
    throw Error("no roomId");
  }
  const room = await roomModel.readRoom({ roomId });
  if (!room) {
    throw Error("room not fund");
  }
  const roomEntity = new ClassRoomEntity(room);

  if (roomEntity.props.isGaming) {
    throw Error("is gaming");
  }

  if (
    !roomEntity.props.members.includes(userId) &&
    roomEntity.props.members.length === MAX_MEMBER_COUNT
  ) {
    throw Error("room is full");
  }
};

io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const log = (...args) =>
    console.log(...args, `user: ${userId} room: ${roomId} `);

  log("event: connection");

  try {
    await checkConnectionValid(socket.handshake.query);
    socket.join(roomId);
    const room = io.to(roomId);
    await roomController.onRoomMemberAdd({
      roomId,
      userId,
    });

    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    if (roomSockets && roomSockets.size > 1) {
      roomSockets.forEach((_, socketId) => {
        if (socketId !== socket.id) {
          io.to(socketId).emit("message", {
            type: events.MEMBER_ADDED,
            senderId: "system",
            data: {
              userId,
            },
          });
          io.to(socketId).emit("message", {
            type: events.MESSAGE_ADDED,
            senderId: "system",
            data: {
              message: `${userId}加入房間`,
            },
          });
        }
      });
    }

    socket.on(events.GAME_START, async () => {
      log(`event: ${events.GAME_START}`);
      await roomController.onRoomGameStart({ roomId, userId });
      room.emit("message", {
        type: events.GAME_STARTED,
        senderId: "system",
      });
    });

    socket.on(events.MEMBER_RAISE, async (raise) => {
      log(`event: ${events.MEMBER_RAISE}`);
      await roomController.onRoomMemberRaise({ roomId, userId, raise });
      room.emit("message", {
        type: events.MEMBER_RAISED,
        senderId: "system",
        data: {
          userId,
        },
      });
    });

    socket.on("disconnect", async () => {
      log("event: disconnect");
      const roomEntity = await roomController.onRoomMemberLeave({
        roomId,
        userId,
      });
      if (roomEntity.props.isGaming) {
        room.emit("message", {
          type: events.GAME_FROCE_ENDED,
          senderId: "system",
        });
      }
      room.emit("message", {
        type: events.MEMBER_LEAVED,
        senderId: "system",
        data: {
          userId,
        },
      });
      room.emit("message", {
        type: events.MESSAGE_ADDED,
        senderId: "system",
        data: {
          message: `${userId}離開房間`,
        },
      });
    });
  } catch (e) {
    socket.disconnect(true);
    log(`err: ${e.message}`);
  }
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});