const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { database } = require('./firebase')

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;

app.use(cors());
app.use(express.json());

const registerRoomController = require('./controllers/roomController');

registerRoomController(app, database)

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});