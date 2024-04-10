import { useSelector } from 'react-redux'

export const useAuth = () => {
  const roomId = useSelector((state) => state.room.data.roomId);
  return Boolean(roomId);
}

export default useAuth;