import { Row, Col, Form, Button} from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import { useState, useEffect } from "react";
import { apiCreateSpace, fetchSpace } from "../../api";
import store from "../../store";
import { useHistory } from "react-router-dom";

// Nearby places
const RADIUS = 15;
const google = window.google;

function NewSpace() {
  const [position, setPosition] = useState(null);

  const [userSearch, getUserSearch] = useState(null);

  const [space, getBobaPlace] = useState(null);

  const [userInput, getUserInput] = useState({
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function setLocation(position) {
    const coords = position.coords;
    setPosition({
      lat: coords.latitude,
      long: coords.longitude,
    });
  }

  function handleError(err) {
    setPosition(null);
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(setLocation, handleError, {
        timeout: 15000,
      });
    }
    return () => {
      setPosition(null);
    };
  }, []);

  if (!position) {
    store.dispatch({
      type: "info",
      data:
        "Error",
    });

    return (
          <Row>
            <Col>
              Please enable location if disabled and wait 5 seconds for page to reload.
            </Col>
          </Row>
    );
  }

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <center><h1>Review a Boba Place</h1></center>
          </Col>
        </Row>
        <center><h3>Please search for a valid Boba location</h3></center>
      
        <SearchForm
          position={position}
          userSearch={userSearch}
          getUserSearch={getUserSearch}
          space={space}
          getBobaPlace={getBobaPlace}
          userInput={userInput}
          getUserInput={getUserInput}
          setSubmitted={setSubmitted}
          submitted={submitted}
        />
      </Col>
    </Row>
  );
}

function SearchForm(props) {
  const {
    position,
    space,
    getBobaPlace,
    userSearch,
    getUserSearch,
    submitted,
    setSubmitted,
    userInput,
    getUserInput,
  } = props;

  const history = useHistory();

  useEffect(() => {
    if (hasFields(space)) {
      if (!isUserInputValid(userInput)) {
        const errorAction = {
          type: "error/set",
          data: "error",
        };
        store.dispatch(errorAction);
        setSubmitted(false);
        return;
      }

      if (submitted) {
        const completeSpace = {
          ...space,
          description: userInput.description,
        };

        apiCreateSpace(completeSpace).then((space) => {
          if (space) {
            fetchSpace(space.id).then((space) => {
              if (space) {
                history.push("/spaces/" + space.id);
              }
            });
          }
        });
        setSubmitted(false);
      }
    }
  }, [space, userInput, history, setSubmitted, submitted]);

  function placesInfo() {
    setSubmitted(true);

    if (!userSearch || userSearch === "") {
      const errorAction = {
        type: "error/set",
        data: "error",
      };
      store.dispatch(errorAction);
      return;
    }

    const request = {
      placeId: userSearch.value.place_id,
      fields: [
        "name",
        "website",
        "formatted_address",
        "type",
        "photo",
        "opening_hours",
        "geometry",
      ],
    };

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails(request, savePlacesResult);
  }

  function savePlacesResult(place, status) {
    if (status !== "OK" || !place) {
      const errorAction = {
        type: "error/set",
        action: "Error" + status,
      };

      store.dispatch(errorAction);

      return;
    }

    getBobaPlace({
      name: place.name,
      website: place.website,
      address: place.formatted_address,
      photo: place.photos ? place.photos[1].getUrl() : "",
      opening_hours: place.opening_hours.weekday_text,
      type: place.types[0],
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });
    return place;
  }

  function handleError(err) {
    const errorAction = {
      type: "error/set",
      action:
        "Error",
    };

    store.dispatch(errorAction);
    return;
  }

  return (
    <Row className="mt-5">
      <Col>
        <Form>
        <Row>
          <Col>
          <Form.Group>

          <h4>What Boba Place are you Reviewing?</h4>
                <GooglePlacesAutocomplete
                  onLoadFailed={handleError}
                  selectProps={{
                    userSearch,
                    onChange: getUserSearch,
                  }}
                  autocompletionRequest={{
                    location: {
                      lat: position.lat,
                      lng: position.long,
                    },
                    radius: RADIUS,
                    componentRestrictions: {
                      country: ["us"],
                    },
                  }}
                />
          </Form.Group>
          </Col>
          <Col>

          <Form.Group>
            <h4>Include a Review: </h4>
            <Form.Control
              as="textarea"
              rows={3}
              value={userInput.description}
              onChange={(ev) => {
                getUserInput({ ...userInput, description: ev.target.value });
              }}
            />
          </Form.Group>
          </Col>
          </Row>

          <center><Button onClick={placesInfo}>Publish</Button></center>
        </Form>
      </Col>
    </Row>
  );
}

function isUserInputValid(userInput) {
  return userInput && userInput.description !== "";
}

function hasFields(space) {
  return space && space.name;
}

export default NewSpace;
