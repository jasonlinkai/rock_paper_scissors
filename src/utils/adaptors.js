export const serverRoomToClientRoom = ({ uid, ...rest}) => {
  return {
    ...rest,
    roomId: uid,
  }
}