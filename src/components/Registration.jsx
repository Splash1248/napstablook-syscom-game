import { useState } from 'react';

function Registration({ onRegister }) {
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onRegister(playerName.trim(), teamName.trim());
    }
  };

  return (
    <div className="registration-screen">
      <div className="screen-container">
        <div className="bg-overlay"></div>
        <div className="content-layer" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h1>Napstablook Encounters</h1>
          <form onSubmit={handleSubmit} className="form-group" style={{ marginTop: '40px' }}>
            <label>Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={16}
              required
            />

            <label style={{ marginTop: '20px' }}>Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              maxLength={16}
              required
            />

            <button type="submit" disabled={!playerName.trim() || !teamName.trim()} style={{ marginTop: '40px', width: '100%' }}>
              START
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;
