class RoomEntity {
  constructor({
    uid = "",
    userIds = [],
    locked = false,
    gameId = "",
    raisedIds = [],
    raisedRecord = {},
  }) {
    this.props = this.props || {};
    this.props.uid = uid;
    this.props.userIds = userIds;
    this.props.locked = locked;
    this.props.raisedIds = raisedIds;
    this.props.raisedRecord = raisedRecord;
  }
  memberAdd({ userId }) {
    this.props.userIds = Array.from(new Set([...this.props.userIds, userId]));
  }
  memberLeave({ userId }) {
    this.props.userIds = this.props.userIds.filter((id) => id !== userId);
  }
  gameStart() {
    this.props.locked = true;
  }
  memberRaise({ userId, raise }) {
    this.props.raisedIds = Array.from(new Set([...this.props.raisedIds, userId]));
    this.props.raisedRecord[userId] = raise;
  }
  resetGame() {
    this.props.locked = false;
    this.props.raisedIds = [];
    this.props.raisedRecord = {};
  }
  snapshot() {
    return JSON.parse(JSON.stringify(this.props));
  }
}

module.exports = RoomEntity;
