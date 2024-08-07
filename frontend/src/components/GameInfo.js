import React from "react";

const GameInfo = ({ pot, playerStack, opponentStack, stage, WhoseTurn }) => {
  console.log("WhoseTurn Value:", WhoseTurn);
  console.log("Type of WhoseTurn:", typeof WhoseTurn);
  return (
    <div className="game-info">
      <p>Pot: ${pot}</p>
      <p>Your Stack: ${playerStack}</p>
      <p>Opponent Stack: ${opponentStack}</p>
      <p>Stage: {stage}</p>
      <p>Position: {WhoseTurn === true ? "Your Turn" : "PokerBench's Turn"}</p>
    </div>
  );
};

export default GameInfo;
