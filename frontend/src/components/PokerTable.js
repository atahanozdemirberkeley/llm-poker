import React from "react";
import Player from "./Player";
import LLMOpponent from "./LLMOpponent";
import Card from "./Card";

const PokerTable = ({ playerCards, opponentCards, communityCards }) => {
  return (
    <div className="poker-table">
      <div className="opponent-area">
        <LLMOpponent cards={opponentCards} />
      </div>
      <div className="community-cards">
        {communityCards.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} faceUp={true} />
        ))}
      </div>
      <div className="player-area">
        <Player cards={playerCards} name="Player" />
      </div>
    </div>
  );
};

export default PokerTable;
