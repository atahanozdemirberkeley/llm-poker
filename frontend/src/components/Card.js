import React from "react";
import backCard from "../images/2B.svg";
import twoC from "../images/2C.svg";
import threeD from "../images/3D.svg";

const Card = ({ rank, suit, faceUp }) => {
  if (faceUp === false) {
    return <img src={backCard} alt="Card Back" className="card" />;
  }

  const cardName = `${rank}${suit.charAt(0).toUpperCase()}.svg`;

  if (cardName === "2C.svg") {
    return <img src={twoC} alt={`${rank} of ${suit}`} className="card" />;
  }

  if (cardName === "3D.svg") {
    return <img src={threeD} alt={`${rank} of ${suit}`} className="card" />;
  }
  return (
    <img
      src={require(`../images/${cardName}`)}
      alt={`${rank} of ${suit}`}
      className="card"
    />
  );
};

export default Card;
