const { newMessageId } = require("../../shared-utils/id");
const { SENDER_IDS } = require("../../shared-utils/constants");

const newMessage = ({ type, data }) => {
  return {
    type,
    messageId: newMessageId(),
    data: {
      senderId: SENDER_IDS.SERVER,
      ...data,
    },
  };
};

module.exports = {
  newMessage,
};
