// JS for creating a nonexistent user 
// Help from tuck's github

import { Row, Col, Form, Button, Badge } from "react-bootstrap";

import { useState } from "react";
import { useHistory } from "react-router-dom";

// Connects to functions in phoenix backend
import { phoenixLogin, phoenixRegister, getUserInfo } from "../../api";

// Registers a nonexistent user
function Register() {
  return (
      <Col>
        <center><h1>Join Bobagram!</h1></center>
            <Registration />
      </Col>
  );
}

// Form to register the user
function Registration() {
  const history = useHistory();

  // State for the new user
  const [reg, setNewReg] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    errorName: "",
    errorEmail: "",
    errorPassword: "",
  });

  function updateState(field, ev) {
    let registerUser = Object.assign({}, reg);
    registerUser[field] = ev.target.value;
    registerUser.errorPassword = checkPassword(
      registerUser.password,
      registerUser.confirm
    );
    registerUser.errorName =
      registerUser.name === "" ? "Please enter a name!" : "";
    registerUser.errorEmail =
      registerUser.email === "" ? "Please enter an email!" : "";
    setNewReg(registerUser);
  }

  function checkPassword(password, confirm) {
    if (password.length < 6) {
      return "Password must be at least 6 characters!"
    }  else if (password !== confirm) {
      return "Passwords must match!";
    } else {
      return "";
    }
  }

    // Sets error to empty is user is valid
    function newUserIsValid() {
      return (
        reg.errorName === "" &&
        reg.errorEmail === "" &&
        reg.errorPassword === ""
      );
    }

  // Based on tuck's Github
  function userRegistration(ev) {
    ev.preventDefault();
    const registered = {
      email: reg.email,
      name: reg.name,
      password: reg.password,
    };

    phoenixRegister(registered).then((isSuccess) => {
      if (isSuccess) {
        phoenixLogin(registered.email, registered.password).then(
          (isLoginSuccess) => {
            if (isLoginSuccess) {
              const successDataFetch = getUserInfo();

              if (successDataFetch) {
                history.push("/");
              } else {
                history.push("/login");
              }
            } else {
              history.push("/login");
            }
          }
        );
      }
    });
  }

  return (
    <Form onSubmit={userRegistration}>
      <Row><Col>


      <Form.Group controlId="userName">
        <Form.Label>Full Name:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Bob Joe"
          onChange={(ev) => updateState("name", ev)}
          value={reg.name}
        />
        <Badge variant="warning">{reg.errorName}</Badge>
      </Form.Group>

      </Col>
      <Col>

      <Form.Group controlId="userEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="example@mail.com"
          onChange={(ev) => updateState("email", ev)}
          value={reg.email}
        />
        <Badge variant="warning">{reg.errorEmail}</Badge>
      </Form.Group>
      </Col>
      </Row>
      <Row>
        <Col>

      <Form.Group controlId="userPassword">
        <Form.Label>Create a password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="******"
          onChange={(ev) => updateState("password", ev)}
          value={reg.password}
        />
      </Form.Group>

      </Col>
      <Col>

      <Form.Group controlId="userConfirm">
        <Form.Label>Re-enter password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="******"
          onChange={(ev) => updateState("confirm", ev)}
          value={reg.confirm}
        />
        <Badge variant="warning">{reg.errorPassword}</Badge>
      </Form.Group>
      </Col>
      </Row>

      <Button variant="info" type="submit" disabled={!newUserIsValid()}>
        Register!
      </Button>
    </Form>
  );
}

export default Register;
