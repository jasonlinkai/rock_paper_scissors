const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/create-room', function (req, res) {
  res.json({
    roomId: uuidv4(),
  });
})

app.post('/enter-room', function (req, res) {
  res.json(req.body);
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});