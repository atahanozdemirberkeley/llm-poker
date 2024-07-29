import React from "react";
import Card from "./Card";

const LLMOpponent = ({ cards }) => {
  return (
    <>
      <div className="opponent-cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            rank={card.rank}
            suit={card.suit}
            faceUp={card.faceUp}
          />
        ))}
      </div>
      <div className="opponent-info">PokerBench</div>
    </>
  );
};

export default LLMOpponent;
