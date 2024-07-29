import React from "react";

const GameLog = ({ logs }) => {
  return (
    <div className="game-log">
      <h3>Game Log</h3>
      <div className="log-entries">
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLog;
