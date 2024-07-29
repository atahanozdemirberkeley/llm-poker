import React, { useState, useEffect } from "react";
import PokerTable from "./PokerTable";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import GameLog from "./GameLog";
import { dealCards } from "./deckUtils";

const App = () => {
  const [gameState, setGameState] = useState({
    pot: 0,
    currentBet: 20,
    playerStack: 1000,
    opponentStack: 1000,
    playerCards: [],
    opponentCards: [],
    communityCards: [],
    hasPeeked: false,
  });

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    startNewHand();
  }, []);

  const startNewHand = () => {
    const { players, communityCards } = dealCards(2, 2, 5);
    setGameState((prevState) => ({
      ...prevState,
      pot: 30, // Small blind + Big blind
      playerStack: 990, // Assuming player posts big blind
      opponentStack: 995, // Assuming opponent posts small blind
      playerCards: players[0].map((card) => ({ ...card, faceUp: true })),
      opponentCards: players[1].map((card) => ({ ...card, faceUp: false })),
      communityCards: communityCards.map((card) => ({ ...card, faceUp: true })),
      currentBet: 20, // Big blind amount
      hasPeeked: false,
    }));
    addLog("New hand dealt");
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleCall = (amount) => {
    setGameState((prevState) => ({
      ...prevState,
      pot: prevState.pot + amount,
      playerStack: prevState.playerStack - amount,
    }));
    addLog(`Called ${amount}`);
  };

  const handleRaise = (amount) => {
    setGameState((prevState) => ({
      ...prevState,
      pot: prevState.pot + amount,
      playerStack: prevState.playerStack - amount,
      currentBet: amount,
    }));
    addLog(`Raised to ${amount}`);
  };

  const handleCheck = () => {
    addLog("Checked");
  };

  const handleFold = () => {
    setGameState((prevState) => ({
      ...prevState,
      opponentStack: prevState.opponentStack + prevState.pot,
      pot: 0,
    }));
    addLog("Folded");
  };

  const handleNextHand = () => {
    setLogs([]);
    startNewHand();
  };

  const handlePeek = () => {
    if (!gameState.hasPeeked) {
      setGameState((prevState) => ({
        ...prevState,
        opponentCards: prevState.opponentCards.map((card) => ({
          ...card,
          faceUp: true,
        })),
        hasPeeked: true,
      }));
    }
  };

  return (
    <div className="app">
      <h1>PokerBench: Play Heads Up Poker with an LLM!</h1>
      <div className="game-container">
        <GameInfo
          pot={gameState.pot}
          playerStack={gameState.playerStack}
          opponentStack={gameState.opponentStack}
        />
        <div className="table-and-controls">
          <PokerTable
            playerCards={gameState.playerCards}
            opponentCards={gameState.opponentCards}
            communityCards={gameState.communityCards}
          />
          <Controls
            onCall={handleCall}
            onRaise={handleRaise}
            onCheck={handleCheck}
            onFold={handleFold}
            onNextHand={handleNextHand}
            onPeek={handlePeek}
            currentBet={gameState.currentBet}
            hasPeeked={gameState.hasPeeked}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
