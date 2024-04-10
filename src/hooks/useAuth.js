import { useSelector } from 'react-redux'

export const useAuth = () => {
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);
  return Boolean(userId) && Boolean(roomId);
}

export default useAuth;