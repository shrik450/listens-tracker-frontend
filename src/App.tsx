import React from "react";
import { Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./App.css";
import { FeedView } from "./components/FeedView";

const App: React.FC = () => {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
      <Container>
        <Route path="/feed/:id(\d+)" component={FeedView} />
      </Container>
    </div>
  );
};

export default App;
