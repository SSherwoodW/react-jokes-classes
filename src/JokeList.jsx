import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        jokes: [],
        loading: true,
    };
  }

  componentDidMount() {
    this.getJokes();
  }

  async getJokes() {
    const { numJokesToGet } = this.props;
    const { jokes } = this.state;
    let j = [...jokes];
    let seenJokes = new Set();

    try {
      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j, loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes = () => {
    this.setState({ jokes: [], loading: true }, this.getJokes);
  };

  vote = (id, delta) => {
    this.setState((prevState) => ({
      jokes: prevState.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  };

  render() {
      const { jokes, loading } = this.state;
      
      if (loading) {
          return <p>Loading jokes...</p>
      }

    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeList;