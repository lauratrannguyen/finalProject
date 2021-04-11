// js for logging existent user in

import { Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { phoenixLogin, getUserInfo } from "../../api";
// JS for logging user in
function LoginUser() {
  const history = useHistory();

  // Maintains the user's passcode and email
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Logs user in
  function login(ev) {
    ev.preventDefault();

    // If successful, continue
    phoenixLogin(user.email, user.password).then((isSuccess) => {
      if (isSuccess) {
        const successFetch = getUserInfo();
        if (successFetch) {
          history.push("/");
        } else {
          history.push("/login");
        }

      } else {
        history.push("/login");
      }
    });
  }

  // Login page
  return (
      <Col>
        <center><h1>Welcome back!</h1></center>
            <Form onSubmit={login}>
              <Row>
              <Col>


              <Form.Group controlId="userEmail">
                <Form.Label>Enter your email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@mail.com"
                  onChange={(ev) =>
                    setUser({ ...user, email: ev.target.value })
                  }
                  value={user.email}
                />
              </Form.Group>
              </Col>
              <Col>

              <Form.Group controlId="userPassword">
                <Form.Label>Enter your password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="******"
                  onChange={(ev) =>
                    setUser({ ...user, password: ev.target.value })
                  }
                  value={user.password}
                />
              </Form.Group>
              </Col>
              </Row>

              <Button variant="info" type="submit">
                Login!
              </Button>

            </Form>
      </Col>
  );
}

function stateToProps(state) {
  const { session } = state;
  return {
    session: session,
  };
}

export default connect(stateToProps)(LoginUser);
