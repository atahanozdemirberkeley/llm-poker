import React, { useState, useEffect } from "react";
import axios from "axios";
import PokerTable from "./PokerTable";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import GameLog from "./GameLog";
import UsernameModal from "./UsernameModal";

const API_BASE_URL = "http://localhost:5000/api";

const App = () => {
  const [gameState, setGameState] = useState(null);
  const [username, setUsername] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (username) {
      startNewHand();
    }
  }, [username]);

  const startNewHand = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start_game`);
      setGameState(response.data);
      addLog("New hand dealt");
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
      const response = await axios.post(`${API_BASE_URL}/player_action`, {
        action,
        amount,
      });
      setGameState(response.data);
      addLog(`Player ${action}${amount ? ` to ${amount}` : ""}`);
      if (response.data.is_game_over) {
        addLog("Hand is over");
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  if (!username) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <h1>PokerBench: Play Heads Up Poker with an LLM!</h1>
      <div className="game-container">
        <GameInfo
          pot={gameState.pot}
          playerStack={gameState.player_stack}
          opponentStack={gameState.ai_stack}
        />
        <div className="table-and-controls">
          <PokerTable
            playerCards={gameState.player_cards}
            opponentCards={gameState.ai_cards || []}
            communityCards={gameState.community_cards}
            pot={gameState.pot}
            playerName={username}
          />
          <Controls
            onCall={() => handleAction("call")}
            onRaise={(amount) => handleAction("raise", amount)}
            onCheck={() => handleAction("check")}
            onFold={() => handleAction("fold")}
            onNextHand={startNewHand}
            currentBet={gameState.current_bet}
            isPlayerTurn={gameState.player_turn}
            isGameOver={gameState.is_game_over}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
