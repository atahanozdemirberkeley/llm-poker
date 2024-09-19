import React, { useState } from "react";
import axios from "axios";
import PokerTable from "./PokerTable";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import GameLog from "./GameLog";
import UsernameModal from "./UsernameModal";

const API_BASE_URL = "http://127.0.0.1:5001/api";

const App = () => {
  const [gameState, setGameState] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [logs, setLogs] = useState([]);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);

  // const fetchGameState = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/get_game_state`);
  //     setGameState(response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching game state:", error);
  //   }
  // };

  const startNewHand = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start_game`);
      setIsGameStarted(true);
      setLogs([]);
      addLog("New Hand Dealt");
      setGameState(response.data.gameState);
      if (!response.data.gameState.playerTurn) {
        handleAIAction();
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
      const response = await axios.post(`${API_BASE_URL}/player_action`, {
        action,
        amount,
      });
      addLog(`You ${action.toUpperCase()}${amount ? ` ${amount}` : ""}`);
      setGameState(response.data.gameState);

      if (response.data.winner) {
        handleWinner(response.data.winner, response.data.pot);
      } else if (!response.data.gameState.playerTurn) {
        handleAIAction();
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const handleAIAction = async () => {
    try {
      setIsWaitingForAI(true);
      const response = await axios.get(`${API_BASE_URL}/ai_action`);
      setGameState(response.data.gameState);
      if (response.data.aiAction) {
        addLog(
          `PokerBench ${response.data.aiAction.action}${
            response.data.aiAction.amount
              ? ` to ${response.data.aiAction.amount}`
              : ""
          }`
        );
      }
      if (response.data.winner) {
        handleWinner(response.data.winner, response.data.pot);
      }
      if (!response.data.gameState.playerTurn) {
        handleAIAction();
      }
    } catch (error) {
      console.error("Error getting AI action:", error);
    } finally {
      setIsWaitingForAI(false);
    }
  };

  const handleWinner = (winner, pot) => {
    if (winner === "Player") {
      addLog(`You won ${pot}!`);
    } else if (winner === "AI") {
      addLog(`PokerBench won ${pot}.`);
    } else {
      addLog(`The pot of ${pot} is split.`);
    }
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
          playerStack={gameState?.playerStack || 0}
          opponentStack={gameState?.opponentStack || 0}
          stage={gameState?.stage || "PREHAND"}
          whoseTurn={gameState?.playerTurn}
        />
        <div className="table-and-controls">
          <PokerTable
            playerCards={gameState?.playerCards || []}
            opponentCards={gameState?.opponentCards || []}
            communityCards={gameState?.communityCards || []}
            playerBet={gameState?.playerBet || 0}
            opponentBet={gameState?.OpponentBet || 0}
            stage={gameState?.stage || "PREHAND"}
            pot={gameState?.pot}
            playerName={username}
            isGameStarted={isGameStarted}
            buttonloc={gameState?.buttonloc}
            isGameOver={gameState?.isGameOver}
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
            playerStack={gameState?.playerStack || 0}
            availableMoves={gameState?.availableMoves || []}
            raiseRange={gameState?.raiseRange || []}
            chipsToCalls={gameState?.chipsToCalls || 0}
            isPlayerIN={gameState?.isPlayerIN}
            isWaitingForAI={isWaitingForAI}
            playerBet={gameState?.playerBet || 0}
            pot={gameState?.pot || 0}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
