import React, { useState } from "react";
import PokerTable from "./PokerTable";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import GameLog from "./GameLog";

const App = () => {
  const [gameState, setGameState] = useState({
    pot: 0,
    currentBet: 20,
    playerStack: 1000,
    opponentStack: 1000,
  });

  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleCall = (amount) => {
    addLog(`Called ${amount}`);
  };

  const handleRaise = (amount) => {
    addLog(`Raised to ${amount}`);
  };

  const handleCheck = () => {
    addLog("Checked");
  };

  const handleFold = () => {
    addLog("Folded");
  };

  const handleNextHand = () => {
    setLogs([]);
  };

  return (
    <div className="app">
      <h1>Play Heads Up Poker with an LLM!</h1>
      <div className="game-container">
        <GameInfo
          pot={gameState.pot}
          playerStack={gameState.playerStack}
          opponentStack={gameState.opponentStack}
        />
        <div className="table-and-controls">
          <PokerTable />
          <Controls
            onCall={handleCall}
            onRaise={handleRaise}
            onCheck={handleCheck}
            onFold={handleFold}
            onNextHand={handleNextHand}
            currentBet={gameState.currentBet}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
