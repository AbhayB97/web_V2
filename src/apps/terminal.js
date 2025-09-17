import { iconTerminal } from '../icons.js';

// --- Banner Art and Config ---
const banner = [
  'Welcome to Abhay\'s Web Terminal!',
  'Type `help` to see all available commands.',
  '',
  '               AAA               BBBBBBBBBBBBBBBBB              SSSSSSSSSSSSSSS EEEEEEEEEEEEEEEEEEEEEE       CCCCCCCCCCCCC',
  // (Shortened for brevity—add full ASCII art/banner here if desired)
  ''
];

const config = {
  name: 'Abhay Bhingradia',
  ps1_username: 'abhay',
  repo: 'https://github.com/AbhayB97/ab_website',
  resume: 'https://abhay.bhingradia.com/resume.pdf',
  linkedin: 'https://www.linkedin.com/in/abhay-bhingradia/',
  github: 'https://github.com/AbhayB97',
  email: 'bhingradia.abhay@gmail.com',
  paper: 'https://github.com/AbhayB97/The-Missing-Link',
};

// --- Command Registry ---
const commands = {
  help() {
    const keys = Object.keys(commands).sort();
    let lines = ['Available commands:'];
    let row = '';
    keys.forEach((k, i) => {
      row += k.padEnd(12, ' ');
      if ((i + 1) % 6 === 0 || i === keys.length - 1) {
        lines.push(row);
        row = '';
      }
    });
    lines.push('');
    lines.push("Try help, about, sumfetch, repo, resume, email, github, linkedin, paper, skills, experience, certs, projects, contact, education, banner, whoami, ls, cd, date, echo, pwd, sudo, uptime, nmap, vi, vim, nvim, emacs, google, duckduckgo, bing, reddit, clear.");
    return lines;
  },
  sumfetch() {
    return [
      'Abhay Bhingradia — Cybersecurity Analyst',
      'Sheridan College, Mississauga, Canada',
      'Specializing in SOC, threat hunting, network and cloud security',
      '',
      'Type "about", "skills", "experience", or "certs" for more.',
    ];
  },
  repo() {
    return [`GitHub Repository: ${config.repo}`];
  },
  about() {
    return [
      'Cybersecurity Analyst based in Mississauga, Canada.',
      'SOC monitoring, threat intelligence, incident response.',
      'Building automation and analytics for blue teams.',
    ];
  },
  resume() {
    window.open(config.resume, '_blank');
    return ['Opening resume...'];
  },
  email() {
    window.open(`mailto:${config.email}`, '_blank');
    return [`Opening mail client for: ${config.email}`];
  },
  github() {
    window.open(config.github, '_blank');
    return [`Opening GitHub profile: ${config.github}`];
  },
  linkedin() {
    window.open(config.linkedin, '_blank');
    return [`Opening LinkedIn: ${config.linkedin}`];
  },
  paper() {
    window.open(config.paper, '_blank');
    return ['Opening research paper...'];
  },
  skills() {
    return [
      '🖥️ Programming Languages:',
      '  Java, Python, C, C++, Bash, Powershell, PHP, JavaScript, TypeScript, HTML, CSS, PLSQL, SQLite, x86 assembly',
      '',
      '🔐 Security Tools:',
      '  Wreshark, Nmap, aircrack-ng, tcpdump, IDA Pro, DIE, Process Hacker, Yara, Joe Sandbox, VirusTotal, AnyRun, Volatility, Autopsy',
      '  Microsoft Defender, CrowdStrike, Symantec Endpoint Protection, MISP, ThreatConnect, Shodan, OSINT Framework, Metasploit, Burp Suite, Nikto, SQLmap, Hydra, John the Ripper, hashcat',
      '',
      '☁️ Cloud: AWS, Azure, GCP, Docker, Kubernetes, Terraform, CloudFormation, VMware vSphere, Hyper-V',
      '',
      '🛡️ Security Frameworks: NIST, MITRE ATT&CK, OWASP Top 10, CIS Controls',
      '🗄️ OS: Windows, Linux, macOS, Windows Server',
      '',
      'Soft Skills: Leadership, Communication, Problem-Solving, Team Collaboration, Technical Writing, Public Speaking'
    ];
  },
  experience() {
    return [
      'Cyber Security Analyst (QSI Security Inc) | Mississauga, Canada | Nov 2024 - May 2025',
      '  - Developed and deployed playbooks, incident response.',
      '  - SOC monitoring, training, log analysis, firewall config.',
      '',
      'IT Co-op (Martinrea Industrial Canada) | Vaughan, Canada | Sep 2023 - Dec 2023',
      '  - Managed 150+ IT assets, automated firmware patching.',
      '',
      'Researcher and Author (The Missing Link) | Nov 2024 - Mar 2025',
      '  - Authored paper on cybersecurity regulations.',
      '',
      'Freelance Cybersecurity Consultant | Ongoing',
      '  - Security assessments, hardening, client education.',
    ];
  },
  certs() {
    return [
      '📜 Current Certifications:',
      '  - Google\'s Foundation of CyberSecurity',
      '  - Product Management Professional Certificate',
      '  - CompTIA Tech+',
      '',
      '📚 In Progress:',
      '  - CompTIA Security+',
      '  - CompTIA A+',
      '  - Microsoft SC-200',
      '',
      '🚀 Goals: CEH, CISSP, AWS Solutions Architect, OSCP',
    ];
  },
  projects() {
    return [
      '🚗 Preventing CAN Injection Attack in Automobiles | Capstone 2024',
      '  - IoT prototype to mitigate CAN injection attacks.',
      '',
      '📄 The Missing Link | Research Paper (Nov 2024 - Mar 2025)',
      '  - Cybersecurity regulation analysis.',
      '',
      '🔒 Custom Security Dashboards | QSI Security Inc (2024-2025)',
      '  - Real-time threat monitoring dashboards.',
      '',
      '🛠️ Network Automation Scripts | Martinrea Industrial Canada (2023)',
      '  - Automated firmware patching, Python asset management.',
      '',
      '🔐 Embedded Systems Development | Grow SoftTech (2020 - Present)',
      '  - Microcontroller design, HMI migration to Raspberry Pi.',
      '',
      '🌐 Personal Website and Terminal | abhay.bhingradia.com',
      '  - Custom terminal-style portfolio with interactive commands.',
    ];
  },
  contact() {
    return [
      `📧 Email: ${config.email}`,
      `🔗 LinkedIn: ${config.linkedin}`,
      `💻 GitHub: ${config.github}`,
      '📱 Phone: +1 416 628 0059'
    ];
  },
  education() {
    return [
      '🎓 Bachelor of Information Systems Security (CyberSecurity)',
      'Sheridan College | Oakville, Canada | Jan 2021 - Aug 2024',
      '',
      '- Digital forensics, cryptography, compliance, CTFs.',
      '- Student Union Director, ISSessions Club, CTF participant.',
    ];
  },
  banner() {
    return banner;
  },

  // --- Basic Terminal Commands ---
  whoami() {
    return [config.ps1_username];
  },
  ls() {
    return [
      'a',
      'bunch',
      'of',
      'fake',
      'directories'
    ];
  },
  cd() {
    return ['Not a real shell. Directory not changed.'];
  },
  date() {
    return [new Date().toString()];
  },
  echo(args = '') {
    return [args];
  },
  pwd() {
    return ['/home/abhay'];
  },
  sudo() {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    return ['Permission denied: with little power comes... no responsibility?'];
  },
  uptime() {
    const boot = new Date(Date.now() - 1000 * 60 * 60 * 6);
    return [
      `Current uptime: ${new Date().toLocaleString()}`,
      `System booted at: ${boot.toLocaleString()}`
    ];
  },
  nmap() {
    return [
      'Nmap scan report for abhay.bhingradia.com',
      'PORT     STATE SERVICE',
      '22/tcp   open  ssh',
      '80/tcp   open  http',
      '443/tcp  open  https',
      '3000/tcp open  terminal'
    ];
  },
  vi() {
    return ["woah, you still use 'vi'? just try 'vim'."];
  },
  vim() {
    return ["'vim' is so outdated. how about 'nvim'?"];
  },
  nvim() {
    return ["'nvim'? too fancy. why not 'emacs'?"];
  },
  emacs() {
    return ["you know what? just use vscode."];
  },
  clear({ output }) {
    output.innerHTML = '';
    return [];
  },

  // --- Fun/Playful Search Commands ---
  google(args = '') {
    if (args) window.open(`https://www.google.com/search?q=${encodeURIComponent(args)}`, '_blank');
    return args ? ['Searching Google...'] : ['Usage: google [query]'];
  },
  duckduckgo(args = '') {
    if (args) window.open(`https://duckduckgo.com/?q=${encodeURIComponent(args)}`, '_blank');
    return args ? ['Searching DuckDuckGo...'] : ['Usage: duckduckgo [query]'];
  },
  bing(args = '') {
    if (args) window.open(`https://www.bing.com/search?q=${encodeURIComponent(args)}`, '_blank');
    return args ? ['Why Bing? ... Searching anyway.'] : ['Usage: bing [query]'];
  },
  reddit(args = '') {
    if (args) window.open(`https://www.reddit.com/search/?q=${encodeURIComponent(args)}`, '_blank');
    return args ? ['Reddit search opened.'] : ['Usage: reddit [query]'];
  },
};

