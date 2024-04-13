const path = require("path");
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const { database } = require("./firebase");
const { EVENTS, MAX_MEMBER_COUNT } = require("../shared-utils/constants");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:443",
      "http://localhost:3000",
    ],
  })
);
app.use(express.static(path.join(__dirname, "../", "../", "build")));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../", "../", "build", "index.html"));
});

// class
const ClassRoomEntity = require("./entities/RoomEntity");
const ClassRoomModel = require("./models/RoomModel");
const ClassRoomController = require("./controllers/RoomController");

// instance
const roomModel = new ClassRoomModel({ database });
const roomController = new ClassRoomController({
  app,
  roomModel,
  io,
});

const queue = [];
let processing = false;
const processQueue = async () => {
  if (!processing && queue.length > 0) {
    processing = true;
    const action = queue.shift();
    try {
      await action();
    } catch (error) {
    } finally {
      processing = false;
      processQueue();
    }
  }
};
const enqueue = (action) => {
  queue.push(action);
  processQueue();
};

const checkConnectionValid = async (params) => {
  const { userId, roomId } = params;
  if (!userId) {
    return new Error("no userId");
  }
  if (!roomId) {
    return new Error("no roomId");
  }
  const roomSnapshot = await roomModel.read(roomId);
  if (!roomSnapshot) {
    return new Error("找不到房間");
  }
  const roomEntity = new ClassRoomEntity(roomSnapshot);
  if (roomEntity.props.userIds.includes(userId)) {
    return new Error("此房間已有同樣名字的人，請換個名字吧");
  }
  if (roomEntity.props.locked) {
    return new Error("遊戲中無法進入");
  }
  if (
    !roomEntity.props.userIds.includes(userId) &&
    roomEntity.props.userIds.length === MAX_MEMBER_COUNT
  ) {
    return new Error("房間已滿");
  }
  return null;
};

io.use(async (socket, next) => {
  const err = await checkConnectionValid(socket.handshake.query);
  if (err) next(err)
  else next();
});

io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const socketId = socket.id;
  const log = (...args) =>
    console.log(...args, `user: ${userId} room: ${roomId} `);

  log("event: connection");

  try {
    socket.join(roomId);

    enqueue(roomController.memberAdd({ roomId, userId }));

    socket.on(EVENTS.MESSAGE_ADD, (message) => {
      log(`event: ${EVENTS.MESSAGE_ADD} message: ${message}`);
      enqueue(roomController.messageAdd({ roomId, senderId: userId, message }));
    });

    socket.on(EVENTS.GAME_START, async () => {
      log(`event: ${EVENTS.GAME_START}`);
      enqueue(roomController.gameStart({ roomId }));
    });

    socket.on(EVENTS.MEMBER_RAISE, async (raise) => {
      log(`event: ${EVENTS.MEMBER_RAISE}`);
      enqueue(roomController.memberRaise({ roomId, userId, socketId, raise }));
    });

    socket.on("disconnect", async () => {
      log("event: disconnect");
      enqueue(roomController.memberLeave({ roomId, userId }));
    });
  } catch (e) {
    socket.disconnect(true);
    log(`err: ${e.message}`);
  }
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
