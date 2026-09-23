import React from 'react';

function NarratorBox({ phase, currentTask }) {
  let text = "Two paths lie ahead: Fight, or resolve it peacefully...";

  if (phase === 'ACT_MENU') {
    text = "Napstablook seems closed off. Perhaps you should 'Check' to analyze his vulnerabilities...";
  } else if (currentTask) {
    if (currentTask.type === 'flirt') {
      text = "Napstablook looks intimidated and shrinks away. Flattery won't break through his emotional barrier.";
    } else if (currentTask.type === 'threat') {
      text = "Napstablook sinks further into the floor. Threats only deepen his existential dread.";
    } else if (currentTask.type === 'cheer') {
      text = "Napstablook cheers up a bit. He seems livelier now.";
    } else if (currentTask.type === 'check') {
      text = "Napstablook's emotional parameters are extremely low.";
    } else {
      text = "Napstablook looks at you blankly.";
    }
  }

  return (
    <div className="narrator-box">
      <p>{text}</p>
    </div>
  );
}

export default NarratorBox;
