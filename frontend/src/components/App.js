import React, { useState } from "react";
import axios from "axios";
import PokerTable from "./PokerTable";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import GameLog from "./GameLog";
import UsernameModal from "./UsernameModal";

const API_BASE_URL = "http://127.0.0.1:5000/api";

const App = () => {
  const [gameState, setGameState] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [logs, setLogs] = useState([]);

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_game_state`);
      setGameState(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  const startNewHand = async () => {
    try {
      await axios.post(`${API_BASE_URL}/start_game`);
      setIsGameStarted(true);
      addLog("New hand dealt");
      const newState = await fetchGameState();
      if (newState && !newState.playerTurn) {
        await handleAITurn();
      }
    } catch (error) {
      console.error("Error starting new hand:", error);
    }
  };

  const handleUsernameSubmit = (name) => {
    setUsername(name);
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleAction = async (action, amount = null) => {
    try {
      await axios.post(`${API_BASE_URL}/player_action`, {
        action,
        amount,
      });
      addLog(`Player ${action}${amount ? ` to ${amount}` : ""}`);
      const newState = await fetchGameState();
      if (newState && !newState.playerTurn && !newState.isGameOver) {
        await handleAITurn();
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const handleAITurn = async () => {
    // This function simulates waiting for AI's turn
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    await fetchGameState(); // Fetch the updated state after AI's action
  };

  if (!username) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="app">
      <h1>PokerBench: Play Heads Up Poker with an LLM!</h1>
      <div className="game-container">
        <GameInfo
          pot={gameState?.pot || 0}
          playerStack={gameState?.playerStack || 1000}
          opponentStack={gameState?.opponentStack || 1000}
          stage={gameState?.stage || "PREHAND"}
        />
        <div className="table-and-controls">
          <PokerTable
            playerCards={gameState?.playerCards || []}
            opponentCards={gameState?.opponentCards || []}
            communityCards={gameState?.communityCards || []}
            pot={gameState?.pot || 0}
            playerName={username}
          />
          <Controls
            onCall={() => handleAction("call")}
            onRaise={(amount) => handleAction("raise", amount)}
            onCheck={() => handleAction("check")}
            onFold={() => handleAction("fold")}
            onNextHand={startNewHand}
            currentBet={gameState?.currentBet || 0}
            isPlayerTurn={gameState?.playerTurn}
            isGameOver={gameState?.isGameOver}
            isGameStarted={isGameStarted}
            playerStack={gameState?.playerStack || 1000}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
