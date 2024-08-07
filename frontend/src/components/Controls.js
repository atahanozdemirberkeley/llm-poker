import React, { useState } from "react";

const Controls = ({
  onNextHand,
  onCall,
  onRaise,
  onCheck,
  onFold,
  onPeek,
  currentBet,
  hasPeeked,
  isPlayerTurn,
  isGameOver,
  playerStack,
  isGameStarted,
  availableMoves,
  raiseRange,
  chipsToCalls,
}) => {
  const [showRaiseOptions, setShowRaiseOptions] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(
    raiseRange ? raiseRange[0] : currentBet * 2
  );

  const handleRaiseClick = () => {
    setShowRaiseOptions(true);
  };

  const handleBackClick = () => {
    setShowRaiseOptions(false);
  };

  const handleRaiseConfirm = () => {
    onRaise(raiseAmount);
    setShowRaiseOptions(false);
  };

  const handleSliderChange = (e) => {
    setRaiseAmount(Number(e.target.value));
  };

  const raiseOptions = [
    { label: "MIN RAISE", value: raiseRange ? raiseRange[0] : currentBet * 2 },
    { label: "1/2 POT", value: Math.floor(currentBet * 1.5) },
    { label: "POT", value: currentBet * 2 },
    { label: "ALL IN", value: raiseRange ? raiseRange[1] : playerStack },
  ];

  console.log("playerturn Value:", isPlayerTurn);
  console.log("Type of playerturn:", typeof isPlayerTurn);

  return (
    <div className="controls">
      {!showRaiseOptions ? (
        <>
          <button
            className="control-button next-hand"
            onClick={onNextHand}
            disabled={isGameStarted && !isGameOver}
          >
            {isGameStarted
              ? isGameOver
                ? "NEXT HAND"
                : "GAME IN PROGRESS"
              : "START GAME"}
          </button>

          <button
            className="control-button"
            onClick={onCall}
            disabled={
              (!isGameStarted || isGameOver) &&
              !isPlayerTurn &&
              !availableMoves.includes("CALL")
            }
          >
            CALL {chipsToCalls > 0 && chipsToCalls}
          </button>

          <button
            className="control-button"
            onClick={handleRaiseClick}
            disabled={
              (!isGameStarted || isGameOver) &&
              !isPlayerTurn &&
              !availableMoves.includes("RAISE")
            }
          >
            RAISE
          </button>

          <button
            className="control-button"
            onClick={onCheck}
            disabled={
              (!isGameStarted || isGameOver) &&
              !isPlayerTurn &&
              !availableMoves.includes("CHECK")
            }
          >
            CHECK
          </button>

          <button
            className="control-button fold-button"
            onClick={onFold}
            disabled={
              (!isGameStarted || isGameOver) &&
              !isPlayerTurn &&
              !availableMoves.includes("FOLD")
            }
          >
            FOLD
          </button>

          <button
            className={`control-button ${hasPeeked ? "peeked" : "notpeeked"}`}
            onClick={onPeek}
            disabled={!isGameOver}
          >
            PEEK
          </button>

          {!isPlayerTurn && isGameStarted && !isGameOver && (
            <div>Waiting for opponent...</div>
          )}
        </>
      ) : (
        <div className="raise-options">
          <div className="raise-amount">
            <span>Your bet</span>
            <div className="raise-value">{raiseAmount}</div>
          </div>
          <div className="raise-buttons">
            {raiseOptions.map((option) => (
              <button
                key={option.label}
                className="raise-option-button"
                onClick={() => setRaiseAmount(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={raiseRange ? raiseRange[0] : currentBet * 2}
            max={raiseRange ? raiseRange[1] : playerStack}
            value={raiseAmount}
            onChange={handleSliderChange}
            className="raise-slider"
          />
          <div className="raise-controls">
            <button
              className="control-button back-button"
              onClick={handleBackClick}
            >
              BACK
            </button>
            <button
              className="control-button raise-confirm"
              onClick={handleRaiseConfirm}
            >
              RAISE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
