import React from "react";
import Player from "./Player";
import LLMOpponent from "./LLMOpponent";

const PokerTable = () => {
  return (
    <div className="poker-table">
      <div className="table-felt">
        <div className="opponent-area">
          <LLMOpponent />
        </div>
        <div className="community-cards">
          {/* Community cards will go here */}
        </div>
        <div className="player-area">
          <Player />
        </div>
      </div>
    </div>
  );
};

export default PokerTable;
