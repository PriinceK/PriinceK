// Linux Fundamentals Lab — Lesson Curriculum
// 30+ missions across 10 levels covering navigation, files, text processing,
// permissions, processes, system admin, shell scripting, troubleshooting, and cloud ops

export const LINUX_LESSONS = [
  // ═══════════════════════════════════════════
  // LEVEL 1 — Navigation Basics
  // ═══════════════════════════════════════════
  {
    id: 'nav-101',
    title: 'First Steps',
    description: 'Learn to navigate the Linux filesystem with pwd, ls, and cd.',
    level: 1,
    category: 'navigation',
    difficulty: 'Beginner',
    briefing: 'Welcome to your first GCP Compute Engine instance! Before you can manage cloud servers, you need to master basic navigation.\n\nYour mission: explore the filesystem and find your way around.',
    cloudConnection: 'Every GCP VM you SSH into drops you at a bash prompt. Navigating efficiently is the foundation of all cloud operations.',
    quickReference: [
      { cmd: 'pwd', desc: 'Print working directory' },
      { cmd: 'ls', desc: 'List directory contents' },
      { cmd: 'ls -la', desc: 'List with details + hidden files' },
      { cmd: 'cd <dir>', desc: 'Change directory' },
      { cmd: 'cd ..', desc: 'Go up one level' },
      { cmd: 'cd ~', desc: 'Go to home directory' },
    ],
    setupFS: (fs) => {
      fs.mkdirp('/home/clouduser/projects/webapp')
      fs.mkdirp('/home/clouduser/projects/api')
      fs.writeFile('/home/clouduser/projects/webapp/index.html', '<h1>Hello World</h1>\n')
      fs.writeFile('/home/clouduser/projects/api/server.js', 'const express = require("express");\n')
      fs.writeFile('/home/clouduser/projects/README.md', '# My GCP Projects\n\nThis repo contains cloud projects.\n')
    },
    tasks: [
      {
        id: 'nav-101-1',
        instruction: 'Check your current directory using pwd.',
        hint: 'Type: pwd',
        successMessage: 'You\'re in your home directory!',
        validation: { type: 'command', check: 'pwd' },
      },
      {
        id: 'nav-101-2',
        instruction: 'List the contents of the current directory.',
        hint: 'Type: ls',
        successMessage: 'You can see your files and directories.',
        validation: { type: 'command', check: 'ls' },
      },
      {
        id: 'nav-101-3',
        instruction: 'List ALL files including hidden ones with details (long format).',
        hint: 'Type: ls -la',
        successMessage: 'Hidden files start with a dot (.) — like .bashrc!',
        validation: { type: 'command_contains', check: 'ls -l' },
      },
      {
        id: 'nav-101-4',
        instruction: 'Navigate into the projects directory.',
        hint: 'Type: cd projects',
        successMessage: 'You\'re now in the projects folder.',
        validation: { type: 'cwd', check: '/home/clouduser/projects' },
      },
      {
        id: 'nav-101-5',
        instruction: 'Go back to your home directory using cd with no arguments.',
        hint: 'Type: cd',
        successMessage: 'cd alone always takes you home!',
        validation: { type: 'cwd', check: '/home/clouduser' },
      },
    ],
  },
  {
    id: 'nav-102',
    title: 'Path Explorer',
    description: 'Master absolute vs relative paths and the filesystem hierarchy.',
    level: 1,
    category: 'navigation',
    difficulty: 'Beginner',
    briefing: 'Understanding how Linux organizes files is critical for cloud engineering.\n\nYour mission: navigate using both absolute and relative paths to explore the system.',
    cloudConnection: 'On GCP VMs, config files are in /etc, logs in /var/log, web files in /var/www. Knowing the hierarchy saves time.',
    quickReference: [
      { cmd: '/etc', desc: 'System configuration files' },
      { cmd: '/var/log', desc: 'System log files' },
      { cmd: '/home', desc: 'User home directories' },
      { cmd: '/tmp', desc: 'Temporary files' },
      { cmd: 'tree', desc: 'Display directory tree' },
    ],
    tasks: [
      {
        id: 'nav-102-1',
        instruction: 'Navigate to /etc using an absolute path.',
        hint: 'Type: cd /etc',
        successMessage: '/etc is where system configs live!',
        validation: { type: 'cwd', check: '/etc' },
      },
      {
        id: 'nav-102-2',
        instruction: 'List the contents of /etc to see configuration files.',
        hint: 'Type: ls',
        successMessage: 'You can see hostname, hosts, nginx, ssh configs and more.',
        validation: { type: 'command', check: 'ls' },
      },
      {
        id: 'nav-102-3',
        instruction: 'Navigate to /var/log to check the log directory.',
        hint: 'Type: cd /var/log',
        successMessage: 'This is where all system logs are stored.',
        validation: { type: 'cwd', check: '/var/log' },
      },
      {
        id: 'nav-102-4',
        instruction: 'Use the tree command to view the directory structure of your home directory.',
        hint: 'Type: tree /home/clouduser',
        successMessage: 'tree gives you a visual map of the filesystem!',
        validation: { type: 'command_contains', check: 'tree' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 2 — File Operations
  // ═══════════════════════════════════════════
  {
    id: 'files-201',
    title: 'File Creator',
    description: 'Create, copy, move, and delete files and directories.',
    level: 2,
    category: 'files',
    difficulty: 'Beginner',
    briefing: 'Cloud engineers constantly create config files, deployment scripts, and project structures.\n\nYour mission: set up a project directory structure from scratch.',
    cloudConnection: 'When deploying to GCP, you often create config files (app.yaml, Dockerfile, nginx.conf) on VMs.',
    quickReference: [
      { cmd: 'touch <file>', desc: 'Create empty file' },
      { cmd: 'mkdir <dir>', desc: 'Create directory' },
      { cmd: 'mkdir -p a/b/c', desc: 'Create nested dirs' },
      { cmd: 'cp <src> <dst>', desc: 'Copy file' },
      { cmd: 'mv <src> <dst>', desc: 'Move/rename file' },
      { cmd: 'rm <file>', desc: 'Remove file' },
      { cmd: 'rm -rf <dir>', desc: 'Remove directory recursively' },
    ],
    tasks: [
      {
        id: 'files-201-1',
        instruction: 'Create a new directory called "deployment" in your home directory.',
        hint: 'Type: mkdir deployment',
        successMessage: 'Directory created!',
        validation: { type: 'file_exists', check: '/home/clouduser/deployment' },
      },
      {
        id: 'files-201-2',
        instruction: 'Create nested directories: deployment/staging/configs using mkdir -p.',
        hint: 'Type: mkdir -p deployment/staging/configs',
        successMessage: 'The -p flag creates parent directories as needed!',
        validation: { type: 'file_exists', check: '/home/clouduser/deployment/staging/configs' },
      },
      {
        id: 'files-201-3',
        instruction: 'Create a file called app.yaml inside deployment/ using touch.',
        hint: 'Type: touch deployment/app.yaml',
        successMessage: 'File created! touch is great for creating empty files.',
        validation: { type: 'file_exists', check: '/home/clouduser/deployment/app.yaml' },
      },
      {
        id: 'files-201-4',
        instruction: 'Copy app.yaml to the staging/configs directory.',
        hint: 'Type: cp deployment/app.yaml deployment/staging/configs/',
        successMessage: 'File copied successfully!',
        validation: { type: 'file_exists', check: '/home/clouduser/deployment/staging/configs/app.yaml' },
      },
      {
        id: 'files-201-5',
        instruction: 'Remove the original app.yaml from deployment/ (we only need the copy).',
        hint: 'Type: rm deployment/app.yaml',
        successMessage: 'Clean! Only the staging copy remains.',
        validation: { type: 'command_contains', check: 'rm' },
      },
    ],
  },
  {
    id: 'files-202',
    title: 'Content Writer',
    description: 'Write content to files using echo and redirection.',
    level: 2,
    category: 'files',
    difficulty: 'Beginner',
    briefing: 'You need to create configuration files for a web application deployment.\n\nYour mission: write content to files using echo and output redirection.',
    cloudConnection: 'On GCP VMs, you frequently write configs on the fly: echo "server_name ..." >> /etc/nginx/conf.d/app.conf',
    quickReference: [
      { cmd: 'echo "text"', desc: 'Print text to terminal' },
      { cmd: 'echo "text" > file', desc: 'Write text to file (overwrite)' },
      { cmd: 'echo "text" >> file', desc: 'Append text to file' },
      { cmd: 'cat file', desc: 'Display file contents' },
    ],
    tasks: [
      {
        id: 'files-202-1',
        instruction: 'Use echo to write "Hello GCP" to a new file called greeting.txt.',
        hint: 'Type: echo "Hello GCP" > greeting.txt',
        successMessage: 'File created with content!',
        validation: { type: 'file_exists', check: '/home/clouduser/greeting.txt' },
      },
      {
        id: 'files-202-2',
        instruction: 'Append "Cloud Engineering is fun" to greeting.txt using >>.',
        hint: 'Type: echo "Cloud Engineering is fun" >> greeting.txt',
        successMessage: 'Appended! >> adds to the file without overwriting.',
        validation: { type: 'command_contains', check: '>>' },
      },
      {
        id: 'files-202-3',
        instruction: 'Display the contents of greeting.txt using cat.',
        hint: 'Type: cat greeting.txt',
        successMessage: 'Both lines are there!',
        validation: { type: 'command', check: 'cat greeting.txt' },
      },
      {
        id: 'files-202-4',
        instruction: 'Read the system hostname file at /etc/hostname.',
        hint: 'Type: cat /etc/hostname',
        successMessage: 'This is how you check the hostname on any Linux server.',
        validation: { type: 'command', check: 'cat /etc/hostname' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 3 — Reading & Searching Files
  // ═══════════════════════════════════════════
  {
    id: 'text-301',
    title: 'Log Inspector',
    description: 'Use head, tail, and cat to read log files efficiently.',
    level: 3,
    category: 'text-processing',
    difficulty: 'Beginner',
    briefing: 'A web server is having issues. The ops team needs you to investigate the log files.\n\nYour mission: read and inspect log files to find what went wrong.',
    cloudConnection: 'Log analysis is 50% of cloud troubleshooting. GCP logs are often in /var/log or Cloud Logging.',
    quickReference: [
      { cmd: 'cat file', desc: 'Show full file' },
      { cmd: 'head -n 5 file', desc: 'Show first 5 lines' },
      { cmd: 'tail -n 5 file', desc: 'Show last 5 lines' },
      { cmd: 'wc -l file', desc: 'Count lines in file' },
    ],
    tasks: [
      {
        id: 'text-301-1',
        instruction: 'View the entire syslog using cat /var/log/syslog.',
        hint: 'Type: cat /var/log/syslog',
        successMessage: 'That\'s the full system log!',
        validation: { type: 'command', check: 'cat /var/log/syslog' },
      },
      {
        id: 'text-301-2',
        instruction: 'View just the last 3 lines of the syslog (most recent events).',
        hint: 'Type: tail -n 3 /var/log/syslog',
        successMessage: 'tail shows the end of a file — perfect for recent logs.',
        validation: { type: 'command_contains', check: 'tail' },
      },
      {
        id: 'text-301-3',
        instruction: 'View the first 2 lines of the nginx access log.',
        hint: 'Type: head -n 2 /var/log/nginx/access.log',
        successMessage: 'head shows the beginning of a file.',
        validation: { type: 'command_contains', check: 'head' },
      },
      {
        id: 'text-301-4',
        instruction: 'Count how many lines are in the auth.log file.',
        hint: 'Type: wc -l /var/log/auth.log',
        successMessage: 'wc -l is great for quickly sizing up log files.',
        validation: { type: 'command_contains', check: 'wc' },
      },
    ],
  },
  {
    id: 'text-302',
    title: 'Grep Master',
    description: 'Search files using grep to find specific patterns.',
    level: 3,
    category: 'text-processing',
    difficulty: 'Intermediate',
    briefing: 'Security alert! Someone is trying to brute-force SSH into the server.\n\nYour mission: use grep to search logs and identify the attacker.',
    cloudConnection: 'In GCP, grep is essential for parsing Cloud Logging exports and finding errors across log files.',
    quickReference: [
      { cmd: 'grep "pattern" file', desc: 'Search for pattern in file' },
      { cmd: 'grep -i "pat" file', desc: 'Case-insensitive search' },
      { cmd: 'grep -n "pat" file', desc: 'Show line numbers' },
      { cmd: 'grep -c "pat" file', desc: 'Count matches' },
      { cmd: 'grep -v "pat" file', desc: 'Invert match (exclude)' },
    ],
    tasks: [
      {
        id: 'text-302-1',
        instruction: 'Search the auth.log for "Failed password" entries.',
        hint: 'Type: grep "Failed" /var/log/auth.log',
        successMessage: 'Found the brute-force attempts!',
        validation: { type: 'command_contains', check: 'grep' },
      },
      {
        id: 'text-302-2',
        instruction: 'Count how many failed login attempts there are using grep -c.',
        hint: 'Type: grep -c "Failed" /var/log/auth.log',
        successMessage: 'Multiple failed attempts from the same IP — suspicious!',
        validation: { type: 'command_contains', check: 'grep -c' },
      },
      {
        id: 'text-302-3',
        instruction: 'Search for HTTP 500 errors in the nginx access log.',
        hint: 'Type: grep "500" /var/log/nginx/access.log',
        successMessage: 'Found a 500 Internal Server Error!',
        validation: { type: 'command_contains', check: 'grep' },
      },
      {
        id: 'text-302-4',
        instruction: 'Use grep with line numbers (-n) to find "error" in the nginx error log (case-insensitive).',
        hint: 'Type: grep -in "error" /var/log/nginx/error.log',
        successMessage: 'Combining flags like -in makes grep very powerful!',
        validation: { type: 'command_contains', check: 'grep -' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 4 — Text Processing Pipelines
  // ═══════════════════════════════════════════
  {
    id: 'pipe-401',
    title: 'Pipe Operator',
    description: 'Chain commands together using pipes (|) to process data.',
    level: 4,
    category: 'text-processing',
    difficulty: 'Intermediate',
    briefing: 'Complex data analysis requires chaining commands. The pipe operator (|) sends output of one command as input to another.\n\nYour mission: use pipes to analyze server data.',
    cloudConnection: 'Cloud engineers chain commands constantly: gcloud compute instances list | grep RUNNING | wc -l',
    quickReference: [
      { cmd: 'cmd1 | cmd2', desc: 'Pipe output of cmd1 to cmd2' },
      { cmd: 'sort', desc: 'Sort lines alphabetically' },
      { cmd: 'uniq', desc: 'Remove adjacent duplicates' },
      { cmd: 'sort | uniq -c', desc: 'Count unique occurrences' },
      { cmd: 'cut -d: -f1', desc: 'Extract field 1 using : delimiter' },
    ],
    setupFS: (fs) => {
      fs.writeFile('/home/clouduser/servers.txt', 'web-01 running\ndb-01 running\nweb-02 stopped\napi-01 running\nweb-03 running\ndb-02 stopped\napi-02 running\nweb-01 running\n')
      fs.writeFile('/home/clouduser/access.log', '10.0.0.1 GET /index.html 200\n10.0.0.2 GET /api/data 200\n10.0.0.1 POST /api/data 201\n10.0.0.3 GET /index.html 200\n10.0.0.1 GET /api/data 200\n10.0.0.2 GET /images/logo.png 404\n10.0.0.3 GET /api/data 500\n10.0.0.1 GET /index.html 200\n10.0.0.2 GET /api/health 200\n10.0.0.3 POST /api/data 201\n')
    },
    tasks: [
      {
        id: 'pipe-401-1',
        instruction: 'List servers and filter only the "running" ones using a pipe.',
        hint: 'Type: cat servers.txt | grep running',
        successMessage: 'Pipes are the glue of Linux command-line!',
        validation: { type: 'command_contains', check: '|' },
      },
      {
        id: 'pipe-401-2',
        instruction: 'Count how many servers are running by piping grep output to wc -l.',
        hint: 'Type: cat servers.txt | grep running | wc -l',
        successMessage: 'Chaining three commands to get a count!',
        validation: { type: 'command_contains', check: 'wc -l' },
      },
      {
        id: 'pipe-401-3',
        instruction: 'Extract just the IP addresses (field 1) from access.log using cut.',
        hint: 'Type: cat access.log | cut -d" " -f1',
        successMessage: 'cut extracts specific columns from text!',
        validation: { type: 'command_contains', check: 'cut' },
      },
      {
        id: 'pipe-401-4',
        instruction: 'Find the unique IP addresses from the access log by piping through sort and uniq.',
        hint: 'Type: cat access.log | cut -d" " -f1 | sort | uniq',
        successMessage: 'sort | uniq is a classic combo for finding unique values!',
        validation: { type: 'command_contains', check: 'uniq' },
      },
    ],
  },
  {
    id: 'pipe-402',
    title: 'Stream Editor',
    description: 'Use sed and awk for advanced text transformations.',
    level: 4,
    category: 'text-processing',
    difficulty: 'Intermediate',
    briefing: 'Sometimes you need to transform data on the fly. sed and awk are the power tools of text processing.\n\nYour mission: transform configuration data using stream editing.',
    cloudConnection: 'sed is commonly used to patch config files on GCP VMs during deployment scripts.',
    quickReference: [
      { cmd: 'sed "s/old/new/" file', desc: 'Replace first match per line' },
      { cmd: 'sed "s/old/new/g" file', desc: 'Replace all matches' },
      { cmd: 'awk "{print $1}" file', desc: 'Print first field' },
      { cmd: 'tr "a-z" "A-Z"', desc: 'Translate characters' },
    ],
    setupFS: (fs) => {
      fs.writeFile('/home/clouduser/config.env', 'DB_HOST=localhost\nDB_PORT=3306\nDB_NAME=myapp\nDB_USER=admin\nDB_PASS=secret123\nAPP_ENV=development\nAPP_PORT=8080\n')
    },
    tasks: [
      {
        id: 'pipe-402-1',
        instruction: 'View the config.env file.',
        hint: 'Type: cat config.env',
        successMessage: 'These are environment variables for an app.',
        validation: { type: 'command', check: 'cat config.env' },
      },
      {
        id: 'pipe-402-2',
        instruction: 'Use sed to replace "development" with "production" in config.env.',
        hint: 'Type: sed "s/development/production/" config.env',
        successMessage: 'sed transformed the config for production!',
        validation: { type: 'command_contains', check: 'sed' },
      },
      {
        id: 'pipe-402-3',
        instruction: 'Use sed to replace "localhost" with "10.128.0.3" (the db-server IP).',
        hint: 'Type: sed "s/localhost/10.128.0.3/" config.env',
        successMessage: 'Now the app points to the remote database server!',
        validation: { type: 'command_contains', check: 'sed' },
      },
      {
        id: 'pipe-402-4',
        instruction: 'Extract just the variable names (before =) using cut.',
        hint: 'Type: cat config.env | cut -d= -f1',
        successMessage: 'You extracted just the keys from the config!',
        validation: { type: 'command_contains', check: 'cut' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 5 — File Permissions & Ownership
  // ═══════════════════════════════════════════
  {
    id: 'perm-501',
    title: 'Permission Basics',
    description: 'Understand and modify file permissions with chmod.',
    level: 5,
    category: 'permissions',
    difficulty: 'Intermediate',
    briefing: 'Security is paramount in cloud environments. Linux file permissions control who can read, write, and execute files.\n\nYour mission: fix file permissions on a misconfigured deployment.',
    cloudConnection: 'GCP IAM provides cloud-level access control, but Linux file permissions are the last line of defense on VMs.',
    quickReference: [
      { cmd: 'ls -la', desc: 'View file permissions' },
      { cmd: 'chmod 755 file', desc: 'rwxr-xr-x (owner:rwx, others:rx)' },
      { cmd: 'chmod 644 file', desc: 'rw-r--r-- (owner:rw, others:r)' },
      { cmd: 'chmod 600 file', desc: 'rw------- (owner only)' },
      { cmd: 'stat file', desc: 'Detailed file information' },
    ],
    setupFS: (fs) => {
      fs.writeFile('/home/clouduser/deploy.sh', '#!/bin/bash\necho "Deploying app..."\ngsutil cp -r ./app gs://my-bucket/\ngcloud run deploy --image gcr.io/my-project/app\n', 0o644)
      fs.writeFile('/home/clouduser/secrets.env', 'API_KEY=sk-1234567890abcdef\nDB_PASSWORD=super_secret_pass\nGCP_SA_KEY=base64encodedkey\n', 0o644)
      fs.writeFile('/home/clouduser/index.html', '<h1>Welcome</h1>\n', 0o600)
    },
    tasks: [
      {
        id: 'perm-501-1',
        instruction: 'Check the current permissions of deploy.sh using ls -la.',
        hint: 'Type: ls -la deploy.sh',
        successMessage: 'Notice it has -rw-r--r-- — not executable!',
        validation: { type: 'command_contains', check: 'ls -l' },
      },
      {
        id: 'perm-501-2',
        instruction: 'Make deploy.sh executable (755) so you can run it.',
        hint: 'Type: chmod 755 deploy.sh',
        successMessage: 'Now it\'s rwxr-xr-x — executable by everyone!',
        validation: { type: 'permission', check: { path: '/home/clouduser/deploy.sh', mode: '755' } },
      },
      {
        id: 'perm-501-3',
        instruction: 'The secrets.env file is world-readable! Lock it down to owner-only (600).',
        hint: 'Type: chmod 600 secrets.env',
        successMessage: 'Critical! Secrets should only be readable by the owner.',
        validation: { type: 'permission', check: { path: '/home/clouduser/secrets.env', mode: '600' } },
      },
      {
        id: 'perm-501-4',
        instruction: 'Make index.html world-readable (644) so the web server can serve it.',
        hint: 'Type: chmod 644 index.html',
        successMessage: 'Web files need to be readable by the web server process.',
        validation: { type: 'permission', check: { path: '/home/clouduser/index.html', mode: '644' } },
      },
    ],
  },
  {
    id: 'perm-502',
    title: 'Ownership & Groups',
    description: 'Change file ownership with chown and understand users/groups.',
    level: 5,
    category: 'permissions',
    difficulty: 'Intermediate',
    briefing: 'A web application has been deployed but the files are owned by the wrong user. The nginx web server can\'t read them!\n\nYour mission: fix the ownership so nginx can serve the website.',
    cloudConnection: 'On GCP, service accounts map to Linux users. Correct ownership ensures services can access their files.',
    quickReference: [
      { cmd: 'whoami', desc: 'Show current user' },
      { cmd: 'id', desc: 'Show user/group IDs' },
      { cmd: 'sudo chown user:group file', desc: 'Change ownership' },
      { cmd: 'groups', desc: 'Show your groups' },
    ],
    tasks: [
      {
        id: 'perm-502-1',
        instruction: 'Check who you are using whoami.',
        hint: 'Type: whoami',
        successMessage: 'You\'re clouduser — a regular user.',
        validation: { type: 'command', check: 'whoami' },
      },
      {
        id: 'perm-502-2',
        instruction: 'View your full identity with the id command.',
        hint: 'Type: id',
        successMessage: 'You can see your uid, gid, and groups!',
        validation: { type: 'command', check: 'id' },
      },
      {
        id: 'perm-502-3',
        instruction: 'Check who owns the web files using ls -la /var/www/html/.',
        hint: 'Type: ls -la /var/www/html/',
        successMessage: 'The files are owned by root — nginx might not be able to read them.',
        validation: { type: 'command_contains', check: 'ls -l' },
      },
      {
        id: 'perm-502-4',
        instruction: 'Use sudo to change ownership of /var/www/html/index.html to nginx:nginx.',
        hint: 'Type: sudo chown nginx:nginx /var/www/html/index.html',
        successMessage: 'Now nginx owns the file and can serve it properly!',
        validation: { type: 'command_contains', check: 'chown' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 6 — Process Management
  // ═══════════════════════════════════════════
  {
    id: 'proc-601',
    title: 'Process Inspector',
    description: 'Monitor running processes with ps and top.',
    level: 6,
    category: 'processes',
    difficulty: 'Intermediate',
    briefing: 'Your GCP VM is running slow. The monitoring dashboard shows high CPU usage.\n\nYour mission: investigate which processes are consuming resources.',
    cloudConnection: 'GCP Cloud Monitoring shows VM-level metrics, but you often need ps/top on the VM for process-level detail.',
    quickReference: [
      { cmd: 'ps aux', desc: 'Show all processes' },
      { cmd: 'top', desc: 'Real-time process monitor' },
      { cmd: 'ps aux | grep nginx', desc: 'Find specific process' },
      { cmd: 'kill PID', desc: 'Send TERM signal' },
      { cmd: 'kill -9 PID', desc: 'Force kill process' },
    ],
    tasks: [
      {
        id: 'proc-601-1',
        instruction: 'View all running processes using ps aux.',
        hint: 'Type: ps aux',
        successMessage: 'You can see all processes, their CPU/MEM usage, and commands.',
        validation: { type: 'command', check: 'ps aux' },
      },
      {
        id: 'proc-601-2',
        instruction: 'Use top to see the real-time process monitor view.',
        hint: 'Type: top',
        successMessage: 'top is the go-to tool for real-time monitoring.',
        validation: { type: 'command', check: 'top' },
      },
      {
        id: 'proc-601-3',
        instruction: 'Find only the nginx processes using ps and grep.',
        hint: 'Type: ps aux | grep nginx',
        successMessage: 'Found the nginx master and worker processes!',
        validation: { type: 'command_contains', check: 'grep nginx' },
      },
      {
        id: 'proc-601-4',
        instruction: 'Check memory usage with the free -h command.',
        hint: 'Type: free -h',
        successMessage: 'This shows RAM usage in human-readable format.',
        validation: { type: 'command_contains', check: 'free' },
      },
    ],
  },
  {
    id: 'proc-602',
    title: 'Service Manager',
    description: 'Control system services with systemctl.',
    level: 6,
    category: 'processes',
    difficulty: 'Intermediate',
    briefing: 'The nginx web server needs to be restarted after a configuration change. Docker also needs to be enabled.\n\nYour mission: manage system services using systemctl.',
    cloudConnection: 'On GCP VMs, you use systemctl to manage services like nginx, docker, and custom application daemons.',
    quickReference: [
      { cmd: 'systemctl status nginx', desc: 'Check service status' },
      { cmd: 'systemctl start nginx', desc: 'Start a service' },
      { cmd: 'systemctl stop nginx', desc: 'Stop a service' },
      { cmd: 'systemctl restart nginx', desc: 'Restart a service' },
      { cmd: 'systemctl enable nginx', desc: 'Enable at boot' },
    ],
    tasks: [
      {
        id: 'proc-602-1',
        instruction: 'Check the status of the nginx service.',
        hint: 'Type: systemctl status nginx',
        successMessage: 'You can see nginx is active and running!',
        validation: { type: 'command', check: 'systemctl status nginx' },
      },
      {
        id: 'proc-602-2',
        instruction: 'Check if docker is running.',
        hint: 'Type: systemctl status docker',
        successMessage: 'Docker is inactive — we need to start it.',
        validation: { type: 'command', check: 'systemctl status docker' },
      },
      {
        id: 'proc-602-3',
        instruction: 'Start the docker service.',
        hint: 'Type: systemctl start docker',
        successMessage: 'Docker is now running!',
        validation: { type: 'command', check: 'systemctl start docker' },
      },
      {
        id: 'proc-602-4',
        instruction: 'Enable docker to start automatically at boot.',
        hint: 'Type: systemctl enable docker',
        successMessage: 'Docker will now start on every reboot!',
        validation: { type: 'command_contains', check: 'enable docker' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 7 — System Administration
  // ═══════════════════════════════════════════
  {
    id: 'sys-701',
    title: 'System Health Check',
    description: 'Assess system health with disk, memory, and CPU tools.',
    level: 7,
    category: 'system',
    difficulty: 'Intermediate',
    briefing: 'You\'re the on-call cloud engineer. A VM alert triggered — possible disk or memory issue.\n\nYour mission: perform a full system health check.',
    cloudConnection: 'These commands are your first response when GCP Cloud Monitoring alerts you about a VM issue.',
    quickReference: [
      { cmd: 'df -h', desc: 'Disk space usage' },
      { cmd: 'du -sh /path', desc: 'Directory size' },
      { cmd: 'free -h', desc: 'Memory usage' },
      { cmd: 'uptime', desc: 'System load & uptime' },
      { cmd: 'uname -a', desc: 'System information' },
    ],
    tasks: [
      {
        id: 'sys-701-1',
        instruction: 'Check the system information using uname -a.',
        hint: 'Type: uname -a',
        successMessage: 'This shows the kernel, architecture, and hostname.',
        validation: { type: 'command', check: 'uname -a' },
      },
      {
        id: 'sys-701-2',
        instruction: 'Check disk space usage with df -h.',
        hint: 'Type: df -h',
        successMessage: 'Check the Use% column for any partitions near 100%.',
        validation: { type: 'command_contains', check: 'df' },
      },
      {
        id: 'sys-701-3',
        instruction: 'Check memory usage with free -h.',
        hint: 'Type: free -h',
        successMessage: 'Memory looks healthy — plenty of available RAM.',
        validation: { type: 'command_contains', check: 'free' },
      },
      {
        id: 'sys-701-4',
        instruction: 'Check system uptime and load average.',
        hint: 'Type: uptime',
        successMessage: 'Load average under 1.0 on 2 cores = healthy!',
        validation: { type: 'command', check: 'uptime' },
      },
      {
        id: 'sys-701-5',
        instruction: 'Check how much space the log directory uses.',
        hint: 'Type: du -h /var/log',
        successMessage: 'Logs can fill up disks fast — monitor them!',
        validation: { type: 'command_contains', check: 'du' },
      },
    ],
  },
  {
    id: 'sys-702',
    title: 'Environment Master',
    description: 'Work with environment variables and system configuration.',
    level: 7,
    category: 'system',
    difficulty: 'Intermediate',
    briefing: 'Applications on GCP read config from environment variables. You need to set up the environment for a new deployment.\n\nYour mission: master environment variables.',
    cloudConnection: 'GCP Cloud Run, App Engine, and Cloud Functions all use environment variables for configuration.',
    quickReference: [
      { cmd: 'env', desc: 'Show all environment vars' },
      { cmd: 'echo $VAR', desc: 'Print a variable' },
      { cmd: 'export KEY=val', desc: 'Set environment variable' },
      { cmd: 'printenv KEY', desc: 'Print specific variable' },
    ],
    tasks: [
      {
        id: 'sys-702-1',
        instruction: 'View all current environment variables.',
        hint: 'Type: env',
        successMessage: 'These are your shell environment variables.',
        validation: { type: 'command', check: 'env' },
      },
      {
        id: 'sys-702-2',
        instruction: 'Print just the HOME variable using echo.',
        hint: 'Type: echo $HOME',
        successMessage: 'Your home directory path!',
        validation: { type: 'command_contains', check: 'echo $HOME' },
      },
      {
        id: 'sys-702-3',
        instruction: 'Set a new environment variable: export GCP_PROJECT=my-project-123',
        hint: 'Type: export GCP_PROJECT=my-project-123',
        successMessage: 'Variable set! Apps can now read GCP_PROJECT.',
        validation: { type: 'command_contains', check: 'export GCP_PROJECT' },
      },
      {
        id: 'sys-702-4',
        instruction: 'Verify the new variable with printenv GCP_PROJECT.',
        hint: 'Type: printenv GCP_PROJECT',
        successMessage: 'The variable is set and ready for your app!',
        validation: { type: 'command', check: 'printenv GCP_PROJECT' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 8 — Find & Advanced Search
  // ═══════════════════════════════════════════
  {
    id: 'find-801',
    title: 'File Finder',
    description: 'Use find to locate files across the filesystem.',
    level: 8,
    category: 'files',
    difficulty: 'Advanced',
    briefing: 'A rogue config file is causing issues on the server. You need to track down all configuration files and a specific missing backup.\n\nYour mission: use find to search the filesystem.',
    cloudConnection: 'On GCP VMs, find is essential for locating stray config files, orphaned logs, and temporary files filling up disks.',
    quickReference: [
      { cmd: 'find /path -name "*.txt"', desc: 'Find by filename' },
      { cmd: 'find /path -type f', desc: 'Find only files' },
      { cmd: 'find /path -type d', desc: 'Find only directories' },
      { cmd: 'find . -name "*.log"', desc: 'Find all log files' },
    ],
    tasks: [
      {
        id: 'find-801-1',
        instruction: 'Find all .conf files under /etc.',
        hint: 'Type: find /etc -name "*.conf"',
        successMessage: 'Found all configuration files!',
        validation: { type: 'command_contains', check: 'find' },
      },
      {
        id: 'find-801-2',
        instruction: 'Find all directories under /var.',
        hint: 'Type: find /var -type d',
        successMessage: 'You can see the full directory structure!',
        validation: { type: 'command_contains', check: '-type d' },
      },
      {
        id: 'find-801-3',
        instruction: 'Find all .log files anywhere on the system.',
        hint: 'Type: find / -name "*.log"',
        successMessage: 'Log files found across the filesystem!',
        validation: { type: 'command_contains', check: '*.log' },
      },
      {
        id: 'find-801-4',
        instruction: 'Find the backup nginx config by searching for "*.bak" files.',
        hint: 'Type: find / -name "*.bak"',
        successMessage: 'Found the backup at /var/backups/nginx.conf.bak!',
        validation: { type: 'command_contains', check: '*.bak' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 9 — Troubleshooting
  // ═══════════════════════════════════════════
  {
    id: 'trouble-901',
    title: 'Log Forensics',
    description: 'Investigate server issues by combining multiple commands.',
    level: 9,
    category: 'troubleshooting',
    difficulty: 'Advanced',
    briefing: 'INCIDENT REPORT: The web server went down at 10:30. Users reported errors. The security team detected suspicious SSH activity.\n\nYour mission: investigate the incident using log analysis.',
    cloudConnection: 'Incident response on GCP involves correlating VM logs, Cloud Logging, and Cloud Monitoring data.',
    quickReference: [
      { cmd: 'grep "error" log | tail', desc: 'Recent errors' },
      { cmd: 'grep -c "Failed" authlog', desc: 'Count failures' },
      { cmd: 'cat log | sort | uniq -c', desc: 'Frequency analysis' },
      { cmd: 'diff file1 file2', desc: 'Compare files' },
    ],
    setupFS: (fs) => {
      fs.writeFile('/home/clouduser/incident-notes.md', '# Incident Report\n\nTimeline:\n- 09:15 — SSH brute force detected\n- 10:30 — nginx crashed\n- 10:35 — Service restored\n\nInvestigate /var/log/ for details.\n')
    },
    tasks: [
      {
        id: 'trouble-901-1',
        instruction: 'Find the brute-force SSH attempts in auth.log — search for the attacker IP.',
        hint: 'Type: grep "185.220" /var/log/auth.log',
        successMessage: 'The attacker IP is 185.220.101.42!',
        validation: { type: 'command_contains', check: 'grep' },
      },
      {
        id: 'trouble-901-2',
        instruction: 'Check what happened to nginx at 10:30 in the syslog.',
        hint: 'Type: grep "10:30" /var/log/syslog',
        successMessage: 'nginx was killed! It received a SIGKILL (status=9).',
        validation: { type: 'command_contains', check: 'grep' },
      },
      {
        id: 'trouble-901-3',
        instruction: 'Compare the current nginx.conf with the backup to check for unauthorized changes.',
        hint: 'Type: diff /etc/nginx/nginx.conf /var/backups/nginx.conf.bak',
        successMessage: 'Good detective work! The diff shows what changed.',
        validation: { type: 'command_contains', check: 'diff' },
      },
      {
        id: 'trouble-901-4',
        instruction: 'Check the nginx error log for any application errors.',
        hint: 'Type: cat /var/log/nginx/error.log',
        successMessage: 'Found upstream timeout and missing file errors!',
        validation: { type: 'command_contains', check: 'error.log' },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // LEVEL 10 — Cloud Operations
  // ═══════════════════════════════════════════
  {
    id: 'cloud-1001',
    title: 'Cloud SSH Config',
    description: 'Configure SSH and examine GCP-specific files on a VM.',
    level: 10,
    category: 'cloud-ops',
    difficulty: 'Advanced',
    briefing: 'As a cloud engineer, you need to understand how GCP provisions VMs. The metadata server, SSH config, and startup scripts all matter.\n\nYour mission: explore GCP-specific configurations on this VM.',
    cloudConnection: 'Every GCP VM has metadata, SSH keys managed by OS Login, and configs set by the guest agent.',
    quickReference: [
      { cmd: 'cat /etc/ssh/sshd_config', desc: 'SSH server config' },
      { cmd: 'cat /etc/os-release', desc: 'OS information' },
      { cmd: 'curl metadata.google.internal', desc: 'GCP metadata server' },
      { cmd: 'cat /proc/cpuinfo', desc: 'CPU information' },
    ],
    tasks: [
      {
        id: 'cloud-1001-1',
        instruction: 'Check the OS release information.',
        hint: 'Type: cat /etc/os-release',
        successMessage: 'Running Ubuntu 22.04 LTS — a popular choice for GCP VMs.',
        validation: { type: 'command', check: 'cat /etc/os-release' },
      },
      {
        id: 'cloud-1001-2',
        instruction: 'Review the SSH server configuration for security settings.',
        hint: 'Type: cat /etc/ssh/sshd_config',
        successMessage: 'Notice: PermitRootLogin=no, PasswordAuthentication=no — good security!',
        validation: { type: 'command_contains', check: 'sshd_config' },
      },
      {
        id: 'cloud-1001-3',
        instruction: 'Query the GCP metadata server using curl.',
        hint: 'Type: curl metadata.google.internal',
        successMessage: 'The metadata server provides instance info: zone, machine type, hostname!',
        validation: { type: 'command_contains', check: 'curl' },
      },
      {
        id: 'cloud-1001-4',
        instruction: 'Check the CPU information of this VM.',
        hint: 'Type: cat /proc/cpuinfo',
        successMessage: '2 cores of Intel Xeon @ 2.20GHz — a typical e2-medium!',
        validation: { type: 'command', check: 'cat /proc/cpuinfo' },
      },
    ],
  },
  {
    id: 'cloud-1002',
    title: 'Server Hardening',
    description: 'Secure a GCP VM by checking and fixing common misconfigurations.',
    level: 10,
    category: 'cloud-ops',
    difficulty: 'Advanced',
    briefing: 'Security audit time! Your VM needs to pass compliance checks before going to production.\n\nYour mission: identify and fix security issues on this server.',
    cloudConnection: 'GCP Security Command Center flags VM issues, but fixing them requires hands-on Linux knowledge.',
    quickReference: [
      { cmd: 'cat /etc/shadow', desc: 'Password hashes (root only)' },
      { cmd: 'chmod 600 secrets', desc: 'Lock down sensitive files' },
      { cmd: 'ps aux | grep suspicious', desc: 'Find suspicious processes' },
      { cmd: 'systemctl list-units', desc: 'Check running services' },
    ],
    setupFS: (fs) => {
      fs.writeFile('/home/clouduser/.ssh/authorized_keys', 'ssh-rsa AAAAB3... clouduser@gcp-lab\n', 0o644)
      fs.writeFile('/home/clouduser/credentials.json', '{"type":"service_account","project_id":"my-project"}\n', 0o644)
    },
    tasks: [
      {
        id: 'cloud-1002-1',
        instruction: 'Check running services to see if anything unnecessary is active.',
        hint: 'Type: systemctl list-units',
        successMessage: 'Review which services are active — disable what you don\'t need.',
        validation: { type: 'command_contains', check: 'systemctl' },
      },
      {
        id: 'cloud-1002-2',
        instruction: 'Lock down the SSH authorized_keys file to owner-only (600).',
        hint: 'Type: chmod 600 .ssh/authorized_keys',
        successMessage: 'SSH keys should only be readable by the owner!',
        validation: { type: 'command_contains', check: 'chmod 600' },
      },
      {
        id: 'cloud-1002-3',
        instruction: 'The credentials.json is world-readable! Fix it to 600.',
        hint: 'Type: chmod 600 credentials.json',
        successMessage: 'Critical fix! Service account keys must be protected.',
        validation: { type: 'command_contains', check: 'chmod 600' },
      },
      {
        id: 'cloud-1002-4',
        instruction: 'Check the /etc/passwd file to review all user accounts on the system.',
        hint: 'Type: cat /etc/passwd',
        successMessage: 'Audit complete! Only expected users are present.',
        validation: { type: 'command', check: 'cat /etc/passwd' },
      },
    ],
  },
]
