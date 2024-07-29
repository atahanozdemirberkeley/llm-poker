import React from "react";

const GameInfo = ({ pot, playerStack, opponentStack }) => {
  return (
    <div className="game-info">
      <p>Pot: ${pot}</p>
      <p>Your Stack: ${playerStack}</p>
      <p>Opponent Stack: ${opponentStack}</p>
    </div>
  );
};

export default GameInfo;
