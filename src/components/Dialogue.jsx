import { useEffect, useState } from 'react';

function Dialogue({ taskType, onComplete }) {
  const [text, setText] = useState('...');

  useEffect(() => {
    fetch('/dialogue.json')
      .then(r => r.json())
      .then(data => {
        let lines;
        if (taskType === 'fight') {
          lines = data.neutral;
        } else {
          lines = data[taskType];
          if (typeof lines === 'object' && !Array.isArray(lines)) {
            lines = [lines.default];
          }
        }
        
        if (Array.isArray(lines)) {
          setText(lines[Math.floor(Math.random() * lines.length)]);
        } else {
          setText(lines);
        }
      })
      .catch(e => console.error(e));

    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [taskType]); // Removed onComplete to prevent infinite re-renders

  return (
    <div className="screen-container" onClick={onComplete} style={{cursor: 'pointer'}}>
      <div className="bg-overlay"></div>
      <div className="content-layer dialogue-phase">
        <div className="enemy-sprite-container" style={{ flexGrow: 0, marginTop: '50px' }}>
          <img src="/assets/Sprites/napstablook.png" alt="Napstablook" className="enemy-sprite" />
        </div>
        <div className="dialogue-bubble">
          {text}
          <div style={{fontSize: '0.8rem', color: '#666', marginTop: '10px'}}>(Click anywhere to continue)</div>
        </div>
      </div>
    </div>
  );
}

export default Dialogue;
