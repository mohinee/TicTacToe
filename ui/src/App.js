import React from "react";

import "./App.css";
import Game from "./components/Game";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
