import { iconTerminal } from '../icons.js';

const config = {
  name: 'Abhay Bhingradia',
  repo: 'https://github.com/AbhayB97',
  resume: '/resume.pdf',
  email: 'bhingradia.abhay@gmail.com',
  social: {
    github: 'AbhayB97',
    linkedin: 'abhay-bhingradia',
  },
  ps1_hostname: 'AB.SEC',
  ps1_username: 'guest',
};

const helpText = `Welcome! Here are all the available commands:
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.

help - Lists all available commands.

sumfetch - Displays a short summary of the website.


repo - Opens the GitHub repository.
about - Displays a short bio.
resume - Opens the resume file.
email - Opens the mail client.
github - Opens the GitHub profile.
linkedin - Opens the LinkedIn profile.
paper - Opens the research paper.
skills - Lists various technical skills.
experience - Shows work experience details.
certs - Lists certifications.
projects - Lists personal projects.
contact - Displays contact information.
education - Shows education details.
banner - Prints the ASCII banner.


Basic Terminal Commands
whoami - Displays the current user.
ls - Lists directories (fake output).
cd - Changes directory (not actually functional).
date - Shows the current date.
echo - Prints the provided text.
pwd - Prints the current directory (default not included here).
sudo - Easter egg (opens a Rickroll video).
uptime - Shows the uptime of the terminal.
nmap - Shows a simulated nmap scan.
vi - Prints a playful message about using vim.
vim - Suggests using nvim instead.
nvim - Suggests using emacs instead.
emacs - Suggests using VS Code instead.

Search Commands
google - Searches Google.
duckduckgo - Searches DuckDuckGo.
bing - Searches Bing (with a playful message).
reddit - Searches Reddit.
`;

const sumfetchLines = [
  '',
 `
           ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄                  sumfetch
        ▄▓▓▀ ▄▓▓▀▓▓▓▀▓▓▄ ▀▀▓▓▄              -----------
      ▓▓▀  ▄▓▀   ▐▓▓  ▀▓▓    ▓▓▄             ABOUT
    ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            ${config.name}
   ▓▓     ▓▓▓    ▐▓▓    ▐▓▓     ▓▓           <u><a href="${config.resume_url}" target="_blank">resume</a></u>
▐▓▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▓       爵 <u><a href="${config.repo}" target="_blank">Github repo</a></u>
▐▓                                 ▐▓       -----------
▐▓        >                        ▐▓        CONTACT 
▐▓                                 ▐▓        <u><a href="mailto:${config.email}" target="_blank">${config.email}</a></u>
▐▓▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▓        <u><a href="https://github.com/${config.social.github}" target="_blank">github.com/${config.social.github}</a></u>
   ▓▓      ▐▓▓    ▓▓    ▐▓▓     ▓▓           <u><a href="https://linkedin.com/in/${config.social.linkedin}" target="_blank">linkedin.com/in/${config.social.linkedin}</a></u>
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           -----------
      ▓▓▓   ▐▓▓   ▓▓   ▓▓▓   ▓▓▀             
        ▀▓▓▄▄ ▀▓▓▄▓▓▄▓▓▓▄▄▓▓▀               
            ▀▓▓▓▓▓▓▓▓▓▓▓▀▀  
`];

