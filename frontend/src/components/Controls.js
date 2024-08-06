import React, { useState } from "react";

const Controls = ({
  onNextHand,
  onCall,
  onRaise,
  onCheck,
  onFold,
  currentBet,
  isPlayerTurn,
  isGameOver,
  playerStack,
  isGameStarted,
}) => {
  const [showRaiseOptions, setShowRaiseOptions] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(currentBet * 2);

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
    { label: "MIN RAISE", value: currentBet * 2 },
    { label: "1/2 POT", value: Math.floor(currentBet * 1.5) },
    { label: "POT", value: currentBet * 2 },
    { label: "ALL IN", value: playerStack },
  ];

  return (
    <div className="controls">
      <button
        className="control-button next-hand"
        onClick={onNextHand}
        disabled={isGameStarted && !isGameOver}
      >
        {isGameStarted ? "NEXT HAND" : "START GAME"}
      </button>

      <button
        className="control-button"
        onClick={onCall}
        disabled={!isGameStarted || !isPlayerTurn || isGameOver}
      >
        CALL {currentBet}
      </button>

      <button
        className="control-button"
        onClick={handleRaiseClick}
        disabled={!isGameStarted || !isPlayerTurn || isGameOver}
      >
        RAISE
      </button>

      <button
        className="control-button"
        onClick={onCheck}
        disabled={!isGameStarted || !isPlayerTurn || isGameOver}
      >
        CHECK
      </button>

      <button
        className="control-button fold-button"
        onClick={onFold}
        disabled={!isGameStarted || !isPlayerTurn || isGameOver}
      >
        FOLD
      </button>

      {!isPlayerTurn && isGameStarted && !isGameOver && (
        <div>Waiting for opponent...</div>
      )}

      {showRaiseOptions && (
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
            min={currentBet * 2}
            max={playerStack}
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
