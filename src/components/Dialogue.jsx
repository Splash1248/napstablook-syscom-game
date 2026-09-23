import { useEffect, useState } from 'react';

function Dialogue({ taskType, sequence, onComplete }) {
  const [text, setText] = useState('...');
  const [seqIndex, setSeqIndex] = useState(0);

  useEffect(() => {
    if (sequence && sequence.length > 0) {
      setText(sequence[seqIndex]);
      return;
    }

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
  }, [taskType, sequence, seqIndex]);

  const handleNext = () => {
    if (sequence && sequence.length > 0) {
      if (seqIndex + 1 < sequence.length) {
        setSeqIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 4000);

    return () => clearTimeout(timer);
  }, [taskType, sequence, seqIndex]);

  return (
    <div className="screen-container" onClick={handleNext} style={{cursor: 'pointer'}}>
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
