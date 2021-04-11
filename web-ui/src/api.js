// Helps to connect react functions to phoenix
// HELP FROM NAT TUCKS GITHUB REPO
import store from "./store";

const link =
  process.env.NODE_ENV === "production"
    ? "http://bobagram-api.annelee2001.com/api/v1"
    : "http://localhost:4000/api/v1";

// Checks whether user is logged in, aand gives error if they're not
function userLog(session) {
  if (!session) {
    const errorAction = {
      type: "error/set",
      data: "error",
    };
    store.dispatch(errorAction);
    return false;
  }
  return true;
}

// Creating a boba place
async function bobaUpload(endpoint, body, token = "") {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(link + endpoint, options);
  return await response.json();
}

// Logs user in
export async function phoenixLogin(email, password) {
  const response = await bobaUpload("/session", {
    email: email,
    password: password,
  });

  if (response.session) {
    const sessionAction = {
      data: response.session,
      type: "session/set",
    };

    const successAction = {
      data: "Login successful",
      type: "success/set",
    };

    store.dispatch(sessionAction);
    store.dispatch(successAction);

    return true;
  } else {

    const errorAction = {
      data: response.error,
      type: "error/set",
    };

    store.dispatch(errorAction);
    return false;
  }
}

export async function phoenixRegister(newUser) {
  try {
    const response = await bobaUpload("/users", { user: newUser });
    if (response.data) {
      return true;
    } 
    
    else {
      const err = getRegisterationError(response);

      if (err !== "") {
        const errorAction = {
          data: err,
          type: "error/set",
        };

        store.dispatch(errorAction);
      }

      return false;
    }
  } catch (err) {
    console.log("err", err);
    return false;
  }
}

function getRegisterationError(response) {
  if (response.errors) {
    const errors = response.errors;
    if (errors.email) {
      return "Email: " + errors.email[0];
    }

    if (errors.password) {
      return "Password: " + errors.password[0];
    }

    return "";
  }
}

export async function apiCreateSpace(space) {
  const state = store.getState();
  const session = state.session;

  if (!userLog(session)) {
    return false;
  }

  const token = session.token;

  const response = await bobaUpload("/spaces", { space: space }, token);

  if (response.data) {
    const successAction = {
      type: "success/set",
      data: "New space created successfully!",
    };

    store.dispatch(successAction);

    return response.data;
  }

  const err = getCreateSpaceError(response.errors);

  const errorAction = {
    type: "error/set",
    data: err,
  };

  console.log("create space errors: ", response.errors);

  store.dispatch(errorAction);

  return null;
}

function getCreateSpaceError(errors) {
  if (errors.description) {
    return "Description: " + errors.description[0];
  } else {
    return "Error";
  }
}

export async function apiPostReview(rating, spaceId) {
  const state = store.getState();
  const session = state.session;

  if (!userLog(session)) {
    return false;
  }

  const review = {
    rating: rating,
    space_id: spaceId,
  };

  const token = session.token;

  const response = await bobaUpload("/reviews", { review: review }, token);

  if (response.data) {
    const newSpace = response.data.space.data;
    const action = {
      type: "showSpaces/update",
      data: newSpace,
    };

    store.dispatch(action);

    return true;
  }

  const errAction = {
    type: "error/set",
    data: "Error",
  };

  store.dispatch(errAction);

  return false;
}

export async function postComment(commentBody, spaceId) {
  const state = store.getState();
  const session = state.session;

  if (!userLog(session)) {
    return false;
  }

  const comment = {
    body: commentBody,
    space_id: spaceId,
  };

  const token = session.token;

  const response = await bobaUpload("/comments", { comment: comment }, token);

  if (response.data) {
    const newSpace = response.data.space.data;
    const action = {
      type: "showSpaces/update",
      data: newSpace,
    };

    store.dispatch(action);

    return true;
  }

  const errAction = {
    type: "error/set",
    data: "Error",
  };

  store.dispatch(errAction);
  return false;
}


async function deleteRequest(endpoint, token = "") {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
  };
  const response = await fetch(link + endpoint, options);
  return await response.json();
}

export async function apiDeleteComment(commentId, spaceId) {
  const state = store.getState();
  const session = state.session;
  if (!userLog(session)) {
    return null;
  }
  const token = session.token;
  try {
    await deleteRequest("/comments/" + commentId, token);
  } catch (err) {
    const space = await fetchSpace(spaceId);
    return space.data;
  }
}

async function getRequest(endpoint, token) {
  const options = {
    method: "GET",
    headers: {
      "x-auth": token,
    },
  };
  const response = await fetch(link + endpoint, options);
  return await response.json();
}

export function getUserInfo() {
  const state = store.getState();
  const session = state.session;

  if (!userLog(session)) {
    return false;
  }

  const userId = session.id;
  const token = session.token;

  const isSuccess = getRequest("/users/" + userId, token)
    .then((userData) => {
      const action = {
        type: "user/set",
        data: userData,
      };

      store.dispatch(action);

      return true;
    })
    .catch((err) => {
      return false;
    });

  return isSuccess;
}
export async function fetchSpace(id) {
  let space;
  try {
    space = await getRequest("/spaces/" + id);
  } catch (err) {
    const errAction = {
      type: "error/set",
      data: "Error",
    };
    store.dispatch(errAction);
    return null;
  }

  if (space.data) {
    const action = {
      type: "showSpaces/update",
      data: space.data,
    };
    store.dispatch(action);
    return space.data;
  }
  return null;
}
