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

app.use(cors());
app.use(express.json());

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
    throw Error("no userId");
  }
  if (!roomId) {
    throw Error("no roomId");
  }
  const roomSnapshot = await roomModel.read(roomId);
  if (!roomSnapshot) {
    throw Error("room not fund");
  }
  const roomEntity = new ClassRoomEntity(roomSnapshot);

  if (roomEntity.props.locked) {
    throw Error("is gaming");
  }

  if (
    !roomEntity.props.userIds.includes(userId) &&
    roomEntity.props.userIds.length === MAX_MEMBER_COUNT
  ) {
    throw Error("room is full");
  }
};

io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const socketId = socket.id;
  const log = (...args) =>
    console.log(...args, `user: ${userId} room: ${roomId} `);

  log("event: connection");

  try {
    await checkConnectionValid(socket.handshake.query);
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
