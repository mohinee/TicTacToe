import React, { useState, useEffect } from "react";
import "./Game.css";
function Player(props) {
  const [timeLeft, setTimeLeft] = useState(props.timer);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });
  const calculateTimeLeft = () => {
    return timeLeft - 1;
  };

  return (
    <>
      <span>{props.player.name}</span>
      {props.timerStatus && !isNaN(timeLeft) ? (
        <span>Time left: {timeLeft} sec</span>
      ) : (
        ""
      )}
    </>
  );
}

export default Player;
