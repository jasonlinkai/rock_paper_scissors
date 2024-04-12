import {
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../contexts/SocketContext";
import { EVENTS } from "../shared-utils/constants";
import Page from "../container/Page";
import Button from "../components/Button";
import Message from "../components/Message";

const MESSAGE_SCROLL_AREA_ID = "MESSAGE_SCROLL_AREA_ID";
const MESSAGE_SCROLL_CONTENT_ID = "MESSAGE_SCROLL_CONTENT_ID";

const Room = () => {
  const { socket, initSocket } = useSocketContext();
  const isAtBottom = useRef(true);
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.roomId);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const onMessageAdded = useCallback(({ data }) => {
    setMessages((prev) => [...prev, data]);
  }, []);
  const onMemberAdded = useCallback(() => {}, []);
  const onMemberLeaved = useCallback(() => {}, []);
  const onGameStarted = useCallback(() => {}, []);
  const onGameEnded = useCallback(() => {}, []);

  const onMessage = useCallback(
    (data) => {
      console.log("onMessage!", data);
      switch (data.type) {
        case EVENTS.MESSAGE_ADDED:
          onMessageAdded(data);
          break;
        case EVENTS.MEMBER_ADDED:
          onMemberAdded(data);
          break;
        case EVENTS.MEMBER_LEAVED:
          onMemberLeaved(data);
          break;
        case EVENTS.GAME_STARTED:
          onGameStarted(data);
          break;
        case EVENTS.GAME_ENDED:
          onGameEnded(data);
          break;
        default:
          break;
      }
    },
    [onMessageAdded, onMemberAdded, onMemberLeaved, onGameStarted, onGameEnded]
  );

  const applyRoomLogic = useCallback(
    (socket) => {
      socket.on("message", onMessage);
    },
    [onMessage]
  );

  const emitMessage = useCallback(() => {
    if (!text) return;
    socket.emit(EVENTS.MESSAGE_ADD, text);
    setText("");
  }, [socket, text]);

  const emitStartGame = useCallback(() => {
    socket.emit(EVENTS.GAME_START);
  }, [socket]);

  useEffect(() => {
    initSocket({ userId, roomId });
  }, [initSocket, userId, roomId]);

  useEffect(() => {
    if (socket) {
      applyRoomLogic(socket);
      socket.connect();
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, applyRoomLogic]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Enter") {
        emitMessage();
      }
    };
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keyup", handler);
    };
  }, [emitMessage]);

  useEffect(() => {
    const scrollArea = document.getElementById(MESSAGE_SCROLL_AREA_ID);
    const scrollContent = document.getElementById(MESSAGE_SCROLL_CONTENT_ID);
    const handler = () => {
      const scrollDifference =
        scrollContent.scrollHeight -
        scrollArea.scrollTop -
        scrollArea.clientHeight;

      isAtBottom.current = Math.abs(scrollDifference) <= 1;
    };
    scrollArea.addEventListener("scroll", handler);
    return () => {
      scrollArea.removeEventListener("scroll", handler);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom.current) {
      const scrollArea = document.getElementById(MESSAGE_SCROLL_AREA_ID);
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <Page className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <p className="text-center text-sm mb-2 font-semibold text-gray-700 tracking-wide">
              房間ID: {roomId}
            </p>
            <div
              id={MESSAGE_SCROLL_AREA_ID}
              className="flex flex-col h-full overflow-x-auto mb-4"
            >
              <div
                id={MESSAGE_SCROLL_CONTENT_ID}
                className="flex flex-col h-full"
              >
                {messages.map((m) => {
                  return <Message key={m.messageId} data={m}></Message>;
                })}
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={text}
                    className="flex w-full border rounded-xl focus:outline-none focus:border-blue-300 pl-4 h-10"
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
              <div className="ml-4 flex justify-between">
                <Button className="mr-2" onClick={emitMessage}>
                  <span>發送</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </Button>
                <Button onClick={emitStartGame}>
                  <span>發起猜拳</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
export default Room;