const bannerAscii = String.raw`

                                                                                                                          
                                                                                                                          
               AAA               BBBBBBBBBBBBBBBBB              SSSSSSSSSSSSSSS EEEEEEEEEEEEEEEEEEEEEE       CCCCCCCCCCCCC
              A:::A              B::::::::::::::::B           SS:::::::::::::::SE::::::::::::::::::::E    CCC::::::::::::C
             A:::::A             B::::::BBBBBB:::::B         S:::::SSSSSS::::::SE::::::::::::::::::::E  CC:::::::::::::::C
            A:::::::A            BB:::::B     B:::::B        S:::::S     SSSSSSSEE::::::EEEEEEEEE::::E C:::::CCCCCCCC::::C
           A:::::::::A             B::::B     B:::::B        S:::::S              E:::::E       EEEEEEC:::::C       CCCCCC
          A:::::A:::::A            B::::B     B:::::B        S:::::S              E:::::E            C:::::C              
         A:::::A A:::::A           B::::BBBBBB:::::B          S::::SSSS           E::::::EEEEEEEEEE  C:::::C              
        A:::::A   A:::::A          B:::::::::::::BB            SS::::::SSSSS      E:::::::::::::::E  C:::::C              
       A:::::A     A:::::A         B::::BBBBBB:::::B             SSS::::::::SS    E:::::::::::::::E  C:::::C              
      A:::::AAAAAAAAA:::::A        B::::B     B:::::B               SSSSSS::::S   E::::::EEEEEEEEEE  C:::::C              
     A:::::::::::::::::::::A       B::::B     B:::::B                    S:::::S  E:::::E            C:::::C              
    A:::::AAAAAAAAAAAAA:::::A      B::::B     B:::::B                    S:::::S  E:::::E       EEEEEEC:::::C       CCCCCC
   A:::::A             A:::::A   BB:::::BBBBBB::::::B        SSSSSSS     S:::::SEE::::::EEEEEEEE:::::E C:::::CCCCCCCC::::C
  A:::::A               A:::::A  B:::::::::::::::::B  ...... S::::::SSSSSS:::::SE::::::::::::::::::::E  CC:::::::::::::::C
 A:::::A                 A:::::A B::::::::::::::::B   .::::. S:::::::::::::::SS E::::::::::::::::::::E    CCC::::::::::::C
AAAAAAA                   AAAAAAABBBBBBBBBBBBBBBBB    ......  SSSSSSSSSSSSSSS   EEEEEEEEEEEEEEEEEEEEEE       CCCCCCCCCCCCC
                                                                                                                          
`;

const toHtmlAsciiLines = (lines) =>
  lines.map((line) => ({
    html: line ? line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;') : '&nbsp;',
    cls: 'system',
  }));

const sumfetchOutput = () =>
  sumfetchLines.map((line) => ({ html: line ? line.replace(/\u00a0/g, '&nbsp;') : '&nbsp;' }));

