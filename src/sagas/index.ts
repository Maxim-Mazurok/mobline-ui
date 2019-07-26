import { takeEvery } from 'redux-saga/effects';
import { WS_ADD_COMPETITOR, WS_SUBSCRIBE, wsAddCompetitor, wsSubscribe } from "../actions/socket";

const handleWSOutgoingMessage = function* handleWSOutgoingMessage(socket: WebSocket) {
  yield takeEvery([
    WS_SUBSCRIBE,
    WS_ADD_COMPETITOR,
  ], (
    action:
      | ReturnType<typeof wsSubscribe>
      | ReturnType<typeof wsAddCompetitor>
  ) => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(action));
    } else {
      const timeoutFunction = (socket: WebSocket) => {
        setTimeout(() => {
          if (socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(action));
          } else {
            timeoutFunction(socket);
          }
        }, 100);
      };
      timeoutFunction(socket);
    }
  });
};

export default handleWSOutgoingMessage;
