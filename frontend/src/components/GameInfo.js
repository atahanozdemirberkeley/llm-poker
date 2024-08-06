import React from "react";

const GameInfo = ({
  pot,
  playerStack,
  opponentStack,
  stage,
  playerPosition,
}) => {
  return (
    <div className="game-info">
      <p>Pot: ${pot}</p>
      <p>Your Stack: ${playerStack}</p>
      <p>Opponent Stack: ${opponentStack}</p>
      <p>Stage: {stage}</p>
      <p>Player Position: {playerPosition}</p>
    </div>
  );
};

export default GameInfo;
