import { useSelector } from "react-redux";

const Room = () => {
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);
  const onStartGame = () => {};
  return (
    <div className="Room">
      <div>
        <h1>剪刀石頭布!</h1>
      </div>
      <div>
        <h2>用戶ID: {userId}</h2>
        <h2>房間ID: {roomId}</h2>
      </div>
      <div>
        <button onClick={onStartGame}>開始遊戲</button>
      </div>
    </div>
  );
};
export default Room;
