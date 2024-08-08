import React from "react";
import Card from "./Card";

const LLMOpponent = ({ cards, isGameOver }) => {
  return (
    <>
      <div className="opponent-cards">
        {cards.map((card, index) => (
          <Card key={index} rank={card[0]} suit={card[1]} faceUp={isGameOver} />
        ))}
      </div>
      <div className="opponent-info">PokerBench</div>
    </>
  );
};

export default LLMOpponent;
