import React, { useState, useEffect } from "react";
import Board from "./Board";
import "./Game.css";
import * as Constants from "../Constants";
import Player from "./Player";
import _ from "lodash";
import Listener from "../helpers/Socket";
import Pusher from "pusher-js";

export default function Game(props) {
  const [history, setHistory] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isX, setIsX] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);
  const [game, setGame] = useState({});
  const [playerTwo, setPlayerTwo] = useState({});

  let ongoingGame = localStorage.getItem("game");
  if (ongoingGame === null) {
    localStorage.setItem("game", props.match.params.gameId);
  }
  let player = localStorage.getItem("user");
  player = JSON.parse(player);

  // Listener.channel("game-" + props.match.params.gameId).listen(
  //   "NewMove",
  //   (e) => {
  //     console.log("jhadakjshkjs");
  //     console.log(e, "eeee");
  //   }
  // );

  var pusher = new Pusher("50e8ab547f3f550a7a74", {
    cluster: "ap2",
  });
  var channel = pusher.subscribe("game-" + props.match.params.gameId);
  channel.bind(".new-move-made", function (data) {
    console.log("blahhh");
    console.log(data, "dddd");
  });

  const winner = _.isEmpty(game) ? "" : game.result;
  let status;
  if (winner) {
    if (winner === player.user_id) {
      status = "You win!";
    } else {
      status = "You lose!";
    }
  } else {
    status = "Next player: " + (isX ? "X" : "O");
  }

  useEffect(() => {
    fetch(Constants.CREATE_ROOM + "/" + props.match.params.gameId, {
      method: Constants.GET,
    })
      .then((res) => res.json())
      .then((result) => {
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
      });
  }, [gameStatus]);

  const getPlayerTwo = (game) => {
    let player_two =
      game.player_one === player.user_id ? game.player_two : game.player_one;
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
      fetch(Constants.CREATE_MOVE + "/" + props.match.params.gameId, {
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
    <div className="game">
      {_.isEmpty(game) || game.status !== "ACTIVE" ? (
        ""
      ) : (
        <ol>
          <li>
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
          </li>
        </ol>
      )}
      <div className="game-board">
        <Board squares={history} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  );
}