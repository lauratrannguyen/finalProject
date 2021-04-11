import { Nav, Navbar, Row, Col, Alert } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import store from "../store";

function NavBar(props) {
  const { success, error } = props;
  let successAlert = null;
  let errorAlert = null;
  if (success) {
    successAlert = <Alert variant="success">{success}</Alert>;
  }

  if (error) {
    errorAlert = <Alert variant="danger">{error}</Alert>;
  }

  return (
      <Col>
          <Col>{successAlert}</Col>
          <Col>{errorAlert}</Col>
        <Row>
          <Col>
            <Navbar bg="light" as="ul">
              <NavLink to="/" className="nav-link mx-2 mr-auto p-0" exact>
                <strong>BOBAGRAM</strong>
              </NavLink>
              <NavInfo />
            </Navbar>
          </Col>
        </Row>
      </Col>
  );
}

const NavInfo = connect(stateToProps)(({ session }) => {
  if (!session) {
    return (
      <Row>
        <Nav.Item>
          <NavLink to="/login" className="nav-link mx-2">
            Log In
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/users/new" className="nav-link mx-2">
            Sign Up
          </NavLink>
        </Nav.Item>
      </Row>
    );
  } else {
    const eventNewPath = "/spaces/new";
    return (
      <Row>
        <Nav.Item className="nav-link">Hello, {session.name}</Nav.Item>
        <Nav.Item>
          <NavLink to={eventNewPath} className="nav-link">
            Review
          </NavLink>
        </Nav.Item>
        <LogoutButton />
      </Row>
    );
  }
});

const LogoutButton = connect()(({ dispatch }) => {
  const history = useHistory();
  function logoutUser() {
    const successAction = {
      data: "Logout successful",
      type: "success/set",
    };
    dispatch({ type: "session/logout" });
    store.dispatch(successAction);
    history.push("/");
  }

  return (
    <Nav.Item>
      <button onClick={logoutUser} className="btn btn-link nav-link mx-2">
        Logout
      </button>
    </Nav.Item>
  );
});

function stateToProps(state) {
  const { session } = state;
  return { session: session };
}

function navStateToProps(state) {
  const { success, error } = state;
  return { success: success, error: error };
}

export default connect(navStateToProps)(NavBar);
