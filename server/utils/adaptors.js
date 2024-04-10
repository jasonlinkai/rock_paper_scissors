const serverRoomToClientRoom = ({ uid, ...rest}) => {
  return {
    ...rest,
    roomId: uid,
  }
}

module.exports = {
  serverRoomToClientRoom
}