import React, { Component } from "react";
import JokeList from "./JokeList";

class App extends Component {
  render() {
    return (
      <div className="App">
        <JokeList numJokesToGet={10}/>
      </div>
    );
  }
}

export default App;
