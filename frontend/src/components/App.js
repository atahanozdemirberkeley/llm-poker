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
      const response = await axios.post(`${API_BASE_URL}/start_game`);
      setIsGameStarted(true);
      setLogs([]);
      addLog("New hand dealt");
      setGameState(response.data.gameState);
      if (response.data.aiActions && response.data.aiActions.length > 0) {
        response.data.aiActions.forEach((action) => {
          addLog(
            `PokerBench ${action.action}${
              action.amount ? ` to ${action.amount}` : ""
            }`
          );
        });
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
      addLog(`Player ${action}${amount ? ` to ${amount}` : ""}`);
      setGameState(response.data.gameState);
      if (response.data.aiActions && response.data.aiActions.length > 0) {
        response.data.aiActions.forEach((aiAction) => {
          addLog(
            `PokerBench ${aiAction.action}${
              aiAction.amount ? ` to ${aiAction.amount}` : ""
            }`
          );
        });

        // addLog(
        //   `PokerBench ${response.data.aiActions[-1].action}${
        //     response.data.aiActions[-1].amount
        //       ? ` to ${response.data.aiActions[-1].amount}`
        //       : ""
        //   }`
        // );
      }
      if (response.data.winner) {
        if (response.data.winner === "Player") {
          addLog(`You won ${response.data.pot}!`);
        } else if (response.data.winner === "AI") {
          addLog(`PokerBench won ${response.data.pot}.`);
        } else {
          addLog(`The pot of ${response.data.pot} is split.`);
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const handlePeek = () => {
    if (gameState && !gameState.hasPeeked) {
      setGameState((prevState) => ({
        ...prevState,
        hasPeeked: true,
      }));
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
          playerStack={gameState?.playerStack || 200}
          opponentStack={gameState?.opponentStack || 200}
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
          />
          <Controls
            onCall={() => handleAction("call")}
            onRaise={(amount) => handleAction("raise", amount)}
            onCheck={() => handleAction("check")}
            onFold={() => handleAction("fold")}
            onPeek={handlePeek}
            onNextHand={startNewHand}
            currentBet={gameState?.currentBet || 0}
            isPlayerTurn={gameState?.playerTurn}
            isGameOver={gameState?.isGameOver}
            isGameStarted={isGameStarted}
            playerStack={gameState?.playerStack || 0}
            hasPeeked={gameState?.hasPeeked}
            availableMoves={gameState?.availableMoves || []}
            raiseRange={gameState?.raiseRange || []}
            chipsToCalls={gameState?.chipsToCalls || 0}
          />
        </div>
        <GameLog logs={logs} />
      </div>
    </div>
  );
};

export default App;
