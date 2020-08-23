import React, { useState, useEffect } from "react";
import "../App.css";

import UserProfile from "../helpers/UserProfile";
import * as Constants from "../Constants";
import RoomFinder from "./RoomFinder";
import Header from "./Header";
function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newUserFlag, setNewUserFlag] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (UserProfile.getSession() !== null) {
      setUser(true);
    }
  }, []);
  const handleSubmit = () => {
    let data = { name: `${name}`, email: `${email}` };
    fetch(Constants.CREATE_USER_URL, {
      method: `${Constants.CREATE}`,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        UserProfile.setSession(
          result.data.name,
          result.data.email,
          result.data.id
        );
        setUser(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const newUser = (
    <div>
      <input
        placeholder="nickname"
        name="name"
        label="what should we call you?"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        placeholder="Email"
        name="email"
        label="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
  const returningUser = (
    <div>
      <input
        placeholder="Email"
        name="email"
        label="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );

  return (
    <div className="home">
      <h2>Tic Tac Toe</h2>
      {!user ? (
        <>
          <div>
            <button
              onClick={() => {
                setNewUserFlag(true);
              }}
            >
              I am a new User
            </button>
            <button
              onClick={() => {
                setNewUserFlag(false);
              }}
            >
              I am a returning User
            </button>
          </div>
          <div>{newUserFlag ? newUser : returningUser}</div>
        </>
      ) : (
        <>
          <Header user={JSON.parse(UserProfile.getSession())} />
          <RoomFinder />
        </>
      )}
    </div>
  );
}

export default Home;
