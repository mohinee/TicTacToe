import React, { useState, useEffect } from "react";
import "../App.css";

import * as Constants from "../Constants";
import { useHistory } from "react-router-dom";

function RoomFinder() {
  const [mode, setMode] = useState(null);
  const [timer, setTimer] = useState(15);
  let history = useHistory();
  const [roomId, setRoomId] = useState("");
  const [list, setList] = useState("");
  useEffect(() => {
    // switch (mode) {
    //   case "Create":
    //     console.log("new room created");
    //     break;
    //   case "Join":
    //     console.log("joined and existing room");
    //     break;
    //   case "Find":
    //     console.log("show all existing rooms");
    //     break;
    // }
  }, [mode]);

  const handleClick = (e) => {
    setMode(e.target.name);
  };

  const handleListSelect = (e) => {
    setRoomId(e.target.key);
  };
  const getAllRooms = () => {
    console.log("get list of all rooms");
    fetch(Constants.GET_ACTIVE_ROOM_LIST, {
      method: `${Constants.GET}`,
    })
      .then((res) => res.json())
      .then((result) => {
        let list = result.data.map((room, i) => {
          return (
            <button onClick={handleListSelect} key={room.game_id}>
              Room {i}
            </button>
          );
        });
        console.log(list);
        setList(list);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const createRoom = () => {
    let player = localStorage.getItem("user");
    player = JSON.parse(player);
    let data = {
      player_one: `${player.user_id}`,
      timer: `${timer}`,
    };
    fetch(Constants.CREATE_ROOM, {
      method: `${Constants.CREATE}`,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        history.push("/game/" + result.game_id);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const joinRoomWithGameId = () => {
    let player = localStorage.getItem("user");
    player = JSON.parse(player);
    let data = {
      player_two: player.user_id,
      first_move_by: player.user_id,
    };
    fetch(Constants.JOIN_ROOM + roomId, {
      method: `${Constants.UPDATE}`,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        history.push("/game/" + roomId);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <>
      <div>
        <button name="Create" onClick={handleClick}>
          Create a Room
        </button>
        <button name="Join" onClick={handleClick}>
          Join a room
        </button>
        <button name="Find" onClick={handleClick}>
          Rooms Available
        </button>
      </div>
      {mode === "Create" ? (
        <div>
          <input
            placeholder="enter max time for a move"
            value={timer}
            onChange={(e) => {
              setTimer(e.target.value);
            }}
          />
          <button onClick={createRoom}>Create Room</button>
        </div>
      ) : (
        ""
      )}
      {mode === "Join" ? (
        <div>
          <input
            placeholder="enter room id"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <button onClick={joinRoomWithGameId}>Join Room</button>
        </div>
      ) : (
        ""
      )}
      {mode === "Find" ? { getAllRooms } : ""}
    </>
  );
}

export default RoomFinder;
