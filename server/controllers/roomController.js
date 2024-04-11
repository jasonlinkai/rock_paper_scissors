class roomController {
  constructor({ app, roomModel }) {
    this.app = app;
    this.roomModel = roomModel;
    this.registerRoute(app, roomModel);
  }
  registerRoute(app, roomModel) {
    app.post("/create-room", async function (req, res) {
      const data = await roomModel.createRoom(req.body);
      res.json(data);
    });

    app.post("/enter-room", async function (req, res) {
      const data = await roomModel.readRoom(req.body);
      res.json(data);
    });
  }
}
module.exports = roomController;
