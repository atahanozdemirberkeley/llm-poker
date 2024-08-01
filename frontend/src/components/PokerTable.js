import React from "react";
import Player from "./Player";
import LLMOpponent from "./LLMOpponent";
import Card from "./Card";

const PokerTable = ({
  playerCards,
  opponentCards,
  communityCards,
  pot,
  playerBet,
  opponentBet,
  playerName,
}) => {
  return (
    <div className="poker-table">
      <div className="opponent-area">
        <LLMOpponent cards={opponentCards} />
        <div className="bet-info opponent-bet">
          {opponentBet > 0 && opponentBet}
        </div>
      </div>
      <div className="pot-display">
        <div className="pot-circle">{pot}</div>
      </div>
      <div className="community-cards">
        {communityCards.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} faceUp={true} />
        ))}
      </div>
      <div className="player-area">
        <Player cards={playerCards} name={playerName} />
        <div className="bet-info player-bet">{playerBet > 0 && playerBet}</div>
      </div>
    </div>
  );
};

export default PokerTable;
