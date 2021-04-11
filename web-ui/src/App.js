import "./App.scss";
import {Row, Col, Container } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import NavBar from "./components/Nav";
import Homepage from "./components/Homepage";
import Login from "./components/Users/Account";
import Register from "./components/Users/Register";
import NewSpace from "./components/Places/CreatePlace";
import ShowSpace from "./components/Places/ShowPlace";

function App() {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <NavBar />
        </Col>
      </Row>
      <Switch>
        <Route path="/" exact>
        <Homepage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/users/new" exact>
          <Register />
        </Route>
        <Route path="/spaces/new" exact>
          <NewSpace />
        </Route>
        <Route path="/spaces/:id" exact>
          <ShowSpace />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
