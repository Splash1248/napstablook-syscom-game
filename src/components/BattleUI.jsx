import { useState } from 'react';
import { ACT_TASKS, FIGHT_TASKS } from '../tasks';

function BattleUI({ hp, maxHp, onTaskSelect, setGameState }) {
  const [menuState, setMenuState] = useState('MAIN'); // MAIN, ACT_MENU

  const handleFight = () => {
    onTaskSelect('fight', FIGHT_TASKS);
    setGameState('TERMINAL');
  };

  const handleActSelect = (type) => {
    const tasks = ACT_TASKS.filter(t => t.type === type);
    onTaskSelect(type, tasks);
    setGameState('TERMINAL');
  };

  return (
    <div className="screen-container">
      <div className="bg-overlay"></div>
      <div className="content-layer battle-ui">
        
        <div className="enemy-sprite-container">
          <img src="/assets/Sprites/napstablook.png" alt="Napstablook" className="enemy-sprite" />
        </div>

        {menuState === 'MAIN' ? (
          <>
            <div className="hud">
              <div>NAPSTABLOOK</div>
              <div className="hp-bar-container">
                <span>HP</span>
                <div className="hp-bar-bg">
                  <div className="hp-bar-fill" style={{ width: `${(hp / maxHp) * 100}%` }}></div>
                </div>
                <span>{hp} / {maxHp}</span>
              </div>
            </div>

            <div className="action-menu">
              <button onClick={handleFight}>[ FIGHT ]</button>
              <button onClick={() => setMenuState('ACT_MENU')}>[ ACT ]</button>
            </div>
          </>
        ) : (
          <div className="sub-menu">
            <h2>ACT</h2>
            <button onClick={() => handleActSelect('check')}>* Check</button>
            <button onClick={() => handleActSelect('flirt')}>* Flirt</button>
            <button onClick={() => handleActSelect('threat')}>* Threat</button>
            <button onClick={() => handleActSelect('cheer')}>* Cheer</button>
            <button onClick={() => setMenuState('MAIN')} style={{marginTop: '20px'}}>* Back</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default BattleUI;
