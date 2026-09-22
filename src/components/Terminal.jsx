import { useState, useRef, useEffect } from 'react';
import { TERMINAL_MANUAL } from '../tasks';

function Terminal({ task, onComplete, onFail }) {
  const [output, setOutput] = useState([
    "Terminal initialized.",
    "Type 'help' for manual.",
    `OBJECTIVE: ${task.prompt}`,
    "----------------------------------------"
  ]);
  const [input, setInput] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const endRef = useRef(null);

  const getFallbackOutput = (cmdString) => {
    const parts = cmdString.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const hasArgs = parts.length > 1;

    if (!hasArgs && ["fullscan", "networkscan", "portscan", "exploit", "intercept", "mitm", "tracepath", "inspect", "scale", "rollback", "restart", "readlogs", "patch", "dummyping"].includes(baseCmd)) {
      return "Error: Missing target argument. See 'help' for correct syntax.";
    }

    switch (baseCmd) {
      case "fullscan": return `Scanning ${parts[1]}... 65535 ports probed. No unusual daemons or listeners identified.`;
      case "networkscan": return `ARP sweep complete on ${parts[1]}. 1 active host responding: 10.0.0.66.`;
      case "portscan": return `Port audit complete for ${parts[1]}. Ports 80, 443 filtered. No high-risk vectors detected.`;
      case "exploit": return `Failed to inject payload into ${parts[1]}:${parts[2] || ''}. Connection refused or target service immune.`;
      case "intercept": return `Sniffing interface for ${parts[1]}... 0 plaintext tokens detected in sliding window.`;
      case "mitm": return `Sending spoofed ARP frames... Gateway rejected frame reassignment.`;
      case "tracepath": return `1: 10.0.0.1 (0.8ms) -> 2: 10.0.0.66 (1.2ms). Path MTU: 1500.`;
      case "syscheck": return `[KERNEL] UnderOS 4.19.0-bloo | ARCH: x86_64 | RUNLEVEL: 3 | ENV: PROFILE=prod`;
      case "inspect": return `[CONFIG] ${parts[1]}: Target unit not registered or daemon inactive.`;
      case "scale": return `[SCALING] ${parts[1]} replica configuration set to ${parts[2] || '0'}. Metric balance nominal.`;
      case "rollback": return `[ROLLBACK] ${parts[1]} restored to latest stable tag: release-v1.0.0.`;
      case "restart": return `[RESTART] Process cycled. Process ID reassigned cleanly.`;
      case "readlogs": return `[LOGS] ${parts[1]}: 0 errors recorded in last 300 cycles.`;
      case "patch": return `[PATCH] Hotfix package applied to ${parts[1]}. Zero diff detected.`;
      case "dummyping": return `PING ${parts[1]}: 56 data bytes. 64 bytes from ${parts[1]}: icmp_seq=1 ttl=64 time=0.041 ms.`;
      default: return "[ERROR] Command not found. Type 'help' for manual.";
    }
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newOutput = [...output, `> ${cmd}`];
    setInput('');

    if (cmd.toLowerCase() === 'help') {
      newOutput.push(TERMINAL_MANUAL);
      setOutput(newOutput);
      return;
    }

    if (cmd.toLowerCase() === 'clear') {
      setOutput([
        "Terminal initialized.",
        "Type 'help' for manual.",
        `OBJECTIVE: ${task.prompt}`,
        "----------------------------------------"
      ]);
      return;
    }

    const currentExpectedStep = task.steps[stepIndex];
    
    if (cmd.toLowerCase() === currentExpectedStep.cmd.toLowerCase()) {
      newOutput.push(currentExpectedStep.output);
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);
      
      if (nextStep >= task.steps.length) {
        newOutput.push("TASK SEQUENCE COMPLETE. Switching phase...");
        setOutput(newOutput);
        setTimeout(() => onComplete(), 2000);
      } else {
        setOutput(newOutput);
      }
    } else {
      newOutput.push(getFallbackOutput(cmd));
      setOutput(newOutput);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="screen-container crt">
      <div className="bg-overlay"></div>
      <div className="content-layer terminal-container">
        <div className="terminal-header">
          <span>NAPSTABLOOK_TERMINAL_V1</span>
          <span>ROOT@10.0.0.1</span>
        </div>
        <div className="terminal-output">
          {output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleCommand} className="terminal-input-line">
          <span>{'>'}</span>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default Terminal;
