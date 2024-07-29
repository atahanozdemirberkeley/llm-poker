import React, { useState } from "react";

const Controls = ({
  onNextHand,
  onCall,
  onRaise,
  onCheck,
  onFold,
  onPeek,
  hasPeeked,
  currentBet,
  pot,
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
    { label: "1/2 POT", value: pot / 2 },
    { label: "3/4 POT", value: pot * 0.75 },
    { label: "POT", value: pot },
    { label: "ALL IN", value: 1000 }, // Assuming 1000 is the max stack size
  ];

  return (
    <div className="controls">
      {!showRaiseOptions ? (
        <>
          <button className="control-button next-hand" onClick={onNextHand}>
            NEXT HAND
          </button>
          <button className="control-button" onClick={() => onCall(currentBet)}>
            CALL {currentBet}
          </button>
          <button className="control-button" onClick={handleRaiseClick}>
            RAISE
          </button>
          <button className="control-button" onClick={onCheck}>
            CHECK
          </button>
          <button className="control-button fold-button" onClick={onFold}>
            FOLD
          </button>
          <button
            className={`control-button ${hasPeeked ? "peeked" : "notpeeked"}`}
            onClick={onPeek}
            disabled={hasPeeked}
          >
            PEEK
          </button>
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
            min={currentBet * 2}
            max={1000}
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
