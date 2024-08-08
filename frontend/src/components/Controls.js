import React, { useState, useEffect } from "react";

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
  availableMoves,
  raiseRange,
  chipsToCalls,
  isPlayerIN,
  isWaitingForAI,
  playerBet,
  pot,
}) => {
  const [showRaiseOptions, setShowRaiseOptions] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(
    raiseRange ? raiseRange[0] : 0
  );
  const [customBet, setCustomBet] = useState("");

  useEffect(() => {
    if (raiseRange) {
      setRaiseAmount(raiseRange[0]);
    }
  }, [raiseRange]);

  const handleRaiseClick = () => {
    setShowRaiseOptions(true);
  };

  const handleBackClick = () => {
    setShowRaiseOptions(false);
    setCustomBet("");
  };

  const handleRaiseConfirm = () => {
    const totalBet = parseInt(raiseAmount) + playerBet;
    onRaise(totalBet);
    setShowRaiseOptions(false);
    setCustomBet("");
  };

  const handleSliderChange = (e) => {
    setRaiseAmount(Number(e.target.value));
    setCustomBet("");
  };

  const handleCustomBetChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (Number(value) >= raiseRange[0] && Number(value) <= raiseRange[1])
    ) {
      setCustomBet(value);
      if (value !== "") {
        setRaiseAmount(Number(value));
      }
    }
  };

  const handleAllIn = () => {
    setRaiseAmount(playerStack - playerBet);
    setCustomBet("");
  };

  const raiseOptions = [
    { label: "MIN RAISE", value: raiseRange ? raiseRange[0] : currentBet * 2 },
    { label: "POT", value: pot },
    { label: "ALL IN", value: playerStack - playerBet },
  ];

  if (pot / 2 > raiseRange[0]) {
    raiseOptions.splice(1, 0, { label: "1/2 POT", value: Math.floor(pot / 2) });
  }

  const isButtonDisabled = (action) => {
    return (
      !isGameStarted ||
      isGameOver ||
      !isPlayerTurn ||
      isPlayerIN ||
      !availableMoves.includes(action)
    );
  };

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
            disabled={isButtonDisabled("CALL")}
          >
            CALL {chipsToCalls > 0 && chipsToCalls}
          </button>

          <button
            className="control-button"
            onClick={handleRaiseClick}
            disabled={
              !isGameStarted ||
              isGameOver ||
              !isPlayerTurn ||
              !availableMoves.includes("RAISE")
            }
          >
            RAISE
          </button>

          <button
            className="control-button"
            onClick={onCheck}
            disabled={
              !isGameStarted ||
              isGameOver ||
              !isPlayerTurn ||
              !availableMoves.includes("CHECK")
            }
          >
            CHECK
          </button>

          <button
            className="control-button fold-button"
            onClick={onFold}
            disabled={isButtonDisabled("FOLD")}
          >
            FOLD
          </button>

          {/* {!isPlayerTurn && isGameStarted && !isGameOver && (
            <div>Waiting for opponent...</div>
          )} */}
        </>
      ) : (
        <div className="raise-options">
          <div className="raise-amount">
            <span>Raise Amount</span>
            <div className="raise-value">{raiseAmount}</div>
          </div>
          <div className="raise-buttons">
            {raiseOptions.map((option) => (
              <button
                key={option.label}
                className="raise-option-button"
                onClick={() => {
                  if (option.label === "ALL IN") {
                    handleAllIn();
                  } else {
                    setRaiseAmount(option.value);
                    setCustomBet("");
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={raiseRange[0]}
            max={raiseRange[1]}
            value={raiseAmount}
            onChange={handleSliderChange}
            className="raise-slider"
          />
          <div className="custom-bet-input">
            <input
              type="number"
              value={customBet}
              onChange={handleCustomBetChange}
              placeholder="Custom bet"
              min={raiseRange[0]}
              max={raiseRange[1]}
            />
          </div>
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
