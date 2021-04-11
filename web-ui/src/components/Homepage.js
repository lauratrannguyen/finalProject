import { Row, Col } from "react-bootstrap";
import { NavLink} from "react-router-dom";

// Attribution of boba image to google
function Homepage() {
  return (
      <Col>
          <Col>
          <center><h1>🧋BOBAGRAM🧋</h1></center>
          <center><h4>A Guide to Boba Places Near You</h4></center>
          </Col>
          <Row></Row>
          <Col>
          <center><img src="https://phoenix.org/wp-content/uploads/2018/07/Boba-Tea.jpg" width ="500" alt="boba"></img></center>
          </Col>
          <Col className="my-5">
          <center><div><h4>It is easy to become overwhelmed by the numerous Boba spots around you. As a newcomer, 
            how would you know which places are worth trying and what drinks to order?</h4></div>
           <h4>Bobagram helps to consolidate all the places on a single site, and gives users the options 
            to leave reviews/comments for other fellow boba lovers. Now, Boba tasting has gotten a lot easier!</h4> </center>
          <center><h4><NavLink to="/users/new" className="nav-link mx-2">Click Here to create an account!</NavLink></h4></center>

          </Col>
      </Col>
  );
}

export default Homepage;
