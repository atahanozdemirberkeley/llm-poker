import React from "react";
import Card from "./Card";

const Player = ({ cards, name }) => {
  return (
    <>
      <div className="player-cards">
        {cards.map((card, index) => (
          <Card key={index} rank={card[0]} suit={card[1]} faceUp={true} />
        ))}
      </div>
      <div className="player-info">{name}</div>
    </>
  );
};

export default Player;
