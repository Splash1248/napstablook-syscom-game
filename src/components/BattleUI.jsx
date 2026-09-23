import { useState } from 'react';
import { ACT_TASKS, FIGHT_TASKS } from '../tasks';
import NarratorBox from './NarratorBox';

function BattleUI({ playerName, hp, maxHp, bossHp, lastCompletedTask, onTaskSelect, setGameState }) {
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
    <>
      <div className="screen-container">
        <div className="bg-overlay"></div>
      <div className="content-layer battle-ui">
        
        <div className="enemy-sprite-container" style={{flexDirection: 'column'}}>
          <img src="/assets/Sprites/napstablook.png" alt="Napstablook" className="enemy-sprite" style={{opacity: bossHp > 0 ? 1 : 0, transition: 'opacity 2s'}} />
          {bossHp > 0 && (
            <div className="boss-hp-container">
              <span>NAPSTABLOOK HP</span>
              <div className="boss-hp-bar">
                <div className="boss-hp-fill" style={{ width: `${bossHp}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {menuState === 'MAIN' ? (
          <>
            <div className="hud">
              <div>{playerName || 'PLAYER'}</div>
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
          <div className="sub-menu" style={{ overflowY: 'auto' }}>
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
      <NarratorBox phase={menuState} currentTask={lastCompletedTask} />
    </>
  );
}

export default BattleUI;