const commands = {
  help: async () => helpText,
  sumfetch: async () => sumfetchOutput(),
  repo: async () => {
    window.open(`${config.repo}`);
    return 'Opening Github repository...';
  },
  about: async () => `Hi, I am ${config.name}.
Welcome to my website!

More about me:
  - Graduated from Sheridan College in 2024 with a Bachelors in Cyber Security.
    Elected as a Student Director for the Sheridan Student Union.

  - Worked as a Peer Mentor helping students with studies and campus issues.

  - Currently working as a SOC Analyst at a CyberSecurity company in Mississauga.

  - This is a personal project to learn more about web development.
    I’m a big fan of open source and contribute to as many projects as I can.

  - 📝 Read my most recent paper:
    "Missing Link: Why government should consolidate cybersecurity and privacy regulations"

Use the command 'help' to see the list of available commands, or 'sumfetch' for a quick summary.`,
  resume: async () => {
    window.open(`${config.resume}`);
    return 'Opening resume...';
  },
  email: async () => {
    window.open(`mailto:${config.email}`);
    return `Opening mailto:${config.email}...`;
  },
  github: async () => {
    window.open(`https://github.com/${config.social.github}/`);
    return 'Opening github...';
  },
  linkedin: async () => {
    const deepLink = `linkedin://in/${config.social.linkedin}`;
    const webLink = `https://www.linkedin.com/in/${config.social.linkedin}`;
    setTimeout(() => {
      window.location.href = webLink;
    }, 1000);
    window.location.href = deepLink;
    return 'Opening LinkedIn profile...';
  },
  paper: async () => {
    window.open('https://github.com/AbhayB97/The-Missing-Link');
    return 'Opening the Research paper...';
  },
  google: async (args) => {
    const query = args.join(' ');
    window.open(`https://google.com/search?q=${query}`);
    return `Searching google for ${query}...`;
  },
  duckduckgo: async (args) => {
    const query = args.join(' ');
    window.open(`https://duckduckgo.com/?q=${query}`);
    return `Searching duckduckgo for ${query}...`;
  },
  bing: async (args) => {
    const query = args.join(' ');
    window.open(`https://bing.com/search?q=${query}`);
    return `Wow, really? You are using bing for ${query}?`;
  },
  reddit: async (args) => {
    const query = args.join(' ');
    window.open(`https://www.reddit.com/search/?q=${query}`);
    return `Searching reddit for ${query}...`;
  },
  uptime: async () => {
    const boot = new Date(Date.now() - 1000 * 60 * 60 * 6);
    return `Current uptime: ${new Date().toLocaleString()}  
System booted at: ${boot.toLocaleString()}`;
  },
  nmap: async () => `Nmap scan report for abhay.bhingradia.com  
PORT     STATE SERVICE  
22/tcp   open  ssh  
80/tcp   open  http  
443/tcp  open  https  
3000/tcp open  terminal`,
  echo: async (args) => args.join(' '),
  whoami: async () => `${config.ps1_username}`,
  ls: async () => `a
bunch
of
fake
directories`,
  cd: async () => `unfortunately, i cannot afford more directories.
if you want to help, reach out to me with a project and we can work on it.`,
  date: async () => new Date().toString(),
  vi: async () => "woah, you still use 'vi'? just try 'vim'.",
  vim: async () => "'vim' is so outdated. how about 'nvim'?",
  nvim: async () => "'nvim'? too fancy. why not 'emacs'?",
  emacs: async () => 'you know what? just use vscode.',
  sudo: async () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    return 'Permission denied: with little power comes... no responsibility? ';
  },
  skills: async () => `
**🖥️ Programming Languages:
  - Java, Python, C, C++, Bash, Powershell, PHP
  - Batch files, Shell scripts, JavaScript, TypeScript
  - HTML, CSS, PLSQL, SQLite, x86 assembly

**🔐 Security Tools:**
  - Network Analysis: Wreshark, Nmap, aircrack-ng, tcpdump
  - Malware Analysis: IDA Pro, DIE, Process Hacker, Yara, Joe Sandbox, VirusTotal, AnyRun, Volatility, Autopsy
  - Endpoint Security: Microsoft Defender, CrowdStrike, Symantec Endpoint Protection
  - Threat Intelligence: MISP, ThreatConnect, Shodan, OSINT Framework
  - Penetration Testing: Metasploit, Burp Suite, Nikto, SQLmap, Hydra, John the Ripper, hashcat

**☁️ Cloud Technologies:**
  - Platforms: AWS, Azure, Google Cloud Platform (GCP)
  - Security Services: AWS IAM, Azure Active Directory, Azure Sentinel, AWS CloudTrail, AWS WAF
  - Virtualization: VMware vSphere, Hyper-V, Docker, Kubernetes
  - Infrastructure as Code: Terraform, CloudFormation

**🛡️ Frameworks and Concepts:**
  - Cybersecurity Frameworks: NIST, MITRE ATT&CK, OWASP Top 10, CIS Controls
  - Incident Response: Digital Forensics, Malware Analysis, Threat Hunting, Incident Response Playbooks
  - Security Operations: SIEM (Microsoft Sentinel, Splunk), IDS/IPS (Snort, Suricata), DLP, PKI Management
  - Development: SDLC, REST API, Agile, DevOps, Continuous Integration (CI/CD)
  - Governance: Compliance (ISO 27001, GDPR, HIPAA), Risk Management, Vulnerability Management

**🗄️ Operating Systems:**
  - *Windows*, *Linux (Ubuntu, CentOS, Kali)*, *macOS*, *Windows Server*

**🛠️ Tools for Automation and Scripting:**
  - *Git*, *GitHub*, *GitLab*, *Ansible*, *Puppet*, *PowerShell Scripting*, *Python Automation*

**🔧 Security Engineering:**
  - *Network Design*, *Firewall Configuration (Palo Alto, Cisco ASA, Juniper)*
  - *Zero Trust Architecture*, *Network Segmentation*

**🚀 Advanced and Specialized Skills:**
  - *Reverse Engineering:* x86 Assembly, Ghidra, Radare2
  - *Binary Exploitation:* Buffer Overflows, ROP, Shellcoding
  - *Hardware Security:* Embedded Systems, CAN Protocol, Automotive Security

**🤖 Emerging Technologies:**
  - *IoT Security*, *Blockchain*, *Machine Learning for Security*, *Quantum Cryptography*

**🗣️ Soft Skills:**
  - *Leadership*, *Communication*, *Problem-Solving*, *Team Collaboration*, *Technical Writing*, *Public Speaking*
`,
  experience: async () => `
**🔍 Cyber Security Analyst (QSI Security Inc) | Mississauga, Canada | Nov 2024 - May 2025**
  - Developed and deployed various case-specific playbooks and analytics rules.
  - Conducted SOC monitoring and incident response.
  - Provided training for new team members on cybersecurity best practices.
  - Analyzed logs, network traffic, and data to identify potential threats.
  - Configured and optimized firewall rules.
  - Compiled threat intelligence reports and managed security dashboards.

**💻 IT Co-op (Martinrea Industrial Canada) | Vaughan, Canada | Sep 2023 - Dec 2023**
  - Managed and supported 150+ IT assets across platforms.
  - Created automated firmware patching scripts, improving system uptime.
  - Developed a 50-page comprehensive manual for new employees and interns.
  - Deployed GPOs, managed servers, firewalls, and network maintenance.

**🖥️ Systems Intern (Northcross Technology) | Toronto, Canada | May 2022 - Jul 2022**
  - Assisted development team with Python scripting and automated testing.
  - Created technical specification documentation.
  - Identified and addressed system vulnerabilities.
  - Collaborated with front-end teams to troubleshoot cross-functional issues.

**🔧 Systems Associate (Grow SoftTech) | Surat, India | Jan 2020 - Present**
  - Conducted R&D for embedded systems and configured 32-bit microcontrollers.
  - Managed IT asset inventory and provided hardware support.
  - Upgraded Windows IoT-based HMI controllers to Python on Raspberry Pi.
  - Developed GPOs for user devices and maintained network readiness.

**🎓 Member Board of Directors (Sheridan Student Union Inc) | Oakville, Canada | Apr 2022 - May 2023**
  - Oversaw and approved multi-million dollar operating budget.
  - Negotiated deals with insurance providers for student benefits.
  - Collaborated with top management for student welfare initiatives.

**📝 Researcher and Author (The Missing Link) | Nov 2024 - Mar 2025**
  - Authored a research paper on the need for consolidated cybersecurity regulations.
  - Analyzed gaps in current frameworks and proposed actionable solutions.

**🚀 Freelance Cybersecurity Consultant | Ongoing**
  - Provide security assessments, vulnerability analysis, and system hardening for small businesses.
  - Educate clients on cybersecurity best practices and threat mitigation.
`,
  certs: async () => `
**📜 Current Certifications:**
  - *Google's Foundation of CyberSecurity*
  - *Product Management Professional Certificate*
  - *CompTIA Tech+*

**📚 In Progress:**
  - *CompTIA Security+*
  - *CompTIA A+*
  - *Microsoft SC-200 (Microsoft Security Operations Analyst)*

**🚀 Future Goals:**
  - *Certified Ethical Hacker (CEH)*
  - *Certified Information Systems Security Professional (CISSP)*
  - *AWS Certified Solutions Architect*
  - *Offensive Security Certified Professional (OSCP)*
`,
  projects: async () => `
**🚗 Preventing CAN Injection Attack in Automobiles | Capstone 2024**
  - Developed an IoT-based prototype to mitigate CAN injection attacks.
  - Created test bench with embedded technology to simulate vehicle communication.
  - Integrated NFT as a 2FA mechanism for enhanced rolling code security.

**📄 The Missing Link | Research Paper (Nov 2024 - Mar 2025)**
  - Analyzed the need for consolidated cybersecurity regulations.
  - Identified critical gaps in government-published indexes.
  - Proposed actionable solutions for regulatory consolidation.

**🔒 Custom Security Dashboards | QSI Security Inc (2024-2025)**
  - Developed custom analytics and playbooks for SOC operations.
  - Created visual dashboards for real-time threat monitoring and response.

**🛠️ Network Automation Scripts | Martinrea Industrial Canada (2023)**
  - Automated firmware patching across 150+ devices, reducing downtime.
  - Developed Python scripts for efficient asset management.

**🔐 Embedded Systems Development | Grow SoftTech (2020 - Present)**
  - Designed and configured 32-bit microcontrollers for industrial automation.
  - Migrated HMI controllers from Windows IoT to Python on Raspberry Pi.

**🌐 Personal Website and Terminal | abhay.bhingradia.com**
  - Built a custom terminal-style personal portfolio site using React.
  - Integrated interactive commands and API calls for dynamic content.
`,
  contact: async () => `
**📧 Email:** bhingradia.abhay@gmail.com  
**🔗 LinkedIn:** [linkedin.com/in/abhay-bhingradia](https://www.linkedin.com/in/abhay-bhingradia/)  
**💻 GitHub:** [github.com/AbhayB97](https://github.com/AbhayB97)  
**🌐 Personal Website:** [abhay.bhingradia.com](https://abhay.bhingradia.com)  
**📱 Phone:** +1 416 628 0059  
`,
  education: async () => `
**🎓 Bachelor of Information Systems Security (CyberSecurity)**  
*Sheridan College | Oakville, Canada | Jan 2021 - Aug 2024*

- Conducted digital forensic analysis and collected evidence following industry standards.
- Designed and developed computer systems and networks based on user specifications.
- Implemented cryptography and created compliance and governance policy sets.
- Active member of ISSessions Sheridan Security Club and CTF participant.
- Elected as Student Director for the Sheridan Student Union (2022-2023).
`,
  banner: async () => [
    ...toHtmlAsciiLines(bannerAscii.split('\n')),
    { text: '', cls: 'system' },
    { text: `This is a personal website for ${config.name}. Please use the below commands to explore.`, cls: 'system' },
    { text: '', cls: 'system' },
    { text: "Type 'help' to see the list of available commands.", cls: 'system' },
    { text: "Type 'sumfetch' to display summary.", cls: 'system' },
    { text: 'Type "about" to know more about me.', cls: 'system' },
    {
      html: `Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.`,
      cls: 'system',
    },
  ],
};

