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
  isGameStarted,
  playerTurn,
  buttonloc,
  stage,
  isGameOver,
}) => {
  console.log("PokerTable props:", {
    playerCards,
    opponentCards,
    communityCards,
    pot,
    playerBet,
    opponentBet,
    playerName,
    isGameStarted,
    playerTurn,
    buttonloc,
    stage,
    isGameOver,
  });
  return (
    <div className="poker-table">
      <div className="opponent-area">
        <LLMOpponent isGameOver={isGameOver} cards={opponentCards} />
        {isGameStarted && (
          <>
            {opponentBet > 0 && (
              <>
                <div className="bet-info opponent-bet">{opponentBet}</div>
              </>
            )}

            {buttonloc === 1 && <div className="dealer-button">D</div>}
          </>
        )}
      </div>
      {isGameStarted && (
        <>
          <div className="pot-display">
            <div className="pot-circle">{pot}</div>
          </div>
        </>
      )}

      <div className="community-cards">
        {communityCards.map((card, index) => (
          <Card key={index} rank={card[0]} suit={card[1]} faceUp={true} />
        ))}
      </div>
      <div className="player-area">
        <Player cards={playerCards} name={playerName} />
        {isGameStarted && (
          <>
            {playerBet > 0 && (
              <>
                <div className="bet-info player-bet">{playerBet}</div>
              </>
            )}
            {buttonloc === 0 && <div className="dealer-button">D</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default PokerTable;
