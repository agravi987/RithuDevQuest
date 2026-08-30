import { readFileSync, writeFileSync } from "fs";

// Questions to add per lesson slug (same as before)
const questionData = {
  // LINUX: Files & Paths
  "absolute-relative": [
    { type: "mcq", difficulty: "beginner", question: "Which of these is an absolute path?", options: ["../config/app.yml", "/etc/nginx/nginx.conf", "src/main.ts", "~/downloads"], correctAnswer: "/etc/nginx/nginx.conf", explanation: "An absolute path starts from the root directory /. Relative paths use . or .. and are resolved from the current directory." },
    { type: "true_false", difficulty: "beginner", question: "A single dot (.) in a path refers to the current directory.", correctAnswer: "true", explanation: ". means the current directory and .. means the parent directory." },
    { type: "command", difficulty: "beginner", question: "Type the command that changes to the parent directory.", correctAnswer: "cd ..", explanation: ".. refers to the parent directory. cd .. moves one level up in the directory tree." },
  ],
  wildcards: [
    { type: "mcq", difficulty: "beginner", question: "What does the * wildcard match in a shell glob pattern?", options: ["Exactly one character", "Any number of characters", "Only directories", "Only hidden files"], correctAnswer: "Any number of characters", explanation: "The asterisk * matches zero or more characters." },
    { type: "command", difficulty: "beginner", question: "Type the command that removes all .tmp files in the current directory.", correctAnswer: "rm *.tmp", explanation: "The shell expands *.tmp to all matching filenames before passing them to rm." },
    { type: "true_false", difficulty: "beginner", question: "The shell expands wildcard patterns before the command sees them.", correctAnswer: "true", explanation: "Glob expansion happens in the shell before the command runs." },
  ],
  "find-locate": [
    { type: "mcq", difficulty: "beginner", question: "Which command recursively finds all .log files under /var?", options: ["find /var -name '*.log'", "ls /var/*.log", "grep /var .log", "locate /var .log"], correctAnswer: "find /var -name '*.log'", explanation: "find traverses the directory tree. ls does not recurse and grep searches file contents." },
    { type: "command", difficulty: "intermediate", question: "Type the command that finds all files larger than 100MB in the current directory.", correctAnswer: "find . -size +100M", explanation: "find . searches the current directory, -size +100M filters for large files." },
    { type: "true_false", difficulty: "beginner", question: "The find command searches file contents for matching text.", correctAnswer: "false", explanation: "find searches by filename, size, time. grep searches file contents." },
  ],
  // LINUX: Permissions
  "rwx-explained": [
    { type: "mcq", difficulty: "beginner", question: "In -rwxr-xr--, what does the first character indicate?", options: ["A directory", "A regular file", "A symlink", "A device file"], correctAnswer: "A regular file", explanation: "- is a regular file, d is a directory, l is a symlink." },
    { type: "true_false", difficulty: "beginner", question: "On a directory, the execute bit means you can enter it.", correctAnswer: "true", explanation: "Execute permission on directories allows cd into them." },
    { type: "command", difficulty: "beginner", question: "Type the command that shows permissions of all files in long format.", correctAnswer: "ls -l", explanation: "ls -l displays permissions, owner, group, size, and date." },
  ],
  "numeric-permissions": [
    { type: "mcq", difficulty: "beginner", question: "What does chmod 755 set?", options: ["Owner: rwx, Group: rwx, Others: rwx", "Owner: rwx, Group: r-x, Others: r-x", "Owner: rw-, Group: r--, Others: r--", "Owner: rwx, Group: ---, Others: ---"], correctAnswer: "Owner: rwx, Group: r-x, Others: r-x", explanation: "7=rwx, 5=r-x. Owner full access; group and others read+execute." },
    { type: "command", difficulty: "beginner", question: "Type the command that makes deploy.sh executable by its owner.", correctAnswer: "chmod u+x deploy.sh", explanation: "u+x adds execute for the user (owner)." },
    { type: "true_false", difficulty: "beginner", question: "Mode 644 means owner can read+write, others can only read.", correctAnswer: "true", explanation: "6=rw-, 4=r--. Standard for regular files." },
  ],
  "chmod-chown": [
    { type: "mcq", difficulty: "beginner", question: "Which flag adds execute for the user with chmod?", options: ["u+x", "g+w", "o-r", "a+x"], correctAnswer: "u+x", explanation: "u+x adds execute for the owner." },
    { type: "command", difficulty: "intermediate", question: "Type the command that changes the owner of /var/www to deploy.", correctAnswer: "chown deploy /var/www", explanation: "chown changes file ownership. Only root can change other users' files." },
    { type: "true_false", difficulty: "intermediate", question: "Setting a directory to 777 is safe in production.", correctAnswer: "false", explanation: "777 gives everyone full access. Use least privilege." },
  ],
  // LINUX: Processes
  "ps-top": [
    { type: "mcq", difficulty: "beginner", question: "Which command shows all processes with CPU/memory?", options: ["ps aux", "ls -la", "df -h", "du -sh"], correctAnswer: "ps aux", explanation: "ps aux lists all processes with detailed info." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists processes and filters for nginx.", correctAnswer: "ps aux | grep nginx", explanation: "ps aux + grep filters for nginx processes." },
    { type: "true_false", difficulty: "beginner", question: "The PID is unique for each running process.", correctAnswer: "true", explanation: "Every process gets a unique PID." },
  ],
  "signals-kill": [
    { type: "mcq", difficulty: "beginner", question: "What signal does kill 1234 send by default?", options: ["SIGKILL", "SIGTERM", "SIGHUP", "SIGSTOP"], correctAnswer: "SIGTERM", explanation: "kill sends SIGTERM (signal 15) by default for graceful shutdown." },
    { type: "command", difficulty: "beginner", question: "Type the command that sends SIGKILL to process 5678.", correctAnswer: "kill -9 5678", explanation: "-9 sends SIGKILL for immediate termination." },
    { type: "true_false", difficulty: "intermediate", question: "Try SIGTERM before SIGKILL to allow cleanup.", correctAnswer: "true", explanation: "SIGTERM lets the process flush buffers and close connections." },
  ],
  "background-jobs": [
    { type: "mcq", difficulty: "beginner", question: "What does trailing & do?", options: ["Runs as root", "Runs in background", "Redirects to file", "Runs in subshell"], correctAnswer: "Runs in background", explanation: "& puts the command in the background." },
    { type: "command", difficulty: "beginner", question: "Type the command that runs sleep 60 in the background.", correctAnswer: "sleep 60 &", explanation: "& at the end runs the command in the background." },
    { type: "true_false", difficulty: "intermediate", question: "nohup keeps a process running after terminal closes.", correctAnswer: "true", explanation: "nohup makes the process immune to SIGHUP." },
  ],
  // LINUX: Networking
  "ip-ss": [
    { type: "mcq", difficulty: "beginner", question: "Which command shows network interfaces and IPs?", options: ["ip addr", "ls -la", "ps aux", "cat /etc/hosts"], correctAnswer: "ip addr", explanation: "ip addr shows all interfaces with IP addresses." },
    { type: "command", difficulty: "intermediate", question: "Type the command that lists all TCP listening ports with processes.", correctAnswer: "ss -tlnp", explanation: "ss -t TCP -l listening -n numeric -p process." },
    { type: "true_false", difficulty: "beginner", question: "ss is the modern replacement for netstat.", correctAnswer: "true", explanation: "ss is faster and more informative than netstat." },
  ],
  connectivity: [
    { type: "mcq", difficulty: "beginner", question: "Which command tests reachability using ICMP?", options: ["curl", "ping", "ssh", "wget"], correctAnswer: "ping", explanation: "ping sends ICMP echo requests." },
    { type: "command", difficulty: "beginner", question: "Type the command that fetches HTTP headers from example.com.", correctAnswer: "curl -I example.com", explanation: "curl -I sends a HEAD request for headers only." },
    { type: "true_false", difficulty: "intermediate", question: "nc can test whether a TCP port is open.", correctAnswer: "true", explanation: "nc -vz host port tests TCP connectivity." },
  ],
  dns: [
    { type: "mcq", difficulty: "beginner", question: "Which command queries DNS records?", options: ["dig example.com", "ping example.com", "ls example.com", "cat example.com"], correctAnswer: "dig example.com", explanation: "dig queries DNS servers for record information." },
    { type: "true_false", difficulty: "beginner", question: "/etc/hosts entries override DNS resolution.", correctAnswer: "true", explanation: "The system checks /etc/hosts before DNS." },
    { type: "command", difficulty: "intermediate", question: "Type the command that resolves example.com via system resolution.", correctAnswer: "getent hosts example.com", explanation: "getent hosts uses the same path as applications." },
  ],

  // GIT: All lessons (no questions yet)
  "what-is-version-control": [
    { type: "mcq", difficulty: "beginner", question: "What does Git's snapshot model capture?", options: ["Only changed files", "The entire project state", "A diff of changes", "Just metadata"], correctAnswer: "The entire project state", explanation: "Each commit captures the entire project state." },
    { type: "true_false", difficulty: "beginner", question: "Version control allows comparing, reverting, and merging changes.", correctAnswer: "true", explanation: "That is the core purpose of version control." },
    { type: "command", difficulty: "beginner", question: "Type the command that initializes a new Git repository.", correctAnswer: "git init", explanation: "git init creates the .git directory." },
  ],
  "three-states": [
    { type: "mcq", difficulty: "beginner", question: "Which command moves changes into the staging area?", options: ["git commit", "git add", "git push", "git stash"], correctAnswer: "git add", explanation: "git add stages changes for the next commit." },
    { type: "command", difficulty: "beginner", question: "Type the command that shows file states.", correctAnswer: "git status", explanation: "git status shows modified, staged, and untracked files." },
    { type: "true_false", difficulty: "beginner", question: "The staging area is between the working directory and the repository.", correctAnswer: "true", explanation: "git add stages, git commit records the staged snapshot." },
  ],
  "init-first-commit": [
    { type: "mcq", difficulty: "beginner", question: "What does git init create?", options: ["A remote repo", "A .git directory", "A README", "A .gitignore"], correctAnswer: "A .git directory", explanation: "git init creates the .git directory with all version control metadata." },
    { type: "command", difficulty: "beginner", question: "Type the command that stages all changes and commits them.", correctAnswer: "git add . && git commit -m 'Initial commit'", explanation: "git add . stages all files, git commit records them." },
    { type: "true_false", difficulty: "intermediate", question: "Commit messages should use imperative style.", correctAnswer: "true", explanation: "'Add feature' reads as an instruction, not a description." },
  ],
  "diff-log": [
    { type: "mcq", difficulty: "beginner", question: "Which command shows commit history?", options: ["git diff", "git log", "git status", "git show"], correctAnswer: "git log", explanation: "git log displays the commit history." },
    { type: "command", difficulty: "beginner", question: "Type the command that shows compact graphical history.", correctAnswer: "git log --oneline --graph --all", explanation: "--oneline compresses, --graph draws topology, --all includes all branches." },
    { type: "true_false", difficulty: "beginner", question: "git diff shows unstaged changes.", correctAnswer: "true", explanation: "git diff compares working directory to staging area." },
  ],
  "create-switch": [
    { type: "mcq", difficulty: "beginner", question: "What is a Git branch?", options: ["A copy of the repo", "A movable pointer to a commit", "A backup", "A tag"], correctAnswer: "A movable pointer to a commit", explanation: "A branch is a label pointing to a commit." },
    { type: "command", difficulty: "beginner", question: "Type the command that creates and switches to branch feature.", correctAnswer: "git switch -c feature|git checkout -b feature", explanation: "git switch -c creates and switches in one step." },
    { type: "true_false", difficulty: "beginner", question: "HEAD points to the current branch.", correctAnswer: "true", explanation: "HEAD follows the branch you are on." },
  ],
  "status-stash": [
    { type: "mcq", difficulty: "beginner", question: "What does git stash do?", options: ["Deletes changes", "Temporarily shelves changes", "Creates a branch", "Pushes changes"], correctAnswer: "Temporarily shelves changes", explanation: "git stash saves changes to a stack for later reapplication." },
    { type: "command", difficulty: "beginner", question: "Type the command that temporarily shelves your changes.", correctAnswer: "git stash", explanation: "git stash saves uncommitted changes." },
    { type: "true_false", difficulty: "intermediate", question: "git stash pop applies stashed changes and removes them from the stash.", correctAnswer: "true", explanation: "stash pop applies and drops. stash apply keeps them." },
  ],
  "git-reset": [
    { type: "mcq", difficulty: "intermediate", question: "What does git reset --soft do?", options: ["Discards all changes", "Moves branch pointer only", "Unstages changes", "Deletes last commit"], correctAnswer: "Moves branch pointer only", explanation: "--soft moves the pointer without changing staging or working directory." },
    { type: "command", difficulty: "beginner", question: "Type the command that unstages app.js.", correctAnswer: "git restore --staged app.js", explanation: "git restore --staged removes from staging, keeping changes." },
    { type: "true_false", difficulty: "intermediate", question: "git reset --hard discards all uncommitted changes.", correctAnswer: "true", explanation: "--hard resets staging AND working directory irreversibly." },
  ],
  "git-merge": [
    { type: "mcq", difficulty: "beginner", question: "What is a fast-forward merge?", options: ["Creates new commit", "Just moves the pointer", "Rebases commits", "Deletes branch"], correctAnswer: "Just moves the pointer", explanation: "When target hasn't diverged, Git moves the pointer forward." },
    { type: "command", difficulty: "beginner", question: "Type the command that merges feature into main.", correctAnswer: "git switch main && git merge feature", explanation: "Switch to target, then merge the source." },
    { type: "true_false", difficulty: "intermediate", question: "Merge conflicts happen when both branches changed the same lines.", correctAnswer: "true", explanation: "Git cannot auto-decide, so it marks conflicts for manual resolution." },
  ],
  "resolving-conflicts": [
    { type: "mcq", difficulty: "intermediate", question: "What does ======= separate in a conflict?", options: ["File name and content", "Your changes and theirs", "Commit message and diff", "Old and new version"], correctAnswer: "Your changes and theirs", explanation: "<<<<<<< HEAD is yours, ======= divides, >>>>>>> theirs is the other." },
    { type: "command", difficulty: "intermediate", question: "After resolving a conflict in app.js, type the command to mark it resolved.", correctAnswer: "git add app.js", explanation: "git add tells Git the conflict is resolved." },
    { type: "true_false", difficulty: "intermediate", question: "Conflicts are a failure to be avoided.", correctAnswer: "false", explanation: "Conflicts are normal — Git refuses to guess about your work." },
  ],
  "clone-push": [
    { type: "mcq", difficulty: "beginner", question: "What does git clone do?", options: ["Creates a repo", "Downloads a remote copy", "Pushes changes", "Merges repos"], correctAnswer: "Downloads a remote copy", explanation: "git clone copies the remote repo locally with all history." },
    { type: "command", difficulty: "beginner", question: "Type the command that pushes main to origin.", correctAnswer: "git push origin main", explanation: "git push uploads local commits to the remote." },
    { type: "true_false", difficulty: "beginner", question: "git remote -v shows configured remotes.", correctAnswer: "true", explanation: "git remote -v lists remote names with their URLs." },
  ],
  "fetch-pull": [
    { type: "mcq", difficulty: "beginner", question: "What is the difference between fetch and pull?", options: ["Identical", "fetch downloads without merging, pull downloads and merges", "fetch for branches, pull for tags", "fetch local, pull network"], correctAnswer: "fetch downloads without merging, pull downloads and merges", explanation: "fetch updates remote-tracking branches. pull = fetch + merge." },
    { type: "command", difficulty: "beginner", question: "Type the command that pulls with rebase from origin main.", correctAnswer: "git pull --rebase origin main", explanation: "--rebase replays local commits on top of fetched work." },
    { type: "true_false", difficulty: "intermediate", question: "fetch is safer than pull because it does not modify your working directory.", correctAnswer: "true", explanation: "fetch only updates remote-tracking refs." },
  ],
  "fork-branch-pr": [
    { type: "mcq", difficulty: "intermediate", question: "What keeps your fork in sync with upstream?", options: ["git push", "git remote add upstream + pull", "git merge", "git rebase"], correctAnswer: "git remote add upstream + pull", explanation: "Adding upstream and pulling keeps your fork current." },
    { type: "true_false", difficulty: "beginner", question: "A Pull Request proposes merging your branch for review.", correctAnswer: "true", explanation: "PRs are the standard way to propose changes." },
    { type: "command", difficulty: "intermediate", question: "Type the command that adds the original repo as upstream.", correctAnswer: "git remote add upstream <url>", explanation: "git remote add creates a new remote reference." },
  ],
  "conventional-commits": [
    { type: "mcq", difficulty: "beginner", question: "Which prefix indicates a new feature?", options: ["fix:", "feat:", "docs:", "chore:"], correctAnswer: "feat:", explanation: "feat: signals a new feature." },
    { type: "true_false", difficulty: "beginner", question: "Conventional commits power automated changelogs.", correctAnswer: "true", explanation: "Tools parse prefixes to generate changelogs and version bumps." },
    { type: "command", difficulty: "beginner", question: "Type a conventional commit that adds login to auth.", correctAnswer: "feat(auth): add login|feat: add login", explanation: "type(scope): description is the format." },
  ],
  "branch-protection": [
    { type: "mcq", difficulty: "intermediate", question: "What do branch protection rules require?", options: ["Direct pushes", "Reviews and passing CI", "One approval", "Nothing"], correctAnswer: "Reviews and passing CI", explanation: "Protected branches require reviews and passing status checks." },
    { type: "true_false", difficulty: "beginner", question: "Protected branches cannot receive direct pushes.", correctAnswer: "true", explanation: "Changes must flow through pull requests." },
    { type: "command", difficulty: "intermediate", question: "Type the command that checks if your branch is behind main.", correctAnswer: "git fetch origin && git log HEAD..origin/main --oneline", explanation: "Fetching updates refs, then the log shows missing commits." },
  ],
  "git-revert": [
    { type: "mcq", difficulty: "beginner", question: "What does git revert do differently from reset?", options: ["Deletes commit", "Creates new commit that undoes old one", "Modifies in place", "Pushes immediately"], correctAnswer: "Creates new commit that undoes old one", explanation: "revert is safe for shared history — it adds rather than rewrites." },
    { type: "command", difficulty: "beginner", question: "Type the command that undoes the latest commit.", correctAnswer: "git revert HEAD", explanation: "git revert HEAD creates a new commit inversing HEAD." },
    { type: "true_false", difficulty: "intermediate", question: "revert is safe on pushed commits.", correctAnswer: "true", explanation: "Unlike reset, revert does not rewrite history." },
  ],

  // DOCKER: All lessons
  "what-is-a-container": [
    { type: "mcq", difficulty: "beginner", question: "How does a container differ from a VM?", options: ["Containers virtualize hardware", "Containers share host kernel, VMs run full OS", "Identical", "VMs are lighter"], correctAnswer: "Containers share host kernel, VMs run full OS", explanation: "Containers use namespaces and cgroups while sharing the kernel." },
    { type: "true_false", difficulty: "beginner", question: "Containers use Linux namespaces and cgroups for isolation.", correctAnswer: "true", explanation: "Namespaces isolate processes, cgroups limit resources." },
    { type: "command", difficulty: "beginner", question: "Type the command that runs the hello-world container.", correctAnswer: "docker run hello-world", explanation: "docker run pulls and executes the image." },
  ],
  "images-vs-containers": [
    { type: "mcq", difficulty: "beginner", question: "What is a container image?", options: ["A running container", "An immutable snapshot with layers", "A Dockerfile", "A VM disk"], correctAnswer: "An immutable snapshot with layers", explanation: "An image is layers plus a command. A container is a running instance." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists all local Docker images.", correctAnswer: "docker images", explanation: "docker images shows all locally stored images." },
    { type: "true_false", difficulty: "beginner", question: "A container adds a writable layer on top of image layers.", correctAnswer: "true", explanation: "Changes go to the writable layer, not the image." },
  ],
  "docker-run": [
    { type: "mcq", difficulty: "beginner", question: "What does --rm do in docker run?", options: ["Runs as root", "Auto-deletes on exit", "Mounts volume", "Publishes port"], correctAnswer: "Auto-deletes on exit", explanation: "--rm removes the container automatically when it stops." },
    { type: "command", difficulty: "beginner", question: "Type the command that runs interactive Ubuntu with bash.", correctAnswer: "docker run -it ubuntu bash", explanation: "-i keeps stdin open, -t allocates a pseudo-TTY." },
    { type: "true_false", difficulty: "beginner", question: "docker ps -a shows both running and stopped containers.", correctAnswer: "true", explanation: "ps shows running only. -a includes stopped containers." },
  ],
  lifecycle: [
    { type: "mcq", difficulty: "beginner", question: "What signal does docker stop send by default?", options: ["SIGKILL", "SIGTERM", "SIGHUP", "SIGINT"], correctAnswer: "SIGTERM", explanation: "docker stop sends SIGTERM for graceful shutdown." },
    { type: "command", difficulty: "beginner", question: "Type the command that stops and removes container my-app.", correctAnswer: "docker stop my-app && docker rm my-app", explanation: "stop gracefully stops, rm deletes the container." },
    { type: "true_false", difficulty: "intermediate", question: "docker rmi deletes a Docker image.", correctAnswer: "true", explanation: "docker rmi removes images. docker rm removes containers." },
  ],
  "dockerfile-essentials": [
    { type: "mcq", difficulty: "beginner", question: "Which instruction sets the base image?", options: ["RUN", "FROM", "COPY", "CMD"], correctAnswer: "FROM", explanation: "FROM specifies the base image for the Dockerfile." },
    { type: "true_false", difficulty: "beginner", question: "Every RUN and COPY creates a cached layer.", correctAnswer: "true", explanation: "Each instruction creates a layer. Cached layers are reused." },
    { type: "command", difficulty: "intermediate", question: "Type the command that builds image myapp:v1.", correctAnswer: "docker build -t myapp:v1 .", explanation: "docker build uses current dir as context, -t tags the image." },
  ],
  "building-images": [
    { type: "mcq", difficulty: "beginner", question: "What is the build context?", options: ["Dockerfile location", "Files sent to Docker daemon", "Base image", "Output image"], correctAnswer: "Files sent to Docker daemon", explanation: "The build context is the directory sent to the daemon for COPY/ADD." },
    { type: "command", difficulty: "beginner", question: "Type the command that builds and tags webapp:latest.", correctAnswer: "docker build -t webapp:latest .", explanation: "-t sets the tag, . is the build context." },
    { type: "true_false", difficulty: "intermediate", question: ".dockerignore excludes files from the build context.", correctAnswer: "true", explanation: ".dockerignore works like .gitignore for the build context." },
  ],
  "push-pull": [
    { type: "mcq", difficulty: "beginner", question: "What is a Docker image digest?", options: ["Human-readable name", "Content-addressable sha256 hash", "Version number", "Size estimate"], correctAnswer: "Content-addressable sha256 hash", explanation: "A digest uniquely identifies image content for reproducible deploys." },
    { type: "command", difficulty: "beginner", question: "Type the command that pulls nginx:stable.", correctAnswer: "docker pull nginx:stable", explanation: "docker pull downloads the image from the registry." },
    { type: "true_false", difficulty: "beginner", question: "You must run docker login before pushing.", correctAnswer: "true", explanation: "docker login authenticates with the registry." },
  ],
  "named-volumes": [
    { type: "mcq", difficulty: "beginner", question: "Where does Docker store named volume data?", options: ["Container writable layer", "/var/lib/docker/volumes/ on host", "Image layers", "Dockerfile"], correctAnswer: "/var/lib/docker/volumes/ on host", explanation: "Named volumes are Docker-managed on the host filesystem." },
    { type: "command", difficulty: "beginner", question: "Type the command that runs postgres with named volume pgdata.", correctAnswer: "docker run -v pgdata:/var/lib/postgresql/data postgres:16", explanation: "-v name:/path creates a named volume." },
    { type: "true_false", difficulty: "beginner", question: "Container filesystems are ephemeral.", correctAnswer: "true", explanation: "Without volumes, data is lost when the container is removed." },
  ],
  "bind-mounts": [
    { type: "mcq", difficulty: "beginner", question: "What does -v $(pwd):/app do?", options: ["Creates named volume", "Mounts current dir into container at /app", "Copies files", "Sets env var"], correctAnswer: "Mounts current dir into container at /app", explanation: "Bind mounts map a host path directly into the container." },
    { type: "command", difficulty: "intermediate", question: "Type the command that bind-mounts current dir read-only.", correctAnswer: "docker run -v $(pwd):/app:ro myimage", explanation: ":ro makes the mount read-only inside the container." },
    { type: "true_false", difficulty: "intermediate", question: "Named volumes are preferred over bind mounts for production data.", correctAnswer: "true", explanation: "Named volumes are Docker-managed and better for persistent data." },
  ],
  "publishing-ports": [
    { type: "mcq", difficulty: "beginner", question: "What does -p 8080:80 do?", options: ["Sets env vars", "Maps host 8080 to container 80", "Creates network", "Mounts volume"], correctAnswer: "Maps host 8080 to container 80", explanation: "-p host:container publishes the container port." },
    { type: "command", difficulty: "beginner", question: "Type the command that runs nginx publishing port 3000:80.", correctAnswer: "docker run -p 3000:80 nginx", explanation: "-p 3000:80 maps host 3000 to container 80." },
    { type: "true_false", difficulty: "beginner", question: "EXPOSE in a Dockerfile actually publishes the port.", correctAnswer: "false", explanation: "EXPOSE only documents intent. Only -p publishes." },
  ],
  "custom-networks": [
    { type: "mcq", difficulty: "beginner", question: "How do containers communicate on a user-defined network?", options: ["By IP only", "By container name (DNS)", "By MAC", "By port only"], correctAnswer: "By container name (DNS)", explanation: "Docker provides DNS on user-defined networks." },
    { type: "command", difficulty: "beginner", question: "Type the command that creates bridge network mynet.", correctAnswer: "docker network create mynet", explanation: "docker network create makes a new bridge network." },
    { type: "true_false", difficulty: "intermediate", question: "Containers on different networks cannot communicate by default.", correctAnswer: "true", explanation: "Network isolation is the default behavior." },
  ],
  "compose-yml": [
    { type: "mcq", difficulty: "beginner", question: "What is the top-level key for containers in compose?", options: ["containers:", "services:", "apps:", "deploy:"], correctAnswer: "services:", explanation: "services: defines each container in the compose file." },
    { type: "command", difficulty: "beginner", question: "Type the command that starts services in background.", correctAnswer: "docker compose up -d", explanation: "docker compose up starts services, -d runs detached." },
    { type: "true_false", difficulty: "beginner", question: "Compose files should never contain real production secrets.", correctAnswer: "true", explanation: "Compose files are committed to git. Use a secret manager." },
  ],
  "compose-lifecycle": [
    { type: "mcq", difficulty: "beginner", question: "What does docker compose down -v do?", options: ["Stops only", "Stops and removes containers AND volumes", "Restarts", "Shows status"], correctAnswer: "Stops and removes containers AND volumes", explanation: "-v also removes named volumes, wiping data." },
    { type: "command", difficulty: "beginner", question: "Type the command that tails web service logs.", correctAnswer: "docker compose logs -f web", explanation: "-f follows new log lines in real time." },
    { type: "true_false", difficulty: "intermediate", question: "docker compose up --build rebuilds images.", correctAnswer: "true", explanation: "--build forces a rebuild even with cached layers." },
  ],
  "compose-overrides": [
    { type: "mcq", difficulty: "intermediate", question: "How do you merge compose files?", options: ["Copy-paste", "docker compose -f base.yaml -f override.yaml up", "docker compose merge", "docker compose combine"], correctAnswer: "docker compose -f base.yaml -f override.yaml up", explanation: "Multiple -f flags layer files, later values override." },
    { type: "command", difficulty: "intermediate", question: "Type the command that starts with base and production compose files.", correctAnswer: "docker compose -f compose.yaml -f compose.prod.yaml up -d", explanation: "Multiple -f flags merge compose files." },
    { type: "true_false", difficulty: "intermediate", question: "Shell variable interpolation uses ${VAR} syntax.", correctAnswer: "true", explanation: "docker compose reads ${VAR} from shell or .env." },
  ],

  // KUBERNETES: All lessons
  "cluster-components": [
    { type: "mcq", difficulty: "beginner", question: "Which is the single entry point for all API requests?", options: ["etcd", "kube-apiserver", "kubelet", "scheduler"], correctAnswer: "kube-apiserver", explanation: "kube-apiserver is the front door for everything." },
    { type: "true_false", difficulty: "beginner", question: "etcd stores the cluster's desired and actual state.", correctAnswer: "true", explanation: "etcd is the distributed key-value store holding all cluster data." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists all cluster nodes.", correctAnswer: "kubectl get nodes", explanation: "kubectl get nodes shows all nodes with status." },
  ],
  "declarative-state": [
    { type: "mcq", difficulty: "beginner", question: "What is reconciliation in Kubernetes?", options: ["Manual admin intervention", "Controllers continuously comparing desired to actual state", "Deleting old resources", "Scaling pods"], correctAnswer: "Controllers continuously comparing desired to actual state", explanation: "Controllers watch the API server and take action to match declared YAML." },
    { type: "true_false", difficulty: "beginner", question: "You declare desired state and the system makes it so.", correctAnswer: "true", explanation: "You apply YAML manifests, controllers reconcile to match." },
    { type: "command", difficulty: "beginner", question: "Type the command that applies a manifest file.", correctAnswer: "kubectl apply -f manifest.yaml", explanation: "kubectl apply declares desired state from YAML." },
  ],
  "kubectl-basics": [
    { type: "mcq", difficulty: "beginner", question: "Which command shows detailed events for a resource?", options: ["kubectl get", "kubectl describe", "kubectl delete", "kubectl exec"], correctAnswer: "kubectl describe", explanation: "describe shows detailed info including events." },
    { type: "command", difficulty: "beginner", question: "Type the command that watches pods in real time.", correctAnswer: "kubectl get pods -w", explanation: "-w streams updates for the reconciliation loop." },
    { type: "true_false", difficulty: "beginner", question: "kubectl apply is idempotent.", correctAnswer: "true", explanation: "Applying the same manifest twice is safe — creates or updates." },
  ],
  namespaces: [
    { type: "mcq", difficulty: "beginner", question: "What is a Kubernetes namespace?", options: ["Physical machine", "Logical partition of a cluster", "Docker image", "Storage class"], correctAnswer: "Logical partition of a cluster", explanation: "Namespaces scope resource names and policies." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists all namespaces.", correctAnswer: "kubectl get namespaces|kubectl get ns", explanation: "kubectl get namespaces shows all namespaces." },
    { type: "true_false", difficulty: "intermediate", question: "Namespaces alone provide strong security isolation.", correctAnswer: "false", explanation: "Namespaces are organizational. RBAC provides real isolation." },
  ],
  "pod-anatomy": [
    { type: "mcq", difficulty: "beginner", question: "What is the smallest deployable unit in Kubernetes?", options: ["Node", "Container", "Pod", "Deployment"], correctAnswer: "Pod", explanation: "A pod is the atomic unit — containers share an IP and volumes." },
    { type: "true_false", difficulty: "beginner", question: "Containers in a pod share the same network namespace.", correctAnswer: "true", explanation: "All containers in a pod share the pod's IP." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists all pods.", correctAnswer: "kubectl get pods", explanation: "kubectl get pods shows running pods with status." },
  ],
  "running-inspecting": [
    { type: "mcq", difficulty: "beginner", question: "Which command opens a shell inside a running pod?", options: ["kubectl logs", "kubectl exec -it pod-name -- bash", "kubectl describe", "kubectl port-forward"], correctAnswer: "kubectl exec -it pod-name -- bash", explanation: "kubectl exec runs a command inside a container interactively." },
    { type: "command", difficulty: "beginner", question: "Type the command that streams logs from pod web.", correctAnswer: "kubectl logs web -f", explanation: "-f follows new log lines." },
    { type: "true_false", difficulty: "intermediate", question: "kubectl logs --previous shows logs from a crashed container.", correctAnswer: "true", explanation: "--previous retrieves the terminated container's logs." },
  ],
  "deployments-replicasets": [
    { type: "mcq", difficulty: "beginner", question: "What does a Deployment manage?", options: ["Nodes", "ReplicaSets which manage Pods", "Containers", "Network policies"], correctAnswer: "ReplicaSets which manage Pods", explanation: "Deployment creates ReplicaSets, ReplicaSets ensure pod count." },
    { type: "true_false", difficulty: "beginner", question: "Deployments provide zero-downtime rolling updates.", correctAnswer: "true", explanation: "New ReplicaScale out while old one scales down." },
    { type: "command", difficulty: "beginner", question: "Type the command that checks rollout status of web.", correctAnswer: "kubectl rollout status deploy/web", explanation: "rollout status watches update progress." },
  ],
  scaling: [
    { type: "mcq", difficulty: "beginner", question: "Which command scales deployment to 5 replicas?", options: ["kubectl scale deploy web --replicas=5", "kubectl replicas deploy web 5", "kubectl set replicas web 5", "kubectl resize deploy web 5"], correctAnswer: "kubectl scale deploy web --replicas=5", explanation: "kubectl scale sets the desired replica count." },
    { type: "command", difficulty: "intermediate", question: "Type the command that reverts the last web rollout.", correctAnswer: "kubectl rollout undo deploy/web", explanation: "rollout undo rolls back to the previous ReplicaSet." },
    { type: "true_false", difficulty: "beginner", question: "HPA automatically scales based on metrics like CPU.", correctAnswer: "true", explanation: "HPA measures metrics and adjusts replica count." },
  ],
  "what-service-does": [
    { type: "mcq", difficulty: "beginner", question: "Why do pods need a Service?", options: ["To store data", "To have a stable network endpoint", "To run commands", "To manage secrets"], correctAnswer: "To have a stable network endpoint", explanation: "Pod IPs are ephemeral. Services provide stable ClusterIP and DNS." },
    { type: "command", difficulty: "beginner", question: "Type the command that lists all services.", correctAnswer: "kubectl get services|kubectl get svc", explanation: "kubectl get services shows all Services with type and ports." },
    { type: "true_false", difficulty: "beginner", question: "A Service uses label selectors to find pods.", correctAnswer: "true", explanation: "The selector matches pod labels for traffic routing." },
  ],
  "nodeport-lb": [
    { type: "mcq", difficulty: "intermediate", question: "Which Service type asks the cloud provider for an external IP?", options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"], correctAnswer: "LoadBalancer", explanation: "LoadBalancer provisions an external IP via cloud provider." },
    { type: "command", difficulty: "beginner", question: "Type the command that describes service web.", correctAnswer: "kubectl describe svc web", explanation: "describe shows selectors, endpoints, and events." },
    { type: "true_false", difficulty: "intermediate", question: "An Ingress routes HTTP by hostname and path at Layer 7.", correctAnswer: "true", explanation: "Ingress provides HTTP routing unlike L4 Services." },
  ],
  configmaps: [
    { type: "mcq", difficulty: "beginner", question: "What is a ConfigMap used for?", options: ["Passwords", "Non-sensitive configuration", "Container images", "Network policies"], correctAnswer: "Non-sensitive configuration", explanation: "ConfigMaps hold key-value pairs for non-sensitive config." },
    { type: "command", difficulty: "beginner", question: "Type the command that creates ConfigMap app-config.", correctAnswer: "kubectl create cm app-config --from-literal=LOG_LEVEL=info", explanation: "kubectl create configmap creates from literal key-value pairs." },
    { type: "true_false", difficulty: "beginner", question: "ConfigMaps are encrypted at rest by default.", correctAnswer: "false", explanation: "ConfigMaps are plain text. Use Secrets for sensitive data." },
  ],
  secrets: [
    { type: "mcq", difficulty: "intermediate", question: "How are Secret values stored?", options: ["AES encrypted", "Base64-encoded (not encrypted)", "Plaintext", "SHA-256 hashed"], correctAnswer: "Base64-encoded (not encrypted)", explanation: "Secrets use base64 encoding, which is obfuscation not encryption." },
    { type: "command", difficulty: "intermediate", question: "Type the command that creates secret db-creds.", correctAnswer: "kubectl create secret generic db-creds --from-literal=password=mysecret", explanation: "kubectl create secret generic creates from literal pairs." },
    { type: "true_false", difficulty: "intermediate", question: "Kubernetes supports encryption at rest for Secrets via KMS.", correctAnswer: "true", explanation: "With KMS provider, Secrets can be encrypted in etcd." },
  ],
};

function buildQuestionBlock(questions) {
  const lines = ["              questions: ["];
  for (const q of questions) {
    lines.push("                {");
    lines.push(`                  type: "${q.type}",`);
    lines.push(`                  difficulty: "${q.difficulty}",`);
    lines.push(`                  question: ${JSON.stringify(q.question)},`);
    if (q.options) lines.push(`                  options: ${JSON.stringify(q.options)},`);
    lines.push(`                  correctAnswer: ${JSON.stringify(q.correctAnswer)},`);
    lines.push(`                  explanation: ${JSON.stringify(q.explanation)},`);
    lines.push("                },");
  }
  lines.push("              ],");
  return lines.join("\n");
}

function addQuestionsToFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  let added = 0;

  for (const [slug, questions] of Object.entries(questionData)) {
    const slugStr = `slug: "${slug}"`;
    const slugIdx = content.indexOf(slugStr);
    if (slugIdx === -1) continue;

    const afterSlug = content.slice(slugIdx);
    const actIdx = afterSlug.indexOf("activities: [");
    if (actIdx === -1) continue;

    const actSection = afterSlug.slice(actIdx + "activities: [".length);
    let depth = 1;
    let endIdx = -1;
    for (let i = 0; i < actSection.length; i++) {
      if (actSection[i] === "[") depth++;
      if (actSection[i] === "]") { depth--; if (depth === 0) { endIdx = i; break; } }
    }
    if (endIdx === -1) continue;

    // Check if questions already exist after activities ]
    const afterAct = actSection.slice(endIdx + 1, endIdx + 300);
    if (afterAct.trimStart().startsWith("questions:")) continue;

    // Find the position after the activities ] and check if we need a comma
    const activitiesEndPos = slugIdx + actIdx + "activities: [".length + endIdx;
    
    // Insert questions block after the activities ]
    let questionBlock = "\n" + buildQuestionBlock(questions);
    content = content.slice(0, activitiesEndPos + 1) + questionBlock + content.slice(activitiesEndPos + 1);
    added++;
  }

  if (added > 0) {
    writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Added questions to ${added} lessons in ${filePath}`);
  } else {
    console.log(`- No changes needed in ${filePath}`);
  }
}

addQuestionsToFile("content/curriculum/devops/linux.ts");
addQuestionsToFile("content/curriculum/devops/git.ts");
addQuestionsToFile("content/curriculum/devops/docker.ts");
addQuestionsToFile("content/curriculum/devops/kubernetes.ts");
console.log("\nDone! Run 'npx tsx prisma/seed.ts' to re-seed.");
