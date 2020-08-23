import React, { useState, useEffect } from "react";
import Board from "./Board";
import "./Game.css";
import * as Constants from "../Constants";
import Player from "./Player";
import Pusher from "pusher-js";
import Header from "./Header";

export default function Game(props) {
  const [history, setHistory] = useState([]);
  let stepNumber = 0;
  let isX = false;
  const [xo, setXO] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);
  const [game, setGame] = useState(null);
  const [playerTwo, setPlayerTwo] = useState({});
  const [status, setSatus] = useState(false);
  const [moveHistory, setMoves] = useState(false);

  var pusher = new Pusher("50e8ab547f3f550a7a74", {
    cluster: "ap2",
  });
  var ongoingGame = localStorage.getItem("game");
  if (ongoingGame === null) {
    localStorage.setItem("game", props.match.params.gameId);
  }
  var player = localStorage.getItem("user");
  player = JSON.parse(player);

  const getWinner = (curGame) => {
    let winner = curGame.result;
    console.log(curGame);
    console.log(playerTwo);
    console.log(stepNumber);
    console.log(isX, "is x");
    console.log(winner);
    if (winner !== null) {
      if (winner === player.user_id) {
        setSatus("You win!");
      } else if (winner === 0) {
        setSatus("Game Draw!!!");
      } else {
        setSatus("You lose!");
      }
    } else {
      setSatus("");
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
          isX = true;
          setXO(true);
        }
        setSatus(
          "You play : " +
            (isX ? "X" : "O") +
            ". <BR />Next turn : " +
            (gameStatus ? playerTwo.name : player.name)
        );
        setGameStatus(gameStatus);
        setGame(result.game);
        if (result.moves.length > 0) {
          reconstructGameHistory(result.moves);
        }
        getPlayerTwo(result.game);
        getWinner(result.game);
      });
    var channel = pusher.subscribe("game-" + props.match.params.gameId);
    channel.bind("new-move-made", function (data) {
      let result = data.message;
      let gameStatus =
        result.game.status === "ACTIVE" &&
        result.game.next_move_by === player.user_id;
      if (result.game.first_move_by === player.user_id) {
        isX = true;
        setXO(true);
      }
      setSatus("You play : " + (isX ? "X" : "O"));
      setGameStatus(gameStatus);
      setGame(result.game);
      if (result.moves.length > 0) {
        reconstructGameHistory(result.moves);
      }
      getWinner(result.game);
      getPlayerTwo(result.game);
    });

    return function cleanup() {
      channel.unbind();
      localStorage.removeItem("game");
    };
  }, []);

  const getPlayerTwo = (curgame) => {
    if (curgame.player_two) {
      let player_two =
        curgame.player_one === player.user_id
          ? curgame.player_two
          : curgame.player_one;

      fetch(Constants.CREATE_USER_URL + "/" + player_two)
        .then((res) => res.json())
        .then((result) => {
          setPlayerTwo(result.data);
        });
    }
  };

  const reconstructGameHistory = (moves) => {
    let his = Array(9).fill(null);
    let mov = [];
    moves.forEach((move, i) => {
      let j = parseInt(move.row) * 3 + parseInt(move.column);
      his[j] = move.XO;
      mov[i] = (
        <li key={i}>
          {move.XO} : {move.row} , {move.column}
        </li>
      );
    });
    setMoves(mov);
    setHistory(his);
    stepNumber = moves.length;
  };

  const handleClick = (i) => {
    console.log(gameStatus, "hfjkhksdjhskd");
    if (gameStatus) {
      if (history[i]) {
        return;
      }
      let r = Math.floor(i / 3);
      let c = i % 3;
      let his = history.slice();
      his[i] = xo ? "X" : "O";
      setHistory(his);
      stepNumber = stepNumber + 1;
      let movedata = {
        move_number: stepNumber,
        played_by: player.user_id,
        XO: xo ? "X" : "O",
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
          console.log(result, "update the move");
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
      <Header user={player} plays={xo ? "x" : "o"} />
      <div className="game">
        {game ? (
          <ol>
            <li>
              <Player
                player={player}
                timer={game.timer}
                timerStatus={gameStatus}
              />
            </li>
            {playerTwo ? (
              <li>
                <Player
                  player={playerTwo}
                  timer={game.timer}
                  timerStatus={!gameStatus}
                />
              </li>
            ) : (
              ""
            )}
          </ol>
        ) : (
          ""
        )}

        <div className="game-board">
          <Board squares={history} onClick={(i) => handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>Game id : {props.match.params.gameId}</div>
          <div> {game ? "Game status is : " + game.status : ""}</div>
          <div>
            {game && game.status === "ACTIVE"
              ? gameStatus
                ? "Current move : you"
                : "Current move : " + playerTwo.name
              : ""}
          </div>
        </div>
        <div className="game-history">
          History of moves:<ol>{moveHistory}</ol>
        </div>
      </div>
      <div></div>
    </>
  );
}
