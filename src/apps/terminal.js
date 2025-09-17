import { iconTerminal } from '../icons.js';

const banner = [
  'Security Terminal v1.4.2',
  'Type `help` to view available commands.',
];

const commands = {
  help() {
    return [
      'Available commands:',
      '  help      — show this list',
      '  about     — analyst profile summary',
      '  scan      — run an endpoint sweep simulation',
      '  risks     — review the current risk register',
      '  contact   — get in touch with Abhay',
      '  clear     — wipe the terminal output',
    ];
  },
  about() {
    return [
      'Abhay Bhingradia — SOC Analyst and cybersecurity specialist.',
      'Focus: threat hunting, blue team automation, and cloud security readiness.',
    ];
  },
  scan() {
    return [
      'Initializing network sweep…',
      ' • Collecting endpoint telemetry (1,284 agents online)',
      ' • Running behavioral analytics (MITRE ATT&CK T1047, T1059, T1105)',
      ' • Correlating signals with threat intel (Confidence: High)',
      'Scan complete — 0 critical, 2 medium anomalies escalated to EDR viewer.',
    ];
  },
  risks() {
    return [
      'Risk Register (top items):',
      '  1. Credential stuffing spikes — mitigated by adaptive MFA.',
      '  2. Shadow IT SaaS usage — quarterly discovery scans scheduled.',
      '  3. Phishing lure variants — automated takedown playbook active.',
    ];
  },
  contact() {
    return [
      'Reach out:',
      '  • Email   — abhaysbhingradia@gmail.com',
      '  • LinkedIn— https://www.linkedin.com/in/abhaybhingradia/',
      '  • GitHub  — https://github.com/AbhayB97',
    ];
  },
  clear({ output }) {
    output.innerHTML = '';
    return [];
  },
};

const formatInput = (value) => value.trim().toLowerCase();

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
    promptLabel.textContent = 'abhay@portfolio-os:~$';

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

      const cmd = commands[value];
      if (cmd) {
        const result = cmd({ output });
        if (Array.isArray(result)) print(result);
      } else {
        print(`Command not found: ${value}. Type \`help\`.`);
      }
    });

    root.append(output, form);
    setTimeout(() => input.focus(), 120);
    return root;
  },
};

export default TerminalApp;
