import React, { useState, useEffect } from "react";
import Board from "./Board";
import "./Game.css";
import * as Constants from "../Constants";
import Player from "./Player";
import _ from "lodash";
import Pusher from "pusher-js";

export default function Game(props) {
  const [history, setHistory] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isX, setIsX] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);
  const [game, setGame] = useState(null);
  const [playerTwo, setPlayerTwo] = useState({});
  const [dataFetched, setIsFetched] = useState(false);
  const [winner, setWinner] = useState(false);
  const [status, setSatus] = useState(false);

  let ongoingGame = localStorage.getItem("game");
  if (ongoingGame === null) {
    localStorage.setItem("game", props.match.params.gameId);
  }
  let player = localStorage.getItem("user");
  player = JSON.parse(player);

  var pusher = new Pusher("50e8ab547f3f550a7a74", {
    cluster: "ap2",
  });
  var channel = pusher.subscribe("game-" + props.match.params.gameId);

  const getWinner = (curGame) => {
    setWinner(curGame.result);
    console.log(curGame);
    if (curGame.result) {
      if (curGame.result === player.user_id) {
        setSatus("You win!");
      } else {
        setSatus("You lose!");
      }
    } else {
      setSatus("Next player: " + (isX ? "X" : "O"));
    }
  };
  useEffect(() => {
    fetch(Constants.CREATE_ROOM + "/" + props.match.params.gameId, {
      method: Constants.GET,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        let gameStatus =
          result.game.status === "ACTIVE" &&
          result.game.next_move_by === player.user_id;
        if (result.game.first_move_by === player.user_id) {
          setIsX(true);
        }
        setGameStatus(gameStatus);
        setGame(result.data);
        if (result.moves.length > 0) {
          reconstructGameHistory(result.moves);
        }
        getPlayerTwo(result.game);
        getWinner(result.game);
      });
    channel.bind("new-move-made", function (data) {
      let result = data.message;
      let gameStatus =
        result.game.status === "ACTIVE" &&
        result.game.next_move_by === player.user_id;
      if (result.game.first_move_by === player.user_id) {
        setIsX(true);
      }
      setGameStatus(gameStatus);
      setGame(result.data);
      if (result.moves.length > 0) {
        reconstructGameHistory(result.moves);
      }
      getWinner(result.game);
    });
    setIsFetched(true);
    return function cleanup() {
      channel.unbind();
      localStorage.removeItem("game");
    };
  }, []);

  const refreshGame = (result) => {
    console.log(result);
  };

  const getPlayerTwo = (curgame) => {
    let player_two =
      curgame.player_one === player.user_id
        ? curgame.player_two
        : curgame.player_one;
    fetch(Constants.CREATE_USER_URL + "/" + player_two)
      .then((res) => res.json())
      .then((result) => {
        setPlayerTwo(result.data);
      });
  };

  const reconstructGameHistory = (moves) => {
    let his = Array(9).fill(null);

    moves.forEach((move, i) => {
      let j = parseInt(move.row) * 3 + parseInt(move.column);
      his[j] = move.XO;
    });

    setHistory(his);
    setStepNumber(moves.length);
  };

  const handleClick = (i) => {
    console.log(gameStatus, "gamestatus");
    if (gameStatus) {
      if (history[i]) {
        return;
      }
      let r = Math.floor(i / 3);
      let c = i % 3;
      let his = history.slice();
      his[i] = isX ? "X" : "O";
      setHistory(his);
      let movedata = {
        move_number: stepNumber + 1,
        played_by: player.user_id,
        XO: isX ? "X" : "O",
        row: r,
        column: c,
        time_left: 12,
        player_two: playerTwo.id,
        game_id: props.match.params.gameId,
      };
      fetch(Constants.CREATE_MOVE, {
        method: Constants.UPDATE,
        body: JSON.stringify(movedata),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          let gameStatus =
            result.data.status === "ACTIVE" &&
            result.data.next_move_by === player.user_id;
          setGameStatus(gameStatus);
          setGame(result.data);
        });
    } else {
      return;
    }
  };

  return (
    <>
      <div className="game">
        {game !== null ? (
          <ol>
            {/* <li>
              <Player
                player={player}
                timer={game.timer}
                timerStatus={gameStatus}
              />
            </li>
            <li>
              <Player
                player={playerTwo}
                timer={game.timer}
                timerStatus={!gameStatus}
              />
            </li> */}
          </ol>
        ) : (
          ""
        )}

        <div className="game-board">
          <Board squares={history} onClick={(i) => handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    </>
  );
}
