const registerRoomModel = require("../models/roomModel");

module.exports = (app, database) => {
  const roomModel = registerRoomModel(database);
  
  app.post("/create-room", async function (req, res) {
    const data = await roomModel.createRoom();
    res.json(data);
  });

  app.post("/enter-room", async function (req, res) {
    const data = await roomModel.readRoom(req.body);
    res.json(data);
  });
};
