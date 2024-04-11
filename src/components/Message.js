import { useSelector } from "react-redux";
import { MSG_TYPES } from "../shared-utils/constants";

const MsgSenderWrap = (props) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 flex-shrink-0 text-white">
          {props.senderId.slice(0, 1)}
        </div>
        <div className="relative ml-3 text-sm bg-blue-100 py-2 px-4 shadow rounded-xl">
          <div>{props.message}</div>
        </div>
      </div>
    </div>
  );
};

const MsgReceiverWrap = (props) => {
  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 flex-shrink-0 text-white">
          A
        </div>
        <div className="relative mr-3 text-sm bg-blue-100 py-2 px-4 shadow rounded-xl">
          <div>{props.message}</div>
        </div>
      </div>
    </div>
  );
};

const Text = (props) => {
  const userId = useSelector((state) => state.user.data.userId);
  return (
    <div className="grid grid-cols-12 gap-y-2">
      {userId === props.senderId ? (
        <MsgSenderWrap {...props} />
      ) : (
        <MsgReceiverWrap {...props} />
      )}
    </div>
  );
};

const SystemText = (props) => {
  return (
    <div className="flex justify-center py-2">
      <div className="rounded-lg">
        <div className="flex flex-row items-center">
          <div className="relative ml-3 text-sm py-2 px-4 shadow rounded-xl">
            <div>{props.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Message = ({ data }) => {
  switch (data.msgType) {
    case MSG_TYPES.SYSTEM_TEXT:
      return <SystemText {...data} />;
    case MSG_TYPES.TEXT:
      return <Text {...data} />;
    default:
      return null;
  }
};

export default Message;
