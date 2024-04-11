class RoomEntity {
  constructor({ uid, roomId, members = [], isGaming }) {
    this.props = {};
    this.props.uid = uid;
    this.props.roomId = uid || roomId;
    this.props.members = members;
    this.props.isGaming = isGaming;
  }
  memberAdd({ userId }) {
    this.props.members = Array.from(new Set([...this.props.members, userId]));
  }
  memberLeave({ userId }) {
    this.props.members = this.props.members.filter((id) => id !== userId);
  }
  gameStart() {
    this.props.isGaming = true;
  }
  snapshot() {
    return this.props;
  }
}

module.exports = RoomEntity;
