import React, { useState } from "react";

const UsernameModal = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    }
  };

  return (
    <div className="username-modal">
      <div className="username-modal-content">
        <h3>Enter username</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
          />
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
