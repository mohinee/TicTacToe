import React from "react";

function Header(props) {
  return (
    <div className="header-bar">
      Hi {props.user.name} {props.plays ? "Plays : " + props.plays : ""}
    </div>
  );
}

export default Header;
