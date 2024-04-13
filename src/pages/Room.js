import { useEffect, useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocketContext } from "../contexts/SocketContext";
import {
  EVENTS,
  MAX_MEMBER_COUNT,
  RAISE_TYPES,
} from "../shared-utils/constants";
import Page from "../container/Page";
import Button from "../components/Button";
import Message from "../components/Message";
import { setRoom } from "../store/slices/room";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const MESSAGE_SCROLL_AREA_ID = "MESSAGE_SCROLL_AREA_ID";
const MESSAGE_SCROLL_CONTENT_ID = "MESSAGE_SCROLL_CONTENT_ID";

const Room = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, initSocket, errorMsg } = useSocketContext();
  const isAtBottom = useRef(true);
  const userId = useSelector((state) => state.user.data.userId);
  const roomId = useSelector((state) => state.room.data.uid);
  const room = useSelector((state) => state.room.data);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [raise, setRaise] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const onRoomUpdated = useCallback(
    ({ data }) => {
      dispatch(setRoom(data));
    },
    [dispatch]
  );
  const onMessageAdded = useCallback(({ data, messageId }) => {
    const mergedData = {
      ...data,
      messageId,
    } 
    setMessages((prev) => [...prev, mergedData]);
  }, []);
  const onGameStarted = useCallback(() => {
    setIsGameStarted(true);
  }, []);
  const onMemberRaised = useCallback(({ data }) => {
    setRaise(data.raise);
  }, []);
  const onGameEnded = useCallback(() => {
    setRaise("");
    setIsGameStarted(false);
  }, []);

  const onMessage = useCallback(
    (data) => {
      console.log("onMessage!", data);
      switch (data.type) {
        case EVENTS.ROOM_UPDATED:
          onRoomUpdated(data);
          break;
        case EVENTS.MESSAGE_ADDED:
          onMessageAdded(data);
          break;
        case EVENTS.GAME_STARTED:
          onGameStarted(data);
          break;
        case EVENTS.MEMBER_RAISED:
          onMemberRaised(data);
          break;
        case EVENTS.GAME_ENDED:
          onGameEnded(data);
          break;
        default:
          break;
      }
    },
    [onRoomUpdated, onMessageAdded, onGameStarted, onMemberRaised, onGameEnded]
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
    if (room.userIds.length !== MAX_MEMBER_COUNT) {
      alert("人數不足, 無法開始");
      return;
    }
    socket.emit(EVENTS.GAME_START);
  }, [socket, room]);

  const emitMemberRaise = useCallback(
    (v) => {
      if (!raise) {
        socket.emit(EVENTS.MEMBER_RAISE, v);
      }
    },
    [socket, raise]
  );

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

  useEffect(() => {
    if (errorMsg) {
      alert(errorMsg);
      navigate('/')
    }
  }, [navigate, errorMsg])

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
            <div className="flex flex-row items-center h-40 sm:h-16 rounded-xl bg-white w-full px-4 flex-wrap">
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
                {!room.locked && (
                  <Button onClick={emitStartGame}>
                    <span>發起猜拳</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isGameStarted && (
        <div className="absolute w-screen h-screen bg-black opacity-75 flex justify-center items-center">
          <div className="flex flex-row w-[300px] pa-4">
            <div className="flex flex-col flex-auto h-full p-6">
              <div className="flex flex-row justify-between flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                <FontAwesomeIcon
                  className={clsx([
                    "text-blue-500 cursor-pointer hover:scale-110 transition-transform duration-500",
                    {
                      "text-green-500": raise === RAISE_TYPES.SCISSORS,
                    },
                  ])}
                  size="4x"
                  icon={faHandScissors}
                  onClick={() => emitMemberRaise(RAISE_TYPES.SCISSORS)}
                />
                <FontAwesomeIcon
                  className={clsx([
                    "text-blue-500 cursor-pointer hover:scale-110 transition-transform duration-500",
                    {
                      "text-green-500": raise === RAISE_TYPES.ROCK,
                    },
                  ])}
                  size="4x"
                  icon={faHandRock}
                  onClick={() => emitMemberRaise(RAISE_TYPES.ROCK)}
                />
                <FontAwesomeIcon
                  className={clsx([
                    "text-blue-500 cursor-pointer hover:scale-110 transition-transform duration-500",
                    {
                      "text-green-500": raise === RAISE_TYPES.PAPER,
                    },
                  ])}
                  size="4x"
                  icon={faHandPaper}
                  onClick={() => emitMemberRaise(RAISE_TYPES.PAPER)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};
export default Room;
