// Socket to connect with the backend side
//  BASED ON PREVIOUS HOMEWORKS AND NAT TUCKS GITHUB

import { Socket } from "phoenix";
import store from "./store";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "ws://bobagram-api.annelee2001.com/socket/"
    : "ws://localhost:4000/socket/";

const state = store.getState();
const session = state.session;

let token = "";
let socket = null;
let channel = null;
let callback = null;

// Create state
let currState = {
  comments: [],
  err: "",
};

if (session && session.token) {
  token = session.token;
  socket = new Socket(socketUrl, { params: { token: token } });
  socket.connect();
}

// Errors with channels
function handleError(err) {

  if (err.reason) {
    currState = {
      ...currState,
      err: err.reason,
    };
  }
}

// Joins channel
export function channelJoin(spaceId, userId, setLiveState) {
  if (!socket) {
    return;
  }

  callback = setLiveState;

  channel = socket.channel("space:" + spaceId, { user_id: userId });
  channel
    .join()
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) => handleError(err));

  channel.on("new_comment", (comments) => {
    updateComments(comments);
  });

  channel.on("delete_comment", (comments) => {
    updateComments(comments);
  });

}

// Allows user to create new comment
export function pushNewComment(commentBody) {
  if (!socket) {
    return;
  }

  channel
    .push("new_comment", { body: commentBody })
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Could not create comment", err)
    );
}

// Allows user to delete comment
export function pushDeleteComment() {
  if (!socket) {
    return;
  }

  channel
    .push("delete_comment", {})
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Something went wrong when deleting the comment: ", err)
    );
}

// Updates comments
function updateComments(updatedComments) {
  currState = {
    ...currState,
    comments: updatedComments.data,
  };

  callback(currState);
}

// Leaves channel
export function channelLeave() {
  if (!socket) {
    return;
  }

  channel.leave().receive("ok", () => console.log("error"));
}
