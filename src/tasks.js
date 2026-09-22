export const FIGHT_TASKS = [
  {
    id: "fight_a",
    prompt: "Napstablook's ghost shell is active somewhere on the subnet 10.0.0.0/24. Discover the target host, audit its listening services, and inject a payload into the vulnerable daemon.",
    steps: [
      { cmd: "networkscan 10.0.0.0/24", output: "Active host found: 10.0.0.42 (napstablook-core.local)" },
      { cmd: "portscan 10.0.0.42", output: "Port 8080/tcp OPEN: Melancholy-Proxy (Vulnerable to RCE CVE-2024-BLLOK)" },
      { cmd: "exploit 10.0.0.42 8080", output: "[PWNED] Remote code execution achieved. Ghost defenses disrupted!" }
    ]
  },
  {
    id: "fight_b",
    prompt: "A stealth listener is running on 10.0.0.66. Perform a full probe to uncover unlisted backend ports, inspect the manifest of the exposed service, and exploit the exposed daemon.",
    steps: [
      { cmd: "fullscan 10.0.0.66", output: "Filtered ports bypassed. Port 31337/tcp: exposed service 'ghoul-rpc'" },
      { cmd: "inspect ghoul-rpc", output: "[MANIFEST] ghoul-rpc running unauthenticated. Insecure debug listener bound on port 31337." },
      { cmd: "exploit 10.0.0.66 31337", output: "[PWNED] ghoul-rpc compromised. Shell established!" }
    ]
  },
  {
    id: "fight_c",
    prompt: "Unencrypted authentication traffic has been spotted from host 10.0.0.88. Intercept the live connection to capture the cleartext token, then run an exploit on SSH port 22 using the discovered token.",
    steps: [
      { cmd: "intercept 10.0.0.88", output: "Packet captured [SRC: 10.0.0.88 DST: 10.0.0.1]. Payload: 'AUTH_KEY=ghost_root_9921'" },
      { cmd: "exploit 10.0.0.88 22", output: "[SUCCESS] Token 'ghost_root_9921' accepted. Root session granted!" }
    ]
  }
];

export const ACT_TASKS = [
  {
    id: "check_1",
    type: "check",
    prompt: "[DEVOPS: CHECK] Napstablook is unresponsive. Run 'syscheck' to read his system-wide runtime environment variables and check his emotional parameters.",
    steps: [
      { cmd: "syscheck", output: "[SYSINFO] Target: Napstablook | STATE: Severe Clinical Melancholy | TRAITS: Introverted, Anxious, Highly Sensitive to Confrontation | THREAD_LOCK: \"Will never accept threats or aggressive flirtation. Only positive affirmation (CHEER) can resolve deadlocks.\"" }
    ]
  },
  {
    id: "flirt_1",
    type: "flirt",
    prompt: "[DEVOPS: FLIRT] Napstablook needs attention. Scale the 'compliments' worker pool to 5 replicas to send flirtatious connections.",
    steps: [
      { cmd: "scale compliments 5", output: "[WARNING] Daemon rejected connection: 'oh... i'd just weigh you down...' (0/3 Cheer milestones met)" }
    ]
  },
  {
    id: "threat_1",
    type: "threat",
    prompt: "[DEVOPS: THREAT] Napstablook is spiraling. Roll back the 'panic-engine' service to scare him into resetting his state.",
    steps: [
      { cmd: "rollback panic-engine", output: "[WARNING] Daemon rejected connection: 'go ahead, do it...' (0/3 Cheer milestones met)" }
    ]
  },
  {
    id: "cheer_1",
    type: "cheer",
    prompt: "[DEVOPS: CHEER - STEP 1] Napstablook is lost in negative feedback loops. Tail the output logs from 'dapper-blook' using 'readlogs' to retrieve his positive accomplishments.",
    steps: [
      { cmd: "readlogs dapper-blook", output: "[LOGS] Hat constructed: SUCCESS | Melancholy down 10% | Progress: [1/3 CHEER RECORDED]" }
    ]
  },
  {
    id: "cheer_2",
    type: "cheer",
    prompt: "[DEVOPS: CHEER - STEP 2] One positive daemon isn't sustaining his mood. Scale up the worker pool for 'smile-daemon' to 3 replicas.",
    steps: [
      { cmd: "scale smile-daemon 3", output: "[SCALED] smile-daemon instances updated to 3. Napstablook blushes slightly. Progress: [2/3 CHEER RECORDED]" }
    ]
  },
  {
    id: "cheer_3",
    type: "cheer",
    prompt: "[DEVOPS: CHEER - STEP 3] Confirm that system environment variables indicate an uplifted runtime emotional state by running 'syscheck'.",
    steps: [
      { cmd: "syscheck", output: "[SYSINFO] ENV: MOOD=Encouraged, STYLE=DapperHatDeployed | Victory condition achieved! [3/3 CHEER RECORDED]" }
    ]
  }
];

export const TERMINAL_MANUAL = `SYSTEM COMMAND MANUAL:\n
--------------------------------------------------------------------------------------\n
fullscan <ip>          - Aggressive host audit: probes all open ports & detects services\n
networkscan <subnet>   - Discovers live host IP addresses active on the local subnet\n
portscan <ip>          - Quick audit targeting common service ports (80, 443, 22, 8080)\n
exploit <ip> <port>    - Executes known payload against vulnerable service on host\n
intercept <ip>         - Sniffs cleartext authentication tokens across the interface\n
mitm <gateway> <ip>    - Injects spoofed ARP frames to poison routing between targets\n
tracepath <ip>         - Maps hop-by-hop latency and router intermediaries to host\n
syscheck               - Prints runtime architecture, OS kernel, and active env vars\n
inspect <service>      - Reads configuration manifests and health status for service\n
scale <service> <n>    - Adjusts replica worker counts to balance application load\n
rollback <service>     - Reverts target container or service to last stable release\n
restart <service>      - Drops and recreates runtime process instances\n
readlogs <service>     - Streams tail output from stdout/stderr for specified service\n
patch <service>        - Compiles and injects emergency code update to target\n
dummyping <ip>         - Sends ICMP echo requests to verify gateway link availability\n
clear                  - Flushes buffer and resets terminal screen view\n
--------------------------------------------------------------------------------------`;
