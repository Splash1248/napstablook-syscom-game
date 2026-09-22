import { useState, useEffect } from 'react'
import Registration from './components/Registration'
import BattleUI from './components/BattleUI'
import Terminal from './components/Terminal'
import Dialogue from './components/Dialogue'
import CanvasDodger from './components/CanvasDodger'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('REGISTRATION') // REGISTRATION, PLAYER_TURN, TERMINAL, DIALOGUE_PHASE, ENEMY_TURN, GAME_OVER, VICTORY
  const [playerName, setPlayerName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [hp, setHp] = useState(20)
  const maxHp = 20

  const [fightSuccesses, setFightSuccesses] = useState(0)
  const [actSuccesses, setActSuccesses] = useState(0)
  const [currentTask, setCurrentTask] = useState(null)
  const [taskIndices, setTaskIndices] = useState({ fight: -1, check: -1, flirt: -1, threat: -1, cheer: -1 })
  const [isEndingDialogue, setIsEndingDialogue] = useState(false)

  const [globalTimeRemaining, setGlobalTimeRemaining] = useState(600)
  const [terminalTimeRemaining, setTerminalTimeRemaining] = useState(150)
  const [terminalTimedOut, setTerminalTimedOut] = useState(false)

  // Global Timer Hook
  useEffect(() => {
    let timer;
    if (gameState !== 'REGISTRATION' && gameState !== 'GAME_OVER' && gameState !== 'VICTORY') {
      timer = setInterval(() => {
        setGlobalTimeRemaining((prev) => {
          if (prev <= 1) {
            setGameState('GAME_OVER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Terminal Timer Hook
  useEffect(() => {
    let timer;
    if (gameState === 'TERMINAL') {
      setTerminalTimeRemaining(150);
      setTerminalTimedOut(false);
      timer = setInterval(() => {
        setTerminalTimeRemaining((prev) => {
          if (prev <= 1) {
            setTerminalTimedOut(true);
            setGameState('DIALOGUE_PHASE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleRegister = (name, team) => {
    setPlayerName(name);
    setTeamName(team);
    setGameState('PLAYER_TURN');

    const audio = new Audio('/assets/Audio/ghost_fight.mp3');
    audio.loop = true;
    audio.play().catch(e => console.error("Audio play failed:", e));
  }

  const handleTaskComplete = () => {
    let actWon = actSuccesses;
    let fightWon = fightSuccesses;
    
    if (currentTask.type) {
      if (currentTask.type === 'cheer') {
        setActSuccesses(prev => prev + 1);
        actWon += 1;
      }
    } else {
      setFightSuccesses(prev => prev + 1);
      fightWon += 1;
    }
    
    if (fightWon >= 2 || actWon >= 3) {
      setIsEndingDialogue(true);
    }
    
    setGameState('DIALOGUE_PHASE');
  }

  const handleHit = () => {
    setHp(prev => {
      const newHp = prev - 4;
      if (newHp <= 0) {
        setGameState('GAME_OVER');
        return 0;
      }
      return newHp;
    });
  }

  const handleEnemyTurnComplete = () => {
    if (fightSuccesses >= 2 || actSuccesses >= 3) {
      setGameState('VICTORY');
    } else {
      setGameState('PLAYER_TURN');
    }
  }

  const handleTaskSelect = (taskType, taskList) => {
    let nextIdx;
    if (taskIndices[taskType] === -1) {
      nextIdx = Math.floor(Math.random() * taskList.length);
    } else {
      nextIdx = (taskIndices[taskType] + 1) % taskList.length;
    }
    setTaskIndices(prev => ({ ...prev, [taskType]: nextIdx }));
    setCurrentTask(taskList[nextIdx]);
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return (
    <div className="App">
      {gameState === 'REGISTRATION' && <Registration onRegister={handleRegister} />}

      {gameState === 'PLAYER_TURN' && (
        <BattleUI
          hp={hp}
          maxHp={maxHp}
          onTaskSelect={handleTaskSelect}
          setGameState={setGameState}
        />
      )}

      {gameState === 'TERMINAL' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 100 }}>
            Terminal Time: {formatTime(terminalTimeRemaining)} | Global: {formatTime(globalTimeRemaining)}
          </div>
          <Terminal
            task={currentTask}
            onComplete={handleTaskComplete}
          />
        </div>
      )}

      {gameState === 'DIALOGUE_PHASE' && (
        <Dialogue
          taskType={isEndingDialogue ? 'defeat' : (currentTask?.type || 'fight')}
          onComplete={() => setGameState(isEndingDialogue ? 'VICTORY' : 'ENEMY_TURN')}
        />
      )}

      {gameState === 'ENEMY_TURN' && (
        <CanvasDodger
          hp={hp}
          maxHp={maxHp}
          onHit={handleHit}
          onComplete={handleEnemyTurnComplete}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <div className="screen-container game-over-screen">
          <div className="bg-overlay"></div>
          <div className="content-layer" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '3rem', color: 'red', marginBottom: '20px' }}>GAME OVER</h1>
            {hp <= 0 ? (
              <p>Stay determined, {playerName}...</p>
            ) : (
              <p>{playerName} ran out of time... Napstablook faded away into the darkness.</p>
            )}
            <button onClick={() => window.location.reload()} style={{ marginTop: '40px' }}>RETRY</button>
          </div>
        </div>
      )}

      {gameState === 'VICTORY' && (
        <div className="screen-container victory-screen">
          <div className="bg-overlay"></div>
          <div className="content-layer" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'yellow', marginBottom: '20px' }}>YOU WON!</h1>
            <p>Congratulations, {playerName}! {teamName ? `(Team: ${teamName})` : ''}</p>
            <div style={{ margin: '30px 0', textAlign: 'left', lineHeight: '2' }}>
              <p>Time Taken: {formatTime(600 - globalTimeRemaining)}</p>
              <p>Final Score: {globalTimeRemaining}</p>
              <p>Route: {fightSuccesses >= 2 ? 'Genocide' : 'Pacifist'}</p>
            </div>
            {fightSuccesses >= 2 && (
              <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '20px' }}>
                "umm... you do know you cant kill ghosts, right?" - Napstablook
              </p>
            )}
            <button onClick={() => window.location.reload()}>PLAY AGAIN</button>
          </div>
        </div>
      )}

      {/* Global Timer Display outside terminal */}
      {gameState !== 'REGISTRATION' && gameState !== 'TERMINAL' && gameState !== 'GAME_OVER' && gameState !== 'VICTORY' && (
        <div style={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 100 }}>
          Global: {formatTime(globalTimeRemaining)}
        </div>
      )}

    </div>
  )
}

export default App
