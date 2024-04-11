const ClassRoomEntity = require("../entities/RoomEntity");

class roomController {
  constructor({ app, roomModel }) {
    this.app = app;
    this.roomModel = roomModel;
    this.registerRoute(app, roomModel);
  }
  async onRoomMemberAdd({ roomId, userId }) {
    return new ClassRoomEntity(
      await this.roomModel.onRoomMemberAdd({
        roomId,
        userId,
      })
    );
  }
  async onRoomGameStart({ roomId, userId }) {
    return new ClassRoomEntity(
      await this.roomModel.onRoomGameStart({
        roomId,
        userId,
      })
    );
  }
  async onRoomMemberLeave({ roomId, userId }) {
    return new ClassRoomEntity(
      await this.roomModel.onRoomMemberLeave({
        roomId,
        userId,
      })
    );
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