const flattenResult = (value) => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.flatMap((item) => flattenResult(item));
  return [value];
};

const createLine = (text, cls = '', options = {}) => {
  const line = document.createElement('div');
  line.className = `terminal-line ${cls}`.trim();
  const { html = false } = options;
  if (html) {
    line.innerHTML = text && text.length ? text : '&nbsp;';
  } else if (text && text.length) {
    line.textContent = text;
  } else {
    line.innerHTML = '&nbsp;';
  }
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
    promptLabel.textContent = `${config.ps1_username}@${config.ps1_hostname}:~$`;

    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Type a command';

    form.append(promptLabel, input);

    const clearOutput = () => {
      output.innerHTML = '';
    };

    const print = (result) => {
      flattenResult(result).forEach((entry) => {
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          const { cls = '' } = entry;
          if (typeof entry.html === 'string') {
            entry.html.split('\n').forEach((line) => {
              output.append(createLine(line, cls, { html: true }));
            });
            return;
          }
          if (typeof entry.text === 'string') {
            entry.text.split('\n').forEach((line) => {
              output.append(createLine(line, cls));
            });
            return;
          }
        }

        const text = entry ?? '';
        String(text)
          .split('\n')
          .forEach((line) => {
            output.append(createLine(line));
          });
      });
      output.scrollTop = output.scrollHeight;
    };

    commands.banner().then(print);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const rawValue = input.value;
      const value = rawValue.trim();
      if (!value) return;

      output.append(createLine(`$ ${rawValue}`, 'input'));
      input.value = '';

      const [commandName, ...args] = value.split(/\s+/);
      const normalized = commandName.toLowerCase();

      if (normalized === 'clear') {
        clearOutput();
        return;
      }

      const command = commands[normalized];
      if (!command) {
        print(`shell: command not found: ${normalized}. Try 'help' to get started.`);
        return;
      }

      try {
        const result = await command(args);
        print(result);
      } catch (error) {
        print(`Error executing ${normalized}: ${error.message || error}`);
      }
    });

    root.append(output, form);
    setTimeout(() => input.focus(), 120);
    return root;
  },
};

export default TerminalApp;
