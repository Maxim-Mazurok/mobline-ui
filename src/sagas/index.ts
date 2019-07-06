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
    socket.send(JSON.stringify(action));
  });
};

export default handleWSOutgoingMessage;
