const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const { database } = require("./firebase");

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
    throw new Error("no userId");
  }
  if (!roomId) {
    throw new Error("no roomId");
  }
  const room = await roomModel.readRoom({ roomId });
  if (!room) {
    throw new Error("room not fund");
  }
  const roomEntity = new ClassRoomEntity(room);

  if (roomEntity.props.isGaming) {
    throw new Error("is gaming");
  }

  if (roomEntity.props.members.length === MAX_MEMBER_COUNT) {
    throw new Error("room is full");
  }
};

io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const log = (...args) =>
    console.log(...args, `user: ${userId} room: ${roomId} `);

  log("event: connection");

  try {
    checkConnectionValid(socket.handshake.query);
    await roomModel.onRoomMemberAdd({
      roomId,
      userId,
    });

    socket.join(roomId);
    io.to(roomId).emit("message", {
      type: "msg",
      data: `${userId}加入房間`,
    });

    socket.on("startGame", async () => {
      log("event: startGame");
      await roomModel.onRoomGameStart({ roomId });
    });

    socket.on("disconnect", async () => {
      log("event: disconnect");
      await roomModel.onRoomMemberLeave({
        roomId,
        userId,
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
