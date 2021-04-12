import {Row, Col, Image, Button, Table, InputGroup, FormControl, ListGroup,
} from "react-bootstrap";

import store from "../../store";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { fetchSpace } from "../../api";
import { postComment, apiDeleteComment } from "../../api";
import {
  channelJoin,
  pushNewComment,
  pushDeleteComment,
  channelLeave,
} from "../../socket";

function ShowSpace(props) {
  const { spaces, session } = props;
  const { id } = useParams();
  const [liveState, setLiveState] = useState(null);
  useEffect(() => {
    if (session) {
      channelJoin(id, session.id, setLiveState);
    }
    return () => {
      if (liveState) {
        channelLeave();
      }
    };
  }, []);

  useEffect(() => {
    if (liveState && liveState.err && liveState.err !== "") {
      const errAction = {
        type: "error/set",
        data: liveState.err,
      };
      store.dispatch(errAction);
    }
  }, [liveState]);

  const history = useHistory();
  let bobaInfo = null;

  if (spaces !== null && spaces !== undefined) {
    const storeSpace = getSpace(spaces, id);

    if (storeSpace) {
      bobaInfo = (
        <SpaceInfo
          space={storeSpace}
          session={session}
          history={history}
          liveState={liveState}
        />
      );
    } else {
      fetchSpace(id).then((space) => {
        if (!space) {
          history.push("/feed");
        }
      });
    }
  }

  return (
    <Row >
      <Col>{bobaInfo}</Col>
    </Row>
  );
}

function getSpace(spaces, id) {
  const space = spaces.filter((space) => space.id === parseInt(id));
  if (space !== []) {
    return space[0];
  } else {
    return null;
  }
}

function SpaceInfo({ space, session, history, liveState }) {
  return (
      <Col>
         
            <center><h1>{space.name}</h1></center>
   
        <hr></hr>

        <Row>
          <Col>
            <SpaceDescription space={space} />
          </Col>
        </Row>
        <Comments
          cachedComments={space.comments.data}
          space={space}
          session={session}
          history={history}
          liveState={liveState}
        />
      </Col>
  );
}

function SpaceDescription({ space }) {
  let websiteButton = null;
  if (space.website !== "") {
    websiteButton = (
      <div >
        <a
          href={space.website}
          target="_blank"
          rel="noreferrer"
        >
          Website
        </a>
      </div>
    );
  }

  let image = null;
  if (space.photo !== "") {
    image = <Image className="image" src={space.photo} alt="..." fluid />;
  }

  const addressLink = getMapsLink(space.address);

  return (
    <Row>
      <Col>

        <Row>
          <Col>{websiteButton}</Col>
        </Row>
        <Row >
          <Col>
            <a
              href={addressLink}
              target="_blank"
              rel="noreferrer"
            >
              Address: {space.address}
            </a>
          </Col>
        </Row>
        <hr></hr>
        <Row className="my-3">
          <Col lg={6} md={9} xs={12}>
            {image}
          </Col>
        </Row>
        
        <Row className="my-3">
          <Hours hours={space.opening_hours} />
        </Row>
        <Row className="my-5">
          <Review description={space.description} />
        </Row>
      </Col>
    </Row>
  );
}

function getMapsLink(address) {
  const linkAddress = address.replace(/\s/g, "+");
  const mapsEndpoint = "https://www.google.com/maps/place/";
  return mapsEndpoint + linkAddress;
}

function Review({ description }) {
  return (
    <Col >
      <hr></hr>
      <Row>
        <Col>
          <h3>Review</h3>
        </Col>
      </Row>
      <Row>
        <Col>{description}</Col>
      </Row>
    </Col>
  );
}

function Hours({ hours }) {
  let hoursUI = null;
  if (hours) {
    hoursUI = hours.map((timeStr, idx) => {
      return (
        <ListGroup.Item key={idx}>
          {timeStr}
        </ListGroup.Item>
      );
    });
  }

  return (
    <Col lg={40}>
      <Col>
      <Row>
        <h8>Attribution to Google Images</h8>
      </Row>
      </Col>
      <hr ></hr>
      <Col>
      <Row>
      <h4>Availability</h4>
      </Row>
      <Row>
        <h7>Weekends</h7>
        <Col>
        {hoursUI[5]}
          {hoursUI[6]}
        </Col>
        <h7>Weekdays</h7>
        <Col>
          {hoursUI[0]}
          {hoursUI[1]}
          {hoursUI[2]}
          {hoursUI[3]}
          {hoursUI[4]}
          </Col>
      </Row>
      </Col>
    </Col>
  );
}

function Comments({ cachedComments, space, session, liveState }) {
  function deleteComment(commentId) {
    apiDeleteComment(commentId, space.id).then(() => {
      if (liveState) {
        pushDeleteComment();
      }
    });
  }

  function commentOwner(comment) {
    if (!session) {
      return false;
    }
    return session.id === comment.user_id;
  }

  let comments = null;
  if (liveState) {
    comments = liveState.comments;
  } else if (cachedComments) {
    comments = cachedComments;
  }

  let commentList;
  if (comments) {
    commentList = comments.map((comment, idx) => {
      let deleteButton = null;
      if (commentOwner(comment)) {
        deleteButton = (
          <td>
            <button
              onClick={() => deleteComment(comment.id)}
            >
              Remove
            </button>
          </td>
        );
      }

      return (
        <tr key={idx}>
          <td className="col-lg-6">{comment.body}</td>
          <td className="col-lg-3">
            <h6>{comment.user}</h6>
          </td>
          {deleteButton}
        </tr>
      );
    });
  }

  return (
    <Row className="my-2">
      <Col>
      <hr></hr>
        <Row>
          
          <Col>
            <h3>Questions for the reviewer:</h3>
          </Col>
        </Row>
        <CommentForm space={space} liveState={liveState} session={session} />
        <Row className="my-5">
          <Col>      
          <hr ></hr>
          <h3>Discussion:</h3>
            <Table hover>
              <tbody>{commentList}</tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function CommentForm({ space, liveState, session }) {
  const [comment, setComment] = useState("");

  function submitComment() {
    if (liveState && session) {
      pushNewComment(comment);
    } else {
      postComment(comment, space.id);
    }
    setComment("");
  }

  return (
    <Row className="my-3">
      <Col className="col-lg-9 col-md-12">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Ask a question..."
                value={comment}
                onChange={(ev) => setComment(ev.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    submitComment();
                  }
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="info" onClick={submitComment}>
              Ask
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  const { showSpaces, session } = state;
  return { spaces: showSpaces, session: session };
}

export default connect(stateToProps)(ShowSpace);
