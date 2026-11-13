import type { SeedPath } from "@/lib/curriculum/seed";

export const linuxPath: SeedPath = {
  title: "Linux Fundamentals",
  description:
    "Master the command line, file system, permissions, and the essential tools every DevOps engineer uses daily.",
  slug: "linux",
  modules: [
    {
      title: "Shell Basics",
      description: "Navigate the command line with confidence.",
      slug: "shell-basics",
      icon: "Terminal",
      units: [
        {
          title: "Getting Comfortable",
          description: "Your first commands and navigation skills.",
          slug: "first-commands",
          lessons: [
            {
              title: "What is a Shell?",
              description:
                "Understand the shell, terminal emulators, and why the command line matters.",
              slug: "what-is-a-shell",
              estimatedMinutes: 4,
              learningObjectives: [
                "Explain what a shell is and how it differs from a terminal",
                "Recognize the Bash prompt and basic command anatomy",
              ],
              skills: [
                { name: "shell-awareness", description: "Understand the role of the shell" },
              ],
              activities: [
                {
                  title: "The Shell and the Terminal",
                  body: "A **shell** is a program that interprets the commands you type and asks the operating system to run them. The **terminal** (or terminal emulator) is the window that displays text and sends your keystrokes to the shell. Bash is the default shell on most Linux systems and in cloud containers.",
                },
                {
                  title: "Try it",
                  body: "Open a terminal and type a command, then press Enter. Nothing breaks — the shell responds, which is the whole idea.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which program interprets the commands you type and asks the operating system to run them?",
                  options: ["Terminal", "Shell", "Kernel", "Compiler"],
                  correctAnswer: "Shell",
                  explanation:
                    "The shell parses your command line and executes programs on your behalf. The terminal emulator is only the window that displays text and forwards keystrokes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Bash is the default shell on most Linux systems and in many cloud containers.",
                  correctAnswer: "true",
                  explanation:
                    "Bash ships as the default shell on the vast majority of Linux distributions and base container images.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "The shell is a graphical application that you can only interact with through buttons and menus in a window.",
                  correctAnswer: "false",
                  explanation:
                    "The shell is a text-based program. A terminal emulator is just the window that renders its text and forwards your keystrokes — and the shell works fine over SSH or on a virtual console with no graphical interface at all.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which of these is a shell?",
                  options: ["Bash", "GNOME Terminal", "SSH", "VS Code"],
                  correctAnswer: "Bash",
                  explanation:
                    "Bash is a shell: a program that reads your commands and runs them. GNOME Terminal is a terminal emulator, SSH is a remote-login protocol, and VS Code is an editor.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command prints the message `ready` to the terminal?",
                  options: ["echo ready", "print ready", "msg ready", "cat ready"],
                  correctAnswer: "echo ready",
                  explanation:
                    "echo writes its arguments to standard output — the classic first command that proves the shell is listening.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You have just opened a terminal on a brand-new Ubuntu server. Your prompt reads `ubuntu@web-1:~$`. Use the shell to figure out who you are and where you are.",
                  parts: [
                    {
                      prompt:
                        "Type the command that prints your username.",
                      correctAnswer: "whoami",
                    },
                    {
                      prompt:
                        "Type the command that prints your current working directory.",
                      correctAnswer: "pwd",
                    },
                    {
                      prompt:
                        "Type the command that lists the files and directories in that directory.",
                      correctAnswer: "ls",
                    },
                  ],
                  explanation:
                    "whoami shows your login name, pwd prints the present working directory, and ls lists its contents. Together they tell you exactly where you are in the shell.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question:
                    "Unscramble the word that names the program which interprets the commands you type.",
                  scrambledWord: "shell",
                  explanation:
                    "The shell is the program that reads your command line and asks the operating system to run it; Bash is one common shell.",
                  hint: "It is the program Bash is.",
                },
              ],
            },
            {
              title: "Navigating the Filesystem",
              description:
                "Use pwd, ls, and cd to move around your machine.",
              slug: "navigating-filesystem",
              estimatedMinutes: 6,
              learningObjectives: [
                "Use pwd to print your current directory",
                "List files with ls and common flags",
                "Change directories with cd using absolute and relative paths",
              ],
              skills: [
                { name: "filesystem-navigation", description: "Move through directories using the CLI" },
              ],
              activities: [
                {
                  title: "Know Where You Are",
                  body: "`pwd` prints the current working directory. `ls` lists its contents — add `-l` for a detailed listing, `-a` to include hidden files, and `-h` for human-readable sizes.",
                },
                {
                  title: "Example",
                  body: "From your home directory: `ls` shows files, `cd Documents` moves into Documents, `cd ..` moves back one level, and `cd ~` returns home.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command prints your current working directory?",
                  options: ["ls", "pwd", "cd", "cat"],
                  correctAnswer: "pwd",
                  explanation:
                    "pwd stands for 'print working directory' and shows where you are in the filesystem.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which flag makes ls include hidden files?",
                  options: ["-a", "-l", "-h", "-r"],
                  correctAnswer: "-a",
                  explanation:
                    "ls -a lists all entries including dotfiles. Use -l for a detailed listing and -h for human-readable sizes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "The command cd .. moves you up one level in the directory tree.",
                  correctAnswer: "true",
                  explanation:
                    "The entry .. is the parent directory, so cd .. moves to the folder that contains your current one.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "You are in /home/ana/projects/app. Which command moves you two levels up, into /home/ana/projects?",
                  options: ["cd ../..", "cd ../", "cd /home", "cd ~"],
                  correctAnswer: "cd ../..",
                  explanation:
                    "Each .. climbs one level, so cd ../.. from app lands in projects. cd /home and cd ~ jump elsewhere entirely, and cd ../ only climbs once.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command moves you into a directory named notes inside your current directory?",
                  options: ["cd notes", "ls notes", "push notes", "mv notes"],
                  correctAnswer: "cd notes",
                  explanation:
                    "A bare relative path is resolved from your current directory, so cd notes moves into the notes folder that lives right here.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which command lists the current directory in long format and includes hidden files?",
                  options: ["ls -la", "ls -lh", "ls -a", "ls -ld"],
                  correctAnswer: "ls -la",
                  explanation:
                    "-l asks for the long (detailed) listing and -a includes hidden dotfiles. The flags can be combined in either order.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You have been working in a deeply nested project and want to climb back out, one level at a time, until you are home.",
                  parts: [
                    {
                      prompt:
                        "You are in /home/ana/work/repo/src. Type the command that moves up one level into repo.",
                      correctAnswer: "cd ..",
                    },
                    {
                      prompt:
                        "Type the command that returns to your home directory from anywhere.",
                      correctAnswer: "cd ~|cd",
                    },
                    {
                      prompt:
                        "Type the command that prints your current directory to confirm you are home.",
                      correctAnswer: "pwd",
                    },
                  ],
                  explanation:
                    "cd .. climbs one level, cd ~ (or plain cd) returns home, and pwd confirms where you are. pwd pairs perfectly with any navigation sequence.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "Arrange these steps in the order you would follow to create and inspect a directory named logs and then return home.",
                  sequenceItems: [
                    { id: "cd-home", text: "Run cd ~ to return to your home directory" },
                    { id: "mkdir-logs", text: "Run mkdir logs to create the directory" },
                    { id: "cd-logs", text: "Run cd logs to enter it" },
                    { id: "ls-logs", text: "Run ls to list what is inside logs" },
                  ],
                  sequenceCorrectOrder: ["mkdir-logs", "cd-logs", "ls-logs", "cd-home"],
                  explanation:
                    "First mkdir logs creates the folder, cd logs enters it, ls inspects its contents, and cd ~ finally climbs back home.",
                  hint: "You must create the directory before you can enter it.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: The command ________ prints your current working directory.",
                  fillBlanks: [{ answer: "pwd" }],
                  explanation:
                    "pwd stands for 'print working directory' and shows the absolute path of where you are in the tree.",
                },
              ],
            },
            {
              title: "Reading Manuals",
              description:
                "Learn any command with man pages and --help.",
              slug: "reading-manuals",
              estimatedMinutes: 4,
              learningObjectives: [
                "Use man <command> to read manual pages",
                "Use <command> --help for a quick reference",
              ],
              skills: [
                { name: "man-pages", description: "Find documentation for any command" },
              ],
              activities: [
                {
                  title: "Help is Built In",
                  body: "`man ls` opens the manual page for `ls`. Press `q` to quit, `/term` to search, and `n` to jump to the next match. Many commands also accept `--help` for a condensed summary.",
                },
                {
                  title: "Try it",
                  body: "Run `man bash` and explore. You will use this habit constantly as an engineer.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command opens the full manual page for ls?",
                  options: ["man ls", "ls -m", "help ls", "manual ls"],
                  correctAnswer: "man ls",
                  explanation:
                    "man ls opens the manual page. Inside, press / to search, n for the next match, and q to quit.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "You quit a man page by pressing q.",
                  correctAnswer: "true",
                  explanation:
                    "Pressing q closes the pager and returns you to the shell prompt.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which argument prints a condensed summary of a command's options and then exits, without opening a pager?",
                  options: ["--help", "--man", "--docs", "-i"],
                  correctAnswer: "--help",
                  explanation:
                    "--help prints a short usage summary and returns to the prompt immediately. man opens the full interactive manual page instead.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Running ls --help opens an interactive manual page you have to scroll through and quit.",
                  correctAnswer: "false",
                  explanation:
                    "--help prints everything to the terminal and exits on its own — no pager is opened, so there is nothing to quit.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command opens the manual page for the command grep?",
                  options: ["man grep", "help grep", "info grep", "grep --man"],
                  correctAnswer: "man grep",
                  explanation:
                    "man grep opens grep's manual page. Inside, press / to search, n for the next match, and q to quit.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "When inside a man page and you have searched for text, which key jumps to the next match?",
                  options: ["n", "p", "f", "s"],
                  correctAnswer: "n",
                  explanation:
                    "In the pager that renders man pages, n repeats the most recent forward search, moving you to the next match.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You need to check the tar command's options, search inside its manual page, and then leave the pager safely.",
                  parts: [
                    {
                      prompt:
                        "Type the command that opens tar's manual page.",
                      correctAnswer: "man tar",
                    },
                    {
                      prompt:
                        "Type the key that jumps to the next search match inside the pager.",
                      correctAnswer: "n",
                    },
                    {
                      prompt:
                        "Type the key that quits the pager and returns to the shell prompt.",
                      correctAnswer: "q",
                    },
                  ],
                  explanation:
                    "man opens the manual, n moves to the next search match, and q closes the pager. This is the same habit you will use to learn every tool on the command line.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question:
                    "Match each key or argument to what it does inside a man page.",
                  matchPairs: [
                    { left: "/term", right: "Search forward for text" },
                    { left: "n", right: "Jump to the next match" },
                    { left: "q", right: "Quit the pager" },
                    { left: "--help", right: "Print a brief usage summary" },
                  ],
                  explanation:
                    "Inside a man page, /term searches forward, n repeats the search to the next match, and q quits. --help is a separate, non-interactive summary.",
                  hint: "n is only useful right after you run a search.",
                },
              ],
            },
          ],
        },
        {
          title: "Reading and Writing",
          description: "Create, view, and edit files from the terminal.",
          slug: "reading-writing",
          lessons: [
            {
              title: "Viewing Files",
              description: "Use cat, less, head, and tail to inspect files.",
              slug: "viewing-files",
              estimatedMinutes: 5,
              learningObjectives: [
                "Display a file with cat",
                "Page through output with less",
                "Sample the start and end of files with head and tail",
              ],
              skills: [
                { name: "file-reading", description: "Inspect file contents from the CLI" },
              ],
              activities: [
                {
                  title: "Four Essential Readers",
                  body: "`cat file` prints everything at once — great for short files. `less file` pages large files with search. `head -n 10 file` shows the first ten lines and `tail -n 10 file` the last ten — invaluable for logs.",
                },
                {
                  title: "Example",
                  body: "`tail -f app.log` follows new lines as they are written, the classic way to watch logs in real time.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command shows only the last ten lines of a file?",
                  options: ["cat", "head", "tail", "less"],
                  correctAnswer: "tail",
                  explanation:
                    "tail shows the end of a file — the perfect tool for recent log entries. head shows the beginning.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "tail -f app.log keeps watching a log file and prints new lines as they are appended.",
                  correctAnswer: "true",
                  explanation:
                    "The -f (follow) flag keeps tail attached to the file so it streams new entries in real time.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command prints the entire contents of the file app.log to the terminal?",
                  options: ["cat app.log", "less app.log", "head app.log", "more app.log"],
                  correctAnswer: "cat app.log",
                  explanation:
                    "cat writes the file's contents to standard output — perfect for short files you want to see all at once.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command pages through a large file so you can scroll and search?",
                  options: ["less", "cat", "echo", "wc"],
                  correctAnswer: "less",
                  explanation:
                    "less opens a file interactively with scrolling and search. cat dumps everything at once and is clumsy for large files.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which command keeps watching server.log and prints new lines as they are appended?",
                  options: ["tail -f server.log", "tail server.log", "cat server.log", "watch server.log"],
                  correctAnswer: "tail -f server.log",
                  explanation:
                    "tail -f follows the file, streaming each appended line in real time — the classic way to watch live logs.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "With no flags, head file and tail file each print exactly ten lines.",
                  correctAnswer: "true",
                  explanation:
                    "The default is ten lines for both. Use -n to override, for example head -n 50 file.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "A service writes to /var/log/app.log and you suspect it just crashed. Inspect the log from the terminal.",
                  parts: [
                    {
                      prompt:
                        "Type the command that prints only the last twenty lines of /var/log/app.log.",
                      correctAnswer:
                        "tail -n 20 /var/log/app.log|tail -20 /var/log/app.log",
                    },
                    {
                      prompt:
                        "Type the command that watches /var/log/app.log and prints every new line as it is appended.",
                      correctAnswer: "tail -f /var/log/app.log",
                    },
                    {
                      prompt:
                        "Type the command that prints the whole file at once so you can scan every entry.",
                      correctAnswer: "cat /var/log/app.log",
                    },
                  ],
                  explanation:
                    "tail -n 20 shows the most recent entries, tail -f follows new output live while you watch, and cat dumps the entire file for a full scan.",
                },
                {
                  type: "code_completion",
                  difficulty: "intermediate",
                  question:
                    "Complete the one-liner that keeps watching app.log and prints every new line as it is appended.",
                  codeLanguage: "bash",
                  codeBlanks: [
                    { id: "cmd", answer: "tail -f app.log", placeholder: "<command>" },
                  ],
                  explanation:
                    "tail -f app.log follows the file and streams each newly appended line in real time — the classic way to watch live logs.",
                  hint: "The command is the word 'tail' plus two things: -f and the filename.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: The command ________ shows the first ten lines of a file by default.",
                  fillBlanks: [{ answer: "head" }],
                  explanation:
                    "head prints the beginning of a file (ten lines by default), the natural complement to tail.",
                },
              ],
            },
            {
              title: "Editing with Vim",
              description:
                "Get comfortable with the editor that's installed everywhere.",
              slug: "editing-with-vim",
              estimatedMinutes: 8,
              learningObjectives: [
                "Open and quit Vim safely",
                "Switch between normal, insert, and command modes",
                "Save changes with :w and quit with :q",
              ],
              skills: [
                { name: "vim", description: "Edit files with Vim on any server" },
              ],
              activities: [
                {
                  title: "Modes Are the Point",
                  body: "Vim has **normal mode** for commands (default), **insert mode** for typing, and **command-line mode** for saving/quitting. Press `i` to insert text, `Esc` to return to normal mode. Save with `:w`, quit with `:q`, and force-quit without saving with `:q!`.",
                },
                {
                  title: "Trap to Avoid",
                  body: "New users get stuck with `:q!`. There is no panel of buttons here, but every Linux box has Vim — that reachability is why it is worth learning.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which key switches Vim into insert mode?",
                  options: ["i", "w", "q", "Esc"],
                  correctAnswer: "i",
                  explanation:
                    "Pressing i enters insert mode so you can type. Press Esc to return to normal mode for commands.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: ":q! force-quits Vim without saving changes.",
                  correctAnswer: "true",
                  explanation:
                    "The ! overrides the warning about unsaved changes and quits immediately. Use :wq to save and quit.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "You are in Vim's normal mode. Which key switches to insert mode so you can start typing?",
                  options: ["i", "a", "o", "Esc"],
                  correctAnswer: "i",
                  explanation:
                    "Pressing i enters insert mode so keystrokes become text. Press Esc to return to normal mode for commands.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which Vim command saves the file and quits in one step?",
                  options: [":wq", ":q", ":w", ":ww"],
                  correctAnswer: ":wq",
                  explanation:
                    ":w writes the file and :q quits; :wq does both. :q alone refuses to quit with unsaved changes, and :w alone keeps Vim open.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which Vim command quits without saving your changes?",
                  options: [":q!", ":wq", ":q", ":w!"],
                  correctAnswer: ":q!",
                  explanation:
                    "The ! suppresses the unsaved-changes warning, so :q! abandons everything and exits immediately.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Pressing Esc while in insert mode returns you to normal mode.",
                  correctAnswer: "true",
                  explanation:
                    "Esc always leaves insert mode, and that is how you get back to the commands you need for saving and quitting.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You opened notes.txt in Vim, made a mess of it, and want to bail out safely and start over.",
                  parts: [
                    {
                      prompt:
                        "Type the Vim command that quits without saving your changes.",
                      correctAnswer: ":q!",
                    },
                    {
                      prompt:
                        "You reopen notes.txt in Vim. Type the key that switches to insert mode.",
                      correctAnswer: "i",
                    },
                    {
                      prompt:
                        "Type the command that saves your work and quits Vim in one step.",
                      correctAnswer: ":wq|:x",
                    },
                  ],
                  explanation:
                    ":q! abandons your changes, i enters insert mode to type, and :wq (or :x) saves and quits in one step.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each Vim key or command to what it does.",
                  matchPairs: [
                    { left: "i", right: "Enter insert mode" },
                    { left: "Esc", right: "Return to normal mode" },
                    { left: ":w", right: "Save the file" },
                    { left: ":q!", right: "Quit without saving" },
                  ],
                  explanation:
                    "i enters insert mode for typing, Esc returns to normal mode, :w writes the file, and :q! discards your changes and quits.",
                  hint: "One pair is about escaping back from typing.",
                },
              ],
            },
            {
              title: "Creating Files",
              description: "touch, mkdir, cp, and mv for file management.",
              slug: "creating-files",
              estimatedMinutes: 6,
              learningObjectives: [
                "Create files with touch and directories with mkdir",
                "Copy with cp and move/rename with mv",
                "Remove files and directories with rm",
              ],
              skills: [
                { name: "file-management", description: "Create, copy, move, and delete files" },
              ],
              activities: [
                {
                  title: "The Core File Tools",
                  body: "`touch new.txt` creates an empty file; `mkdir -p a/b/c` creates nested directories. `cp source dest` copies, `mv old new` moves or renames, and `rm -r dir` removes a directory recursively. Watch out: there is no trash can.",
                },
                {
                  title: "Safe Habits",
                  body: "Prefer `rm -i` interactively on important directories and test with tools that support `--dry-run` where available.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command creates a new empty file?",
                  options: ["mkdir", "touch", "cp", "rm"],
                  correctAnswer: "touch",
                  explanation:
                    "touch creates an empty file (or updates a file's timestamp if it already exists). mkdir creates directories.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "rm -r removes a directory and everything inside it.",
                  correctAnswer: "true",
                  explanation:
                    "The -r (recursive) flag makes rm descend into directories. There is no trash can, so use it carefully.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command creates a new empty file named deploy.yml?",
                  options: ["touch deploy.yml", "mkdir deploy.yml", "create deploy.yml", "new deploy.yml"],
                  correctAnswer: "touch deploy.yml",
                  explanation:
                    "touch creates an empty file (or refreshes the timestamp if it already exists).",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command creates a directory named configs?",
                  options: ["mkdir configs", "touch configs", "make configs", "newdir configs"],
                  correctAnswer: "mkdir configs",
                  explanation:
                    "mkdir creates a directory. Add -p to create any missing parents in the path.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which command copies a.txt to b.txt, creating or overwriting b.txt?",
                  options: [
                    "cp a.txt b.txt",
                    "mv a.txt b.txt",
                    "rm a.txt b.txt",
                    "mkdir a.txt b.txt",
                  ],
                  correctAnswer: "cp a.txt b.txt",
                  explanation:
                    "cp copies source to destination. mv would move (and remove) the original, rm deletes, and mkdir makes directories.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Moving a file with mv is also how you rename it.",
                  correctAnswer: "true",
                  explanation:
                    "mv old new in the same directory is a rename in one step — it works exactly the same as moving between directories.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question:
                    "Which command copies the directory conf and everything under it into backup/?",
                  options: [
                    "cp -r conf backup",
                    "cp conf backup",
                    "copy conf backup",
                    "dd conf backup",
                  ],
                  correctAnswer: "cp -r conf backup",
                  explanation:
                    "Plain cp refuses to copy a directory; the -r (recursive) flag copies the directory and all of its contents.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "Set up a small scratch project: make a directory, drop an empty file into it, and back that file up.",
                  parts: [
                    {
                      prompt:
                        "Type the command that creates a directory named scratch.",
                      correctAnswer: "mkdir scratch",
                    },
                    {
                      prompt:
                        "Type the command that creates an empty README.md inside scratch.",
                      correctAnswer: "touch scratch/README.md",
                    },
                    {
                      prompt:
                        "Type the command that copies scratch/README.md to scratch/README.bak.",
                      correctAnswer:
                        "cp scratch/README.md scratch/README.bak",
                    },
                  ],
                  explanation:
                    "mkdir creates directories, touch creates empty files within a path, and cp copies a file — you now have a backed-up scratch setup.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: The command ________ creates a new empty file (or refreshes its timestamp if it already exists).",
                  fillBlanks: [{ answer: "touch" }],
                  explanation:
                    "touch is the standard way to create an empty file; run it again on an existing file and it simply updates the timestamp.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Files & Paths",
      description: "The Linux filesystem hierarchy and path rules.",
      slug: "files-paths",
      icon: "FolderTree",
      units: [
        {
          title: "The Hierarchy",
          description: "Understand the standard Linux directory layout.",
          slug: "standard-layout",
          lessons: [
            {
              title: "Directory Layout",
              description: "bin, etc, var, home, and friends.",
              slug: "directory-layout",
              estimatedMinutes: 6,
              learningObjectives: [
                "Identify the purpose of key directories: /bin, /etc, /var, /home, /opt",
                "Explain the top-level 'everything is a file' philosophy",
              ],
              skills: [
                { name: "fs-hierarchy", description: "Navigate the standard Linux directory tree" },
              ],
              activities: [
                {
                  title: "How Linux is Organized",
                  body: "Everything hangs off `/`. `/bin` and `/usr/bin` hold programs. `/etc` holds configuration. `/var` holds variable data like logs and queues. `/home/name` is a user's home. `/opt` hosts optional third-party software. No C:/ or D:/ — one tree.",
                },
                {
                  title: "Why It Matters",
                  body: "Configuration in `/etc`, logs in `/var/log`, and shared libraries in `/usr/lib` are conventions every tool and every troubleshooting session relies on.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Executable programs such as ls and grep are conventionally kept in which directory?",
                  options: ["/bin", "/etc", "/var", "/tmp"],
                  correctAnswer: "/bin",
                  explanation:
                    "/bin (and /usr/bin) hold the programs you run. /etc holds configuration, /var holds variable data like logs, and /tmp is scratch space.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which directory stores system-wide configuration files?",
                  options: ["/etc", "/home", "/var", "/opt"],
                  correctAnswer: "/etc",
                  explanation:
                    "/etc is where services and the system keep their configuration, which is why configuring nginx or sshd means editing files under /etc.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Log files written by running services are typically stored under /var/log.",
                  correctAnswer: "true",
                  explanation:
                    "Logs are variable data, and the /var tree is dedicated to variable data — most notably /var/log for log files and /var/lib for databases.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: User home directories are conventionally located under ________.",
                  fillBlanks: [{ answer: "/home" }],
                  explanation:
                    "Each user gets a directory under /home (e.g. /home/adam). Only the superuser's home lives elsewhere, at /root.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each top-level directory to its purpose.",
                  matchPairs: [
                    { left: "/bin", right: "Executable programs" },
                    { left: "/etc", right: "System configuration files" },
                    { left: "/var", right: "Variable data such as logs" },
                    { left: "/opt", right: "Optional third-party software" },
                  ],
                  explanation:
                    "The Linux filesystem is a single tree from / — /bin for programs, /etc for config, /var for changing data like logs, and /opt for optional vendor software.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which command prints your current working directory?",
                  options: ["pwd", "ls", "cd", "where"],
                  correctAnswer: "pwd",
                  explanation:
                    "pwd (print working directory) echoes the absolute path of the directory you are currently in — indispensable when you are navigating a deep tree.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "A service you manage has stopped. Its log file lives in /var/log. You are at the shell prompt.",
                  parts: [
                    {
                      prompt:
                        "Type the command that lists the files in /var/log.",
                      correctAnswer: "ls /var/log",
                    },
                    {
                      prompt:
                        "Type the command that shows the last 20 lines of /var/log/syslog.",
                      correctAnswer: "tail -n 20 /var/log/syslog",
                    },
                  ],
                  explanation:
                    "The /var tree stores variable data, and logs are the classic example. ls inspects a directory and tail prints the newest lines of a file — the first move in troubleshooting.",
                },
              ],
            },
            {
              title: "Absolute vs Relative Paths",
              description: "Refer to locations unambiguously.",
              slug: "absolute-relative",
              estimatedMinutes: 5,
              learningObjectives: [
                "Distinguish absolute and relative paths",
                "Use . and .. correctly",
              ],
              skills: [
                { name: "path-resolution", description: "Resolve file locations in the tree" },
              ],
              activities: [
                {
                  title: "Two Ways to Point",
                  body: "An **absolute path** always begins at the root: `/etc/nginx/nginx.conf`. A **relative path** begins from where you are: `../conf/nginx.conf`. A single `.` means 'this directory' and `..` means 'the parent'.",
                },
                {
                  title: "Example",
                  body: "If your prompt shows `/home/adam`, then `cd ../..` lands on `/`. Both `pwd` copies prove it.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which of these is an absolute path?",
                  options: ["../config/app.yml","/etc/nginx/nginx.conf","src/main.ts","~/downloads"],
                  correctAnswer: "/etc/nginx/nginx.conf",
                  explanation: "An absolute path starts from the root directory /. Relative paths use . or .. and are resolved from the current directory.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A single dot (.) in a path refers to the current directory.",
                  correctAnswer: "true",
                  explanation: ". means the current directory and .. means the parent directory.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command changes to the parent directory?",
                  options: ["cd ..", "cd -", "cd /", "cd ~"],
                  correctAnswer: "cd ..",
                  explanation: ".. refers to the parent directory. cd .. moves one level up in the directory tree.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "You are in /home/ana/projects/web. Put these commands in the order that lands you in /home/ana.",
                  sequenceItems: [
                    { id: "cd-projects", text: "Run cd projects (from /home/ana)" },
                    { id: "cd-dotdot", text: "Run cd .. (from web)" },
                    { id: "cd-dotdot-2", text: "Run cd .. (from projects)" },
                  ],
                  sequenceCorrectOrder: ["cd-dotdot", "cd-dotdot-2", "cd-projects"],
                  explanation:
                    "Each cd .. climbs one level: first to projects, then to ana. cd projects is the relative jump from ana to projects, so it belongs in the middle.",
                  hint: "Track which directory you are in after each command.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: A path that begins with / is an ________ path.",
                  fillBlanks: [{ answer: "absolute" }],
                  explanation:
                    "An absolute path always starts at the root directory (/), so it names one exact location no matter where you are.",
                },
              ],
            },
          ],
        },
        {
          title: "Path Tools",
          description: "Work efficiently with path utilities.",
          slug: "path-tools",
          lessons: [
            {
              title: "Wildcards and Globbing",
              description: "Expand filename patterns with * and ?.",
              slug: "wildcards",
              estimatedMinutes: 5,
              learningObjectives: [
                "Use * to match multiple characters",
                "Use ? to match a single character",
                "Use square brackets for character classes",
              ],
              skills: [
                { name: "globbing", description: "Match files with shell wildcards" },
              ],
              activities: [
                {
                  title: "Globbing",
                  body: "`rm *.log` removes all files ending in `.log`. `?` matches exactly one character, and `[abc]` matches a set. The shell expands patterns *before* the command sees them.",
                },
                {
                  title: "Example",
                  body: "`ls file[1-3].txt` lists `file1.txt`, `file2.txt`, and `file3.txt` if they exist.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does the * wildcard match in a shell glob pattern?",
                  options: ["Exactly one character","Any number of characters","Only directories","Only hidden files"],
                  correctAnswer: "Any number of characters",
                  explanation: "The asterisk * matches zero or more characters.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command removes all .tmp files in the current directory?",
                  options: ["rm *.tmp", "del *.tmp", "remove *.tmp", "erase *.tmp"],
                  correctAnswer: "rm *.tmp",
                  explanation: "The shell expands *.tmp to all matching filenames before passing them to rm.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "The shell expands wildcard patterns before the command sees them.",
                  correctAnswer: "true",
explanation: "Glob expansion happens in the shell before the command runs.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question:
                    "Match each glob pattern with the filenames it matches.",
                  matchPairs: [
                    { left: "*.log", right: "app.log and error.log" },
                    { left: "file?.txt", right: "file1.txt but not file12.txt" },
                    { left: "file[12].txt", right: "file1.txt and file2.txt only" },
                  ],
                  explanation:
                    "* matches any run of characters, ? matches exactly one character, and [12] matches a single character from the set — so file?.txt misses file12.txt.",
                  hint: "Compare how many characters ? and [12] each cover.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: The shell glob character that matches exactly one character is ________.",
                  fillBlanks: [{ answer: "?" }],
                  explanation:
                    "? matches exactly one character, * matches any number of characters, and [abc] matches a single character from the set.",
                  hint: "It is a single punctuation mark, not the asterisk.",
                },
              ],
            },
            {
              title: "find and locate",
              description: "Find files by name, size, or time.",
              slug: "find-locate",
              estimatedMinutes: 6,
              learningObjectives: [
                "Search by name with find",
                "Filter by type and size",
                "Execute commands on found files",
              ],
              skills: [
                { name: "find", description: "Locate files anywhere in the tree" },
              ],
              activities: [
                {
                  title: "The Finder",
                  body: "`find /var -name '*.log'` searches the tree. Common filters: `-type d` directories, `-size +10M` big files, `-mtime -1` modified in the last day. Append `-delete` carefully, or `-exec cmd {} \\;` to act on results.",
                },
                {
                  title: "Example",
                  body: "`find . -name '*.tmp' -delete` removes every temporary file under the current directory.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command recursively finds all .log files under /var?",
                  options: ["find /var -name '*.log'","ls /var/*.log","grep /var .log","locate /var .log"],
                  correctAnswer: "find /var -name '*.log'",
                  explanation: "find traverses the directory tree. ls does not recurse and grep searches file contents.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command finds all files larger than 100MB in the current directory?",
                  options: ["find . -size +100M", "find . -size -100M", "ls -size +100M", "grep -size 100M"],
                  correctAnswer: "find . -size +100M",
                  explanation: "find . searches the current directory, -size +100M filters for large files.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "The find command searches file contents for matching text.",
                  correctAnswer: "false",
explanation: "find searches by filename, size, time. grep searches file contents.",
                },
                {
                  type: "code_completion",
                  difficulty: "intermediate",
                  question:
                    "Complete the GNU find one-liner that searches /var/log for files ending in .log that were modified less than 7 days ago.",
                  codeLanguage: "bash",
                  codeBlanks: [
                    { id: "mtime-flag", answer: "-mtime -7", placeholder: "<time filter>" },
                  ],
                  explanation:
                    "find /var/log starts the search, -name filters by filename, and -mtime -7 keeps only files modified within the last 7 days (minus means 'less than').",
                  hint: "The time filter uses mtime plus a minus sign and the number of days.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "You want to delete every .tmp file under /var. Put the parts of the find command in the order find evaluates them.",
                  sequenceItems: [
                    { id: "delete-flag", text: "-delete removes each match" },
                    { id: "name-filter", text: "-name \"*.tmp\" filters by name" },
                    { id: "search-root", text: "find /var starts the search" },
                  ],
                  sequenceCorrectOrder: ["search-root", "name-filter", "delete-flag"],
                  explanation:
                    "find evaluates predicates left to right: start at /var, keep only names matching *.tmp, and then -delete acts on the survivors — exactly the order shown.",
                  hint: "Read the command as words on one line, left to right.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Permissions",
      description: "Users, groups, and file access control.",
      slug: "permissions",
      icon: "Shield",
      units: [
        {
          title: "Reading Permissions",
          description: "Decode the permission string.",
          slug: "reading-permissions",
          lessons: [
            {
              title: "rwx Explained",
              description: "Read, write, and execute — the basics.",
              slug: "rwx-explained",
              estimatedMinutes: 6,
              learningObjectives: [
                "Read an ls -l permission string",
                "Explain owner, group, and others",
                "Interpret the execute bit on files and directories",
              ],
              skills: [
                { name: "permission-reading", description: "Decode Linux permission strings" },
              ],
              activities: [
                {
                  title: "The Ten Characters",
                  body: "`ls -l` shows `-rwxr-xr--`. The first character is the type (`-` file, `d` directory, `l` symlink). The next nine are three triples: owner, group, others, each `r`, `w`, `x`. On directories `x` means 'may enter' — without it, `cd` fails.",
                },
                {
                  title: "Example",
                  body: "`-rwxr-xr--` means the owner can read/write/execute, the group can read/execute, and others can only read.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "In -rwxr-xr--, what does the first character indicate?",
                  options: ["A directory","A regular file","A symlink","A device file"],
                  correctAnswer: "A regular file",
                  explanation: "- is a regular file, d is a directory, l is a symlink.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "On a directory, the execute bit means you can enter it.",
                  correctAnswer: "true",
                  explanation: "Execute permission on directories allows cd into them.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows permissions of all files in long format?",
                  options: ["ls -l", "ls -a", "ls -ld", "ls -la"],
                  correctAnswer: "ls -l",
                  explanation: "ls -l displays permissions, owner, group, size, and date.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question:
                    "Match each permission triple with what it grants.",
                  matchPairs: [
                    { left: "rwx", right: "Read, write, and execute" },
                    { left: "r-x", right: "Read and execute only" },
                    { left: "r--", right: "Read only" },
                    { left: "--x", right: "Execute only" },
                  ],
                  explanation:
                    "Each triple lists read, write, and execute in that fixed order, so r-x means the write bit is off while read and execute are on.",
                  hint: "The order is always read, write, execute.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "Which of the following are true about the execute (x) bit on a directory?",
                  multiSelectOptions: [
                    { text: "Without it, cd into the directory fails.", isCorrect: true },
                    { text: "It grants the ability to enter and traverse the directory.", isCorrect: true },
                    { text: "It is irrelevant to directories — it only matters for files.", isCorrect: false },
                    { text: "It replaces the read bit for directories.", isCorrect: false },
                  ],
                  explanation:
                    "On directories, x means 'may enter': cd and traversal need it, and without it even listing entries fails. It does not replace the read bit, which governs listing contents.",
                  hint: "Think of x as a ticket to walk through the door of the directory.",
                },
              ],
            },
            {
              title: "Numeric Permissions",
              description: "Map rwx to octal values like 755.",
              slug: "numeric-permissions",
              estimatedMinutes: 7,
              learningObjectives: [
                "Convert rwx bits to octal numbers",
                "Recognize common modes 644, 755, 600",
                "Explain why 777 is usually wrong",
              ],
              skills: [
                { name: "octal-permissions", description: "Express permissions numerically" },
              ],
              activities: [
                {
                  title: "Octal Arithmetic",
                  body: "Read=4, write=2, execute=1. Sum per triple: `rwx` is 7, `r-x` is 5, `r--` is 4. So `755` = owner can do everything, group and others read/execute. `644` = files you edit but everyone else reads. `600` = private.",
                },
                {
                  title: "Example",
                  body: "`chmod 755 script.sh` makes a script executable by its owner and readable/executable by others — the standard for programs.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does chmod 755 set?",
                  options: ["Owner: rwx, Group: rwx, Others: rwx","Owner: rwx, Group: r-x, Others: r-x","Owner: rw-, Group: r--, Others: r--","Owner: rwx, Group: ---, Others: ---"],
                  correctAnswer: "Owner: rwx, Group: r-x, Others: r-x",
                  explanation: "7=rwx, 5=r-x. Owner full access; group and others read+execute.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command makes deploy.sh executable by its owner?",
                  options: ["chmod u+x deploy.sh", "chmod +x deploy.sh", "chmod u+r deploy.sh", "chmod a+x deploy.sh"],
                  correctAnswer: "chmod u+x deploy.sh",
                  explanation: "u+x adds execute for the user (owner).",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Mode 644 means owner can read+write, others can only read.",
correctAnswer: "true",
                  explanation: "6=rw-, 4=r--. Standard for regular files.",
                },
                {
                  type: "multi_select",
                  difficulty: "beginner",
                  question:
                    "Which of these octal conversions are correct?",
                  multiSelectOptions: [
                    { text: "rwx converts to 7.", isCorrect: true },
                    { text: "r-x converts to 5.", isCorrect: true },
                    { text: "rw- converts to 6.", isCorrect: true },
                    { text: "r-- converts to 7.", isCorrect: false },
                  ],
                  explanation:
                    "Read=4, write=2, execute=1, and you sum the bits in the triple: rwx is 4+2+1=7, r-x is 4+0+1=5, rw- is 4+2+0=6, and r-- is 4.",
                  hint: "Add 4 (read), 2 (write), and 1 (execute) only where the letter is present.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each octal mode with the access it grants (owner / group / others).",
                  matchPairs: [
                    { left: "755", right: "Owner rwx, group and others r-x" },
                    { left: "644", right: "Owner rw-, group and others r--" },
                    { left: "700", right: "Owner rwx, group and others no access" },
                    { left: "600", right: "Owner rw-, group and others no access" },
                  ],
                  explanation:
                    "7 means rwx, 6 means rw-, 5 means r-x, and 4 means r--. So 755 is full control for the owner with read/execute for everyone else, 644 is the standard readable config, and 700/600 leave the group and others with nothing.",
                },
              ],
            },
          ],
        },
        {
          title: "Changing Permissions",
          description: "chmod, chown, and chgrp in practice.",
          slug: "changing-permissions",
          lessons: [
            {
              title: "chmod and chown",
              description: "Change ownership and modes safely.",
              slug: "chmod-chown",
              estimatedMinutes: 7,
              learningObjectives: [
                "Change modes with symbolic and numeric chmod",
                "Change owner with chown",
                "Avoid weakening permissions unintentionally",
              ],
              skills: [
                { name: "chmod-chown", description: "Adjust modes and ownership" },
              ],
              activities: [
                {
                  title: "Change It",
                  body: "`chmod u+x script.sh` adds execute for the user. `chmod g-w file` removes group write. `chown adam:web /var/www` changes owner and group. Only root can take ownership of another user's file.",
                },
                {
                  title: "Common Mistake",
                  body: "Loosening a service's directory to `777` often masks a misconfiguration and invites trouble — prefer the least privilege that works.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which flag adds execute for the user with chmod?",
                  options: ["u+x","g+w","o-r","a+x"],
                  correctAnswer: "u+x",
                  explanation: "u+x adds execute for the owner.",
                },
{
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command changes the owner of /var/www to deploy?",
                  options: ["chown deploy /var/www", "chmod deploy /var/www", "chgrp deploy /var/www", "chown -R deploy /var/www"],
                  correctAnswer: "chown deploy /var/www",
                  explanation: "chown changes file ownership. Only root can change other users' files.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Setting a directory to 777 is safe in production.",
correctAnswer: "false",
                  explanation: "777 gives everyone full access. Use least privilege.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "You own a web directory that is currently owned by root and left too open. Arrange these steps in the order that takes ownership and tightens access.",
                  sequenceItems: [
                    { id: "chmod-dir", text: "Run sudo chmod 750 /var/www to remove permissive access" },
                    { id: "chown-dir", text: "Run sudo chown -R $USER /var/www to take ownership" },
                    { id: "verify-dir", text: "Run ls -ld /var/www to confirm the new mode and owner" },
                  ],
                  sequenceCorrectOrder: ["chown-dir", "chmod-dir", "verify-dir"],
                  explanation:
                    "First chown so you control the files, then chmod 750 to grant owner full access with least privilege for everyone else, and finally ls -ld to verify owner and mode.",
                  hint: "You must own the directory before your chmod is the one that sticks.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each command with the change it makes.",
                  matchPairs: [
                    { left: "chmod u+x script.sh", right: "Add execute permission for the owner" },
                    { left: "chmod g-w config.txt", right: "Remove write permission from the group" },
                    { left: "chown adam:web /var/www", right: "Set owner to adam and group to web" },
                    { left: "chown -R $USER /var/data", right: "Take ownership of a directory recursively" },
                  ],
                  explanation:
                    "chmod u+x grants execute to the owner, g-w strips group write, chown user:group changes owner and group at once, and chown -R applies the ownership change to a directory and everything beneath it.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Processes",
      description: "Run, inspect, and control running programs.",
      slug: "processes",
      icon: "Activity",
      units: [
        {
          title: "Inspecting Processes",
          description: "See what your machine is running.",
          slug: "inspecting",
          lessons: [
            {
              title: "ps and top",
              description: "List and monitor processes.",
              slug: "ps-top",
              estimatedMinutes: 6,
              learningObjectives: [
                "List processes with ps",
                "Monitor live usage with top",
                "Identify a process by PID",
              ],
              skills: [
                { name: "process-inspection", description: "List and monitor running processes" },
              ],
              activities: [
                {
                  title: "The Process View",
                  body: "`ps aux` shows every process with user, CPU, memory, and the command. `top` (or `htop`) refreshes live. The **PID** is the number you will `kill` when things misbehave.",
                },
                {
                  title: "Example",
                  body: "`ps aux | grep nginx` narrows the list to nginx workers you are debugging.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows all processes with CPU/memory?",
                  options: ["ps aux","ls -la","df -h","du -sh"],
                  correctAnswer: "ps aux",
                  explanation: "ps aux lists all processes with detailed info.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists all processes with full details?",
                  options: ["ps aux", "ls -la", "df -h", "du -sh"],
                  correctAnswer: "ps aux",
                  explanation: "ps aux lists every running process with user, PID, and resource use.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "The PID is unique for each running process.",
correctAnswer: "true",
                  explanation: "Every process gets a unique PID.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question:
                    "Match each process tool or concept with its purpose.",
                  matchPairs: [
                    { left: "ps aux", right: "Print a snapshot of all processes" },
                    { left: "PID", right: "Unique id you pass to kill" },
                    { left: "top", right: "Live refreshing process view" },
                    { left: "ps aux | grep nginx", right: "Filter the list for nginx" },
                  ],
                  explanation:
                    "ps aux takes a snapshot, top keeps refreshing live, the PID is the number kill targets, and piping ps into grep narrows the output to one program.",
                  hint: "One pair is about the number shown in the first column of ps aux.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: In ps aux output, the ________ column holds the unique identifier you pass to kill to stop a misbehaving process.",
                  fillBlanks: [{ answer: "PID" }],
                  explanation:
                    "Every running process has a unique PID, printed in the PID column of ps aux, and that is exactly the identifier kill expects when a program misbehaves.",
                },
              ],
            },
            {
              title: "Signals and kill",
              description: "Send SIGTERM and SIGKILL.",
              slug: "signals-kill",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain SIGTERM and SIGKILL",
                "Gracefully stop processes with kill",
                "Use killall and pkill",
              ],
              skills: [
                { name: "signals", description: "Control processes by sending signals" },
              ],
              activities: [
                {
                  title: "Polite First, Fatal Last",
                  body: "`kill 1234` sends **SIGTERM** — a polite request to stop. A well-behaved app flushes and exits. `kill -9 1234` sends **SIGKILL**, which no process can ignore. Always try a graceful stop first.",
                },
                {
                  title: "Example",
                  body: "`killall nginx` sends SIGTERM to every nginx process; useful for full restarts.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What signal does kill 1234 send by default?",
                  options: ["SIGKILL","SIGTERM","SIGHUP","SIGSTOP"],
                  correctAnswer: "SIGTERM",
                  explanation: "kill sends SIGTERM (signal 15) by default for graceful shutdown.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command sends SIGKILL to process 5678?",
                  options: ["kill -9 5678", "kill -15 5678", "kill -2 5678", "killall 5678"],
                  correctAnswer: "kill -9 5678",
                  explanation: "-9 sends SIGKILL for immediate termination.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Try SIGTERM before SIGKILL to allow cleanup.",
correctAnswer: "true",
                  explanation: "SIGTERM lets the process flush buffers and close connections.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: Running kill 1234 with no flags sends the ________ signal.",
                  fillBlanks: [{ answer: "SIGTERM" }],
                  explanation:
                    "kill's default signal is SIGTERM (15), a polite request that a well-behaved process honors by cleaning up and exiting.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "Which of the following statements about signals are true?",
                  multiSelectOptions: [
                    { text: "kill -9 sends SIGKILL, which cannot be ignored.", isCorrect: true },
                    { text: "A process can catch SIGTERM and exit gracefully.", isCorrect: true },
                    { text: "SIGKILL lets a process save its state before exit.", isCorrect: false },
                    { text: "kill sends SIGKILL by default.", isCorrect: false },
                  ],
                  explanation:
                    "SIGTERM can be handled, so processes use it to flush and close cleanly; SIGKILL (kill -9) is delivered straight to the kernel and cannot be caught — always warn first.",
                  hint: "Only one of the two signals is catchable.",
                },
              ],
            },
          ],
        },
        {
          title: "Background Jobs",
          description: "Run long tasks in the background.",
          slug: "background",
          lessons: [
            {
              title: "&, jobs, and nohup",
              description: "Detach commands from the terminal.",
              slug: "background-jobs",
              estimatedMinutes: 6,
              learningObjectives: [
                "Start a command in the background with &",
                "List jobs with jobs and resume with fg",
                "Keep processes alive with nohup",
              ],
              skills: [
                { name: "background-jobs", description: "Manage detached and background commands" },
              ],
              activities: [
                {
                  title: "Let It Run",
                  body: "Trailing `&` puts a command in the background: `node server.js &`. `jobs` lists them, `fg` brings one forward. `nohup cmd &` detaches it from the terminal so it survives logout — use `nohup` for anything long.",
                },
                {
                  title: "Try it",
                  body: "Run `sleep 30 &`, then `jobs` to watch it, and `kill %1` — the percent form refers to the job number.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does trailing & do?",
                  options: ["Runs as root","Runs in background","Redirects to file","Runs in subshell"],
                  correctAnswer: "Runs in background",
                  explanation: "& puts the command in the background.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command runs sleep 60 in the background?",
                  options: ["sleep 60 &", "sleep 60", "bg sleep 60", "nohup sleep 60"],
                  correctAnswer: "sleep 60 &",
                  explanation: "& at the end runs the command in the background.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "nohup keeps a process running after terminal closes.",
correctAnswer: "true",
                  explanation: "nohup makes the process immune to SIGHUP.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "Put these steps in the order you would follow to start a server in the background, check on it, bring it back, and stop it.",
                  sequenceItems: [
                    { id: "fg-job", text: "Run fg to bring the job back to the foreground" },
                    { id: "start-bg", text: "Run node server.js & to start it in the background" },
                    { id: "list-jobs", text: "Run jobs to list the background jobs" },
                    { id: "kill-job", text: "Run kill %1 to stop the foreground job" },
                  ],
                  sequenceCorrectOrder: ["start-bg", "list-jobs", "fg-job", "kill-job"],
                  explanation:
                    "Start with & so the shell returns immediately, confirm it with jobs, resume it with fg, and finally kill %1 referencing the job number.",
                  hint: "The & symbol is the very first thing you do.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "Which of the following statements about background jobs in the shell are true?",
                  multiSelectOptions: [
                    { text: "Trailing & starts the job in the background and returns your prompt immediately.", isCorrect: true },
                    { text: "The jobs command lists the background jobs of the current shell.", isCorrect: true },
                    { text: "fg brings a background job back to the foreground.", isCorrect: true },
                    { text: "Without nohup, a background job started with & always survives logging out.", isCorrect: false },
                    { text: "kill %1 refers to a process ID (PID), not a job number.", isCorrect: false },
                  ],
                  explanation:
                    "A trailing & runs the job in the background and hands the prompt straight back, jobs lists those jobs, and fg pulls one forward. Plain &-jobs stay tied to the shell and are not safe across logout — that is exactly why long-running work uses nohup. And %1 in kill %1 is a job reference, not a PID.",
                  hint: "Only the detached, nohup-style jobs are truly safe from logout.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Networking",
      description: "Inspect and test network connectivity.",
      slug: "networking",
      icon: "Network",
      units: [
        {
          title: "Inspection Tools",
          description: "ip, ss, and ping.",
          slug: "inspection",
          lessons: [
            {
              title: "ip and ss",
              description: "Modern tools for interfaces and sockets.",
              slug: "ip-ss",
              estimatedMinutes: 7,
              learningObjectives: [
                "Show network interfaces with ip",
                "List listening ports with ss",
                "Find which process owns a port",
              ],
              skills: [
                { name: "ip-ss", description: "Inspect network interfaces and sockets" },
              ],
              activities: [
                {
                  title: "The Modern Tools",
                  body: "`ip addr` shows interfaces and addresses; `ip route` shows the routing table. `ss -tlnp` lists TCP listeners with the owning process (`-p`). This is the replacement for the legacy `ifconfig` and `netstat`.",
                },
                {
                  title: "Port Police",
                  body: "If a service 'will not start because the port is taken', `ss -tlnp | grep 8080` tells you exactly which PID owns it.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows network interfaces and IPs?",
                  options: ["ip addr","ls -la","ps aux","cat /etc/hosts"],
                  correctAnswer: "ip addr",
                  explanation: "ip addr shows all interfaces with IP addresses.",
                },
{
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command lists all TCP listening ports with processes?",
                  options: ["ss -tlnp", "ss -tln", "netstat -tlnp", "ss -ulnp"],
                  correctAnswer: "ss -tlnp",
                  explanation: "ss -t TCP -l listening -n numeric -p process.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "ss is the modern replacement for netstat.",
correctAnswer: "true",
                  explanation: "ss is faster and more informative than netstat.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each command with the information it reveals.",
                  matchPairs: [
                    { left: "ip addr", right: "Interfaces and their IP addresses" },
                    { left: "ip route", right: "The routing table" },
                    { left: "ss -tlnp", right: "TCP listeners and owning processes" },
                    { left: "ss -tlnp | grep 8080", right: "Which PID owns port 8080" },
                  ],
                  explanation:
                    "ip addr lists interfaces, ip route shows how packets are forwarded, and ss -tlnp reveals listening TCP sockets with the owning PID — grep narrows it to one port.",
                  hint: "Two pairs use ss, one pair uses ip.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Fill in the blank: The command ________ lists TCP listening sockets along with the process that owns them.",
                  fillBlanks: [{ answer: "ss -tlnp" }],
                  explanation:
                    "ss -tlnp shows listening (-l) TCP (-t) sockets in numeric form (-n) with the owning process (-p) — the modern netstat replacement.",
                },
              ],
            },
            {
              title: "Connectivity Tests",
              description: "ping, curl, and nc.",
              slug: "connectivity",
              estimatedMinutes: 6,
              learningObjectives: [
                "Test reachability with ping",
                "Fetch web content with curl",
                "Probe raw TCP connections with nc",
              ],
              skills: [
                { name: "connectivity", description: "Test connectivity between machines" },
              ],
              activities: [
                {
                  title: "Is It Reachable?",
                  body: "`ping host` checks ICMP reachability. `curl -I http://host` fetches headers from an HTTP service. `nc -vz host port` opens a raw TCP connection — the definitive test when firewalls might filter ICMP.",
                },
                {
                  title: "Example",
                  body: "`curl -s http://localhost:3000/api/health` returns the body; a non-zero exit means the server is not answering.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command tests reachability using ICMP?",
                  options: ["curl","ping","ssh","wget"],
                  correctAnswer: "ping",
                  explanation: "ping sends ICMP echo requests.",
                },
{
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command fetches HTTP headers from example.com?",
                  options: ["curl -I example.com", "curl example.com", "wget -I example.com", "curl -i example.com"],
                  correctAnswer: "curl -I example.com",
                  explanation: "curl -I sends a HEAD request for headers only.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "nc can test whether a TCP port is open.",
correctAnswer: "true",
                  explanation: "nc -vz host port tests TCP connectivity.",
                },
                {
                  type: "code_completion",
                  difficulty: "intermediate",
                  question:
                    "Complete the one-liner that fetches the body of a health endpoint with output silenced so only the payload is shown.",
                  codeLanguage: "bash",
                  codeBlanks: [
                    { id: "curl-cmd", answer: "curl -s http://localhost:3000/api/health", placeholder: "<command>" },
                  ],
                  explanation:
                    "curl -s fetches quietly (no progress meter) and prints the response body; a non-zero exit when the port is closed is how scripts detect a down service.",
                  hint: "Start with curl, add -s, then the URL.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Fill in the blank: The tool ________ opens a raw TCP connection and can report whether a port is open with -vz.",
                  fillBlanks: [{ answer: "nc" }],
                  explanation:
                    "nc (netcat) with -vz host port performs a verbose zero-I/O connection test — the definitive probe when ICMP is filtered.",
                },
              ],
            },
          ],
        },
        {
          title: "Troubleshooting",
          description: "dns resolution and common issues.",
          slug: "troubleshooting",
          lessons: [
            {
              title: "Name Resolution",
              description: "nslookup, dig, and getent.",
              slug: "dns",
              estimatedMinutes: 6,
              learningObjectives: [
                "Query DNS with dig",
                "Test resolution through system config with getent",
                "Explain how /etc/hosts and /etc/resolv.conf work",
              ],
              skills: [
                { name: "dns", description: "Diagnose name resolution problems" },
              ],
              activities: [
                {
                  title: "The DNS Toolkit",
                  body: "`dig example.com` asks DNS directly and shows every record. `getent hosts example.com` resolves using the same path applications use (including `/etc/hosts`). When an app 'cannot resolve', compare the two — the answer often lies in `/etc/resolv.conf`.",
                },
                {
                  title: "Check /etc/hosts",
                  body: "A forgotten entry in `/etc/hosts` overrides DNS and produces baffling, environment-specific behavior.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command queries DNS records?",
                  options: ["dig example.com","ping example.com","ls example.com","cat example.com"],
                  correctAnswer: "dig example.com",
                  explanation: "dig queries DNS servers for record information.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "/etc/hosts entries override DNS resolution.",
                  correctAnswer: "true",
                  explanation: "The system checks /etc/hosts before DNS.",
                },
{
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command resolves example.com via system resolution?",
                  options: ["getent hosts example.com", "dig example.com", "nslookup example.com", "host example.com"],
                  correctAnswer: "getent hosts example.com",
                  explanation: "getent hosts uses the same path as applications.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "Which of the following statements about name resolution are true?",
                  multiSelectOptions: [
                    { text: "dig queries DNS directly and can show every record type.", isCorrect: true },
                    { text: "getent hosts resolves through the same path applications use, including /etc/hosts.", isCorrect: true },
                    { text: "Entries in /etc/hosts are ignored whenever DNS is configured.", isCorrect: false },
                    { text: "dig always consults /etc/hosts before a DNS server.", isCorrect: false },
                  ],
                  explanation:
                    "dig talks straight to DNS, while getent mirrors how applications resolve and therefore honours /etc/hosts. Comparing the two is how you spot a stray hosts entry.",
                  hint: "One of the checked tools reads /etc/hosts, the other does not.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each name-resolution tool or file with what it does.",
                  matchPairs: [
                    { left: "dig example.com", right: "Query a DNS server directly for records" },
                    { left: "getent hosts example.com", right: "Resolve through the same path applications use, including /etc/hosts" },
                    { left: "/etc/hosts", right: "Local static name mappings that override DNS" },
                    { left: "/etc/resolv.conf", right: "Configure which DNS servers to consult" },
                  ],
                  explanation:
                    "dig bypasses the system and asks DNS directly, getent hosts follows the full system resolution order, /etc/hosts holds local overrides, and /etc/resolv.conf tells the resolver which nameservers to use.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};