// --- Terminal App Component ---
const formatInput = (value) => value.trim();
const createLine = (text, cls = '') => {
  const line = document.createElement('div');
  line.className = `terminal-line ${cls}`.trim();
  line.textContent = text;
  return line;
};

const TerminalApp = {
  id: 'terminal',
  title: 'Security Terminal',
  icon: iconTerminal,
  render() {
    const root = document.createElement('div');
    root.className = 'terminal-app';

    const output = document.createElement('div');
    output.className = 'terminal-output';

    const form = document.createElement('form');
    form.className = 'terminal-form';

    const promptLabel = document.createElement('span');
    promptLabel.className = 'terminal-prompt';
    promptLabel.textContent = `${config.ps1_username}@portfolio-os:~$`;

    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Type a command';

    form.append(promptLabel, input);

    const print = (lines, cls = '') => {
      if (!Array.isArray(lines)) lines = [lines];
      lines.filter(Boolean).forEach((text) => output.append(createLine(text, cls)));
      output.scrollTop = output.scrollHeight;
    };

    banner.forEach((line) => output.append(createLine(line, 'system')));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = formatInput(input.value);
      if (!value) return;
      output.append(createLine(`$ ${value}`, 'input'));
      input.value = '';

      // Parse command and args
      const [cmd, ...rawArgs] = value.split(' ');
      const args = rawArgs.join(' ');

      // Check if command exists
      if (commands[cmd]) {
        const res = commands[cmd](args ? args : { output });
        if (Array.isArray(res)) print(res);
      } else {
        print(`Command not found: ${cmd}. Type \`help\`.`);
      }
    });

    root.append(output, form);
    setTimeout(() => input.focus(), 120);
    return root;
  },
};

export default TerminalApp;
