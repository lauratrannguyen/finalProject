import { createStore, combineReducers } from "redux";

function loadSession() {
  let session = localStorage.getItem("session");

  if (!session) {
    return null;
  }

  session = JSON.parse(session);

  const maxTime = 24 * 60 * 60 * 1000;
  const timeElapsed = Date.now() - session.timestamp;
  if (timeElapsed > maxTime) {
    return null;
  }

  return session;
}

function user(state = null, action) {
  switch (action.type) {
    case "user/set":
      return action.data;
    case "session/logout":
      return null;
    default:
      return state;
  }
}

function storeSession(session) {
  const sessionWithTime = {
    ...session,
    timestamp: Date.now(),
  };
  localStorage.setItem("session", JSON.stringify(sessionWithTime));
}

function session(state = loadSession(), action) {
  switch (action.type) {
    case "session/set":
      storeSession(action.data);
      return action.data;
    case "session/logout":
      localStorage.removeItem("session");
      return null;
    default:
      return state;
  }
}

function showSpaces(state = [], action) {
  switch (action.type) {
    case "showSpaces/set":
      return action.data;
    case "showSpaces/add":
      const stateNew = state.concat([action.data]);
      return stateNew;
    case "showSpaces/update":
      let stateUpdate;
      if (state.some((space) => space.id === action.data.id)) {
        stateUpdate = replaceEvent(state, action.data);
      } else {
        stateUpdate = state.concat([action.data]);
      }
      return stateUpdate;
    case "session/logout":
      return [];
    default:
      return state;
  }
}

function replaceEvent(state, newSpace) {
  const dupli = state.slice();
  const index = dupli.findIndex((space) => space.id === newSpace.id);
  dupli.splice(index, 1, newSpace);
  return dupli;
}

function error(state = "", action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    default:
      return null;
  }
}

function info(stat = "", action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    default:
      return null;
  }
}

function success(state = "", action) {
  switch (action.type) {
    case "success/set":
      return action.data;
    default:
      return null;
  }
}

function rootReducer(state, action) {
  const reducers = combineReducers({
    session,
    user,
    showSpaces,
    error,
    success,
    info,
  });

  const updatedState = reducers(state, action);
  return updatedState;
}

const store = createStore(rootReducer);
export default store;
