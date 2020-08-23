import React from "react";

import "./App.css";
import Game from "./components/Game";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { setPusherClient } from "react-pusher";
import Pusher from "pusher-js";

const pusherClient = new Pusher("50e8ab547f3f550a7a74", {
  key: "50e8ab547f3f550a7a74",
  cluster: "ap2",
});

setPusherClient(pusherClient);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route exact path="/game/:gameId" component={Game} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
