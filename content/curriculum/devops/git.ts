import type { SeedPath } from "@/lib/curriculum/seed";

export const gitPath: SeedPath = {
  title: "Git Version Control",
  description:
    "Track changes, branch, merge, and collaborate with confidence using Git.",
  slug: "git",
  modules: [
    {
      title: "Git Basics",
      description: "The three states and your first commits.",
      slug: "git-basics",
      icon: "GitCommit",
      units: [
        {
          title: "Core Concepts",
          description: "Repositories, snapshots, and the three states.",
          slug: "core-concepts",
          lessons: [
            {
              title: "What is Version Control?",
              description:
                "Why teams track changes with Git.",
              slug: "what-is-version-control",
              estimatedMinutes: 5,
              learningObjectives: [
                "Explain why version control matters",
                "Describe Git's snapshot model",
              ],
              skills: [
                { name: "vcs-awareness", description: "Understand the purpose of version control" },
              ],
              activities: [
                {
                  title: "Every Change, Recorded",
                  body: "Version control records your files at moments in time so you can compare, revert, and merge changes. Git's model is **snapshots**: each commit captures the entire project state, referenced by its parents.",
                },
                {
                  title: "Why It Matters",
                  body: "Every serious codebase, Kubernetes config, and IaC definition is stored in Git. It is the trunk of the DevOps tree.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does Git's snapshot model capture?",
                  options: ["Only changed files","The entire project state","A diff of changes","Just metadata"],
                  correctAnswer: "The entire project state",
                  explanation: "Each commit captures the entire project state.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Version control allows comparing, reverting, and merging changes.",
                  correctAnswer: "true",
                  explanation: "That is the core purpose of version control.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command initializes a new Git repository?",
                  options: ["git init", "git clone", "git create", "git new"],
                  correctAnswer: "git init",
                  explanation: "git init creates the .git directory.",
                },
                {
                  type: "multi_select",
                  question: "Which benefits does version control provide?",
                  explanation: "Version control tracks changes, enables collaboration, and supports branching workflows.",
                  difficulty: "beginner",
                  multiSelectOptions: [
                    { text: "Track changes over time", isCorrect: true },
                    { text: "Collaborate without overwriting", isCorrect: true },
                    { text: "Execute code directly", isCorrect: false },
                    { text: "Revert to previous states", isCorrect: true },
                  ],
                },
                {
                  type: "fill_blank",
                  question: "Git captures the entire _____ state at each commit, not just the differences.",
                  explanation: "Git's snapshot model records the whole project, referenced by its parent commits.",
                  difficulty: "beginner",
                  hint: "Think about what a commit holds.",
                  fillBlanks: [
                    { answer: "project", hint: "The full codebase at a point in time." },
                  ],
                },
              ],
            },
            {
              title: "Staging Area, Commit, Working Directory",
              description:
                "The three states every Git command touches.",
              slug: "three-states",
              estimatedMinutes: 7,
              learningObjectives: [
                "Describe working directory, staging area, and repo",
                "Run git add, git commit, and git status",
                "Read the output of git status",
              ],
              skills: [
                { name: "three-states", description: "Work with Git's three core states" },
              ],
              activities: [
                {
                  title: "The Mental Model",
                  body: "Your **working directory** holds the current files. `git add` moves changes into the **staging area** (the index), and `git commit` records the staged snapshot into the **repository**. `git status` always tells you which state each file is in.",
                },
                {
                  title: "Example",
                  body: "`echo hi > app.js && git add app.js && git commit -m 'Add app'` — the three steps in one line.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command moves changes into the staging area?",
                  options: ["git commit","git add","git push","git stash"],
                  correctAnswer: "git add",
                  explanation: "git add stages changes for the next commit.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows the state of files in the working directory?",
                  options: ["git status", "git diff", "git log", "git show"],
                  correctAnswer: "git status",
                  explanation: "git status shows modified, staged, and untracked files.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "The staging area is between the working directory and the repository.",
                  correctAnswer: "true",
                  explanation: "git add stages, git commit records the staged snapshot.",
                },
                {
                  type: "match",
                  question: "Match each Git state to the command that moves files into it.",
                  explanation: "git add moves to staging, git commit records into the repository, git restore resets.",
                  difficulty: "beginner",
                  matchPairs: [
                    { left: "Staging area", right: "git add" },
                    { left: "Repository", right: "git commit" },
                    { left: "Working directory", right: "git restore" },
                  ],
                },
                {
                  type: "sequence",
                  question: "Put the three-state workflow in order from first action to commit.",
                  explanation: "You edit or create files in the working directory, stage the changes with git add, then record them with git commit.",
                  difficulty: "beginner",
                  sequenceItems: [
                    { id: "edit-files", text: "Edit or create files in the working directory" },
                    { id: "stage-changes", text: "Stage the changes with git add" },
                    { id: "commit-snapshot", text: "Commit the staged snapshot with git commit" },
                  ],
                  sequenceCorrectOrder: ["edit-files", "stage-changes", "commit-snapshot"],
                },
              ],
            },
          ],
        },
        {
          title: "First Commits",
          description: "Create a repo and commit like a pro.",
          slug: "first-commits",
          lessons: [
            {
              title: "git init and First Commit",
              description: "Start a repository and snapshot your work.",
              slug: "init-first-commit",
              estimatedMinutes: 6,
              learningObjectives: [
                "Initialize a repository with git init",
                "Configure user.name and user.email locally",
                "Write meaningful commit messages",
              ],
              skills: [
                { name: "git-init", description: "Start repositories and configure identity" },
              ],
              activities: [
                {
                  title: "Starting",
                  body: "`git init` creates a `.git` directory. Set your identity per-project: `git config user.name 'Ada'` and `git config user.email 'ada@dev.io'` (or global with `--global`). Then `git add .` and commit.",
                },
                {
                  title: "Message Style",
                  body: "Write subject lines as imperative commands: 'Add login route', not 'added stuff'. Future-you and your team will thank you.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does git init create?",
                  options: ["A remote repo","A .git directory","A README","A .gitignore"],
                  correctAnswer: "A .git directory",
                  explanation: "git init creates the .git directory with all version control metadata.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command stages all changes and creates an initial commit?",
                  options: ["git add . && git commit -m 'Initial commit'", "git commit -a -m 'Initial commit'", "git push origin main", "git add -u"],
                  correctAnswer: "git add . && git commit -m 'Initial commit'",
                  explanation: "git add . stages all files, git commit records them.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Commit messages should use imperative style.",
                  correctAnswer: "true",
                  explanation: "'Add feature' reads as an instruction, not a description.",
                },
                {
                  type: "fill_blank",
                  question: "Set your local name with: git config user._____ 'Your Name'",
                  explanation: "git config user.name sets the commit author name for the repository.",
                  difficulty: "beginner",
                  hint: "One of the two identity fields.",
                  fillBlanks: [
                    { answer: "name", hint: "The first part of your identity config." },
                  ],
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this directory name that stores all version control data.",
                  explanation: "The .git directory is created by git init and holds all repository metadata.",
                  difficulty: "beginner",
                  scrambledWord: "git",
                },
              ],
            },
            {
              title: "git diff and git log",
              description:
                "Review what changed and explore history.",
              slug: "diff-log",
              estimatedMinutes: 7,
              learningObjectives: [
                "Inspect uncommitted changes with git diff",
                "Read history with git log --oneline --graph",
                "Show a specific commit with git show",
              ],
              skills: [
                { name: "git-history", description: "Inspect changes and repository history" },
              ],
              activities: [
                {
                  title: "Change Review",
                  body: "`git diff` shows unstaged changes; `git diff --staged` shows staged ones. `git log --oneline --graph --all` draws a compact history map. `git show <hash>` reveals one commit's files and diff.",
                },
                {
                  title: "Habit",
                  body: "Before committing, always `git diff` — the review is where bugs are caught.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows commit history?",
                  options: ["git diff","git log","git status","git show"],
                  correctAnswer: "git log",
                  explanation: "git log displays the commit history.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows a compact graphical view of commit history across all branches?",
                  options: ["git log --oneline --graph --all", "git log --pretty --branches", "git history --graph", "git diff --all"],
                  correctAnswer: "git log --oneline --graph --all",
                  explanation: "--oneline compresses, --graph draws topology, --all includes all branches.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "git diff shows unstaged changes.",
                  correctAnswer: "true",
                  explanation: "git diff compares working directory to staging area.",
                },
                {
                  type: "multi_select",
                  question: "Which flags can be combined with git log to improve output readability?",
                  explanation: "--oneline compresses each commit, --graph draws branch topology, --all includes all refs.",
                  difficulty: "beginner",
                  multiSelectOptions: [
                    { text: "--oneline", isCorrect: true },
                    { text: "--graph", isCorrect: true },
                    { text: "--push", isCorrect: false },
                    { text: "--all", isCorrect: true },
                  ],
                },
                {
                  type: "match",
                  question: "Match each history command to what it reveals.",
                  explanation: "git diff shows unstaged changes, git diff --staged shows staged ones, and git show <hash> reveals a single commit's files and diff.",
                  difficulty: "beginner",
                  matchPairs: [
                    { left: "git diff", right: "Unstaged changes" },
                    { left: "git diff --staged", right: "Staged changes" },
                    { left: "git show <hash>", right: "One commit's files and diff" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Branching",
      description: "Isolate work on parallel lines of development.",
      slug: "branching",
      icon: "GitBranch",
      units: [
        {
          title: "Working with Branches",
          description: "Create, switch, and inspect branches.",
          slug: "working-with-branches",
          lessons: [
            {
              title: "Creating and Switching",
              description: "git branch and git checkout/switch.",
              slug: "create-switch",
              estimatedMinutes: 6,
              learningObjectives: [
                "Create a branch with git branch",
                "Switch branches with git switch",
                "Explain what a branch pointer is",
              ],
              skills: [
                { name: "git-branching", description: "Create and switch branches" },
              ],
              activities: [
                {
                  title: "Branches Are Labels",
                  body: "A branch is just a movable pointer to a commit. `git branch feature` creates one; `git switch feature` moves you onto it (or `git switch -c feature` for both at once). HEAD follows the branch you are on.",
                },
                {
                  title: "Why Branch",
                  body: "Isolate experiments. A bug on main never touches your half-finished feature — and vice versa.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a Git branch?",
                  options: ["A copy of the repo","A movable pointer to a commit","A backup","A tag"],
                  correctAnswer: "A movable pointer to a commit",
                  explanation: "A branch is a label pointing to a commit.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command creates and switches to a new branch named feature?",
                  options: ["git switch -c feature", "git branch feature", "git checkout main", "git merge feature"],
                  correctAnswer: "git switch -c feature",
                  explanation: "git switch -c creates and switches in one step.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "HEAD points to the current branch.",
                  correctAnswer: "true",
                  explanation: "HEAD follows the branch you are on.",
                },
                {
                  type: "sequence",
                  question: "Put these steps in the correct order to start working on a new branch.",
                  explanation: "Create the branch, switch to it, then make and commit changes on it.",
                  difficulty: "beginner",
                  sequenceItems: [
                    { id: "make-changes", text: "Make changes and commit" },
                    { id: "create-branch", text: "Create the branch" },
                    { id: "switch-branch", text: "Switch to the new branch" },
                  ],
                  sequenceCorrectOrder: ["create-branch", "switch-branch", "make-changes"],
                },
                {
                  type: "fill_blank",
                  question: "A branch is a movable pointer to a _____ in the repository history.",
                  explanation: "Each branch points to a commit and advances as new commits land on it.",
                  difficulty: "beginner",
                  hint: "The basic unit of Git history.",
                  fillBlanks: [
                    { answer: "commit", hint: "Git's fundamental snapshot object." },
                  ],
                },
              ],
            },
            {
              title: "git status and stash",
              description: "Understand position and set work aside.",
              slug: "status-stash",
              estimatedMinutes: 6,
              learningObjectives: [
                "Interpret an 'ahead/behind' status",
                "Stash and restore work with git stash",
              ],
              skills: [
                { name: "git-stash", description: "Set aside in-progress changes" },
              ],
              activities: [
                {
                  title: "Where Am I?",
                  body: "After a fetch, `git status` reports 'ahead' (local commits to push) and 'behind' (remote commits to pull). `git stash` shelves uncommitted changes — `git stash pop` returns them — perfect before switching branches mid-task.",
                },
                {
                  title: "Example",
                  body: "`git stash` → `git switch main` → fix the hot bug → `git switch feature` → `git stash pop`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does git stash do?",
                  options: ["Deletes changes","Temporarily shelves changes","Creates a branch","Pushes changes"],
                  correctAnswer: "Temporarily shelves changes",
                  explanation: "git stash saves changes to a stack for later reapplication.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command temporarily shelves your uncommitted changes?",
                  options: ["git stash", "git save", "git checkpoint", "git shelve"],
                  correctAnswer: "git stash",
                  explanation: "git stash saves uncommitted changes.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "git stash pop applies stashed changes and removes them from the stash.",
                  correctAnswer: "true",
                  explanation: "stash pop applies and drops. stash apply keeps them.",
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this command that saves uncommitted work for later.",
                  explanation: "git stash shelves working directory and staging changes for later reapplication.",
                  difficulty: "beginner",
                  scrambledWord: "stash",
                },
                {
                  type: "multi_select",
                  question: "Your branch reports 'ahead' in git status. Which statements are true?",
                  explanation: "'Ahead' means you have local commits not yet on the remote, so git push will upload them. A 'behind' report is what git pull resolves.",
                  difficulty: "beginner",
                  multiSelectOptions: [
                    { text: "Local commits exist that are not on the remote", isCorrect: true },
                    { text: "git push will upload your local commits", isCorrect: true },
                    { text: "You need to pull to catch up", isCorrect: false },
                    { text: "The local and remote branches are fully in sync", isCorrect: false },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Branch Pointers",
          description: "Move branches with reset and checkout.",
          slug: "branch-pointers",
          lessons: [
            {
              title: "git reset Explained",
              description: "Move branch pointers with care.",
              slug: "git-reset",
              estimatedMinutes: 8,
              learningObjectives: [
                "Explain soft vs hard reset",
                "Unstage accidentally staged files",
                "Understand when reset destroys history",
              ],
              skills: [
                { name: "git-reset", description: "Move branch pointers and unstage changes" },
              ],
              activities: [
                {
                  title: "Reset Degrees",
                  body: "`git reset --soft` moves the branch pointer only. `git reset` (mixed) also unstages. `git reset --hard` additionally discards working-tree changes — dangerous and mostly irreversible. `git restore --staged file` is the gentle way to unstage.",
                },
                {
                  title: "Golden Rule",
                  body: "Never `reset --hard` published commits. Reset local mistakes freely; decorate history on shared branches.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "What does git reset --soft do?",
                  options: ["Discards all changes","Moves branch pointer only","Unstages changes","Deletes last commit"],
                  correctAnswer: "Moves branch pointer only",
                  explanation: "--soft moves the pointer without changing staging or working directory.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command unstages app.js while keeping the changes?",
                  options: ["git restore --staged app.js", "git reset --hard app.js", "git checkout app.js", "git remove --staged app.js"],
                  correctAnswer: "git restore --staged app.js",
                  explanation: "git restore --staged removes from staging, keeping changes.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "git reset --hard discards all uncommitted changes.",
                  correctAnswer: "true",
                  explanation: "--hard resets staging AND working directory irreversibly.",
                },
                {
                  type: "multi_select",
                  question: "Which parts of Git does git reset --hard affect?",
                  explanation: "--hard moves the pointer, clears the index, AND discards working tree changes.",
                  difficulty: "intermediate",
                  multiSelectOptions: [
                    { text: "Moves the branch pointer", isCorrect: true },
                    { text: "Clears staged changes", isCorrect: true },
                    { text: "Discards working tree changes", isCorrect: true },
                    { text: "Pushes to the remote", isCorrect: false },
                  ],
                },
                {
                  type: "match",
                  question: "Match each reset mode to what it preserves.",
                  explanation: "--soft keeps everything, --mixed preserves only the working tree, --hard keeps nothing.",
                  difficulty: "intermediate",
                  matchPairs: [
                    { left: "--soft", right: "Preserves staging and working tree" },
                    { left: "--mixed", right: "Preserves only the working tree" },
                    { left: "--hard", right: "Preserves nothing" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Merging",
      description: "Bring branches together cleanly.",
      slug: "merging",
      icon: "GitMerge",
      units: [
        {
          title: "Merge Strategies",
          description: "Fast-forward and three-way merges.",
          slug: "merge-strategies",
          lessons: [
            {
              title: "git merge",
              description: "Integrate one branch into another.",
              slug: "git-merge",
              estimatedMinutes: 7,
              learningObjectives: [
                "Perform a merge with git merge",
                "Recognize a fast-forward merge",
                "Understand a three-way merge conflict",
              ],
              skills: [
                { name: "git-merge", description: "Merge branches" },
              ],
              activities: [
                {
                  title: "Two Worlds",
                  body: "If main has not diverged, merging is a **fast-forward**: the pointer just moves. If both branches moved, Git creates a **merge commit** by combining histories. Conflicts arise when both sides changed the same lines.",
                },
                {
                  title: "Example",
                  body: "`git switch main && git merge feature` integrates the feature branch into main.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a fast-forward merge?",
                  options: ["Creates new commit","Just moves the pointer","Rebases commits","Deletes branch"],
                  correctAnswer: "Just moves the pointer",
                  explanation: "When target hasn't diverged, Git moves the pointer forward.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which commands merge the feature branch into main?",
                  options: ["git switch main && git merge feature", "git switch feature && git merge main", "git rebase main feature", "git push origin feature"],
                  correctAnswer: "git switch main && git merge feature",
                  explanation: "Switch to target, then merge the source.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Merge conflicts happen when both branches changed the same lines.",
                  correctAnswer: "true",
                  explanation: "Git cannot auto-decide, so it marks conflicts for manual resolution.",
                },
                {
                  type: "sequence",
                  question: "Put the steps of merging a branch together in order.",
                  explanation: "Switch to the target branch first, merge the source into it, then resolve any conflicts.",
                  difficulty: "beginner",
                  sequenceItems: [
                    { id: "resolve-conflicts", text: "Resolve any conflicts and commit" },
                    { id: "merge-source", text: "Run git merge source-branch" },
                    { id: "switch-target", text: "Switch to the target branch" },
                  ],
                  sequenceCorrectOrder: ["switch-target", "merge-source", "resolve-conflicts"],
                },
                {
                  type: "fill_blank",
                  question: "When both branches changed the same lines, a _____ conflict arises.",
                  explanation: "Both sides changed the same code, so Git cannot safely auto-merge them.",
                  difficulty: "intermediate",
                  hint: "It happens during merging.",
                  fillBlanks: [
                    { answer: "merge", hint: "The process that triggers this conflict." },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Conflicts",
          description: "Resolve them instead of fearing them.",
          slug: "conflicts",
          lessons: [
            {
              title: "Resolving Conflicts",
              description: "Read markers and choose content.",
              slug: "resolving-conflicts",
              estimatedMinutes: 9,
              learningObjectives: [
                "Identify conflict markers",
                "Resolve conflicts in an editor",
                "Finish with git add + commit",
              ],
              skills: [
                { name: "conflict-resolution", description: "Resolve merge conflicts" },
              ],
              activities: [
                {
                  title: "The Markers",
                  body: "Conflicted files contain `<<<<<<< HEAD` (your side), `=======` (divider), and `>>>>>>> feature` (theirs). Edit the file to the correct content, remove the markers, then `git add file` and `git commit`.",
                },
                {
                  title: "Mindset",
                  body: "Conflicts are not a failure — they are Git refusing to guess about your work. Read both versions; the merged truth is usually a combination.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "What does ======= separate in a conflict?",
                  options: ["File name and content","Your changes and theirs","Commit message and diff","Old and new version"],
                  correctAnswer: "Your changes and theirs",
                  explanation: "<<<<<<< HEAD is yours, ======= divides, >>>>>>> theirs is the other.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "After resolving a conflict in app.js, which command marks it as resolved?",
                  options: ["git add app.js", "git commit app.js", "git resolve app.js", "git merge app.js"],
                  correctAnswer: "git add app.js",
                  explanation: "git add tells Git the conflict is resolved.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Conflicts are a failure to be avoided.",
                  correctAnswer: "false",
                  explanation: "Conflicts are normal — Git refuses to guess about your work.",
                },
                {
                  type: "match",
                  question: "Match each conflict marker to what it represents.",
                  explanation: "<<<<<<< HEAD is your side, ======= divides the versions, >>>>>>> is the other branch.",
                  difficulty: "intermediate",
                  matchPairs: [
                    { left: "<<<<<<< HEAD", right: "Your current changes" },
                    { left: "=======", right: "Divider between versions" },
                    { left: ">>>>>>> feature", right: "The other branch's changes" },
                  ],
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this word for the process of fixing conflicting file content.",
                  explanation: "Resolving means editing the file to the correct content and removing the markers.",
                  difficulty: "intermediate",
                  scrambledWord: "resolving",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Remotes",
      description: "Sync with GitHub and other hosts.",
      slug: "remotes",
      icon: "Cloud",
      units: [
        {
          title: "Remote Basics",
          description: "clone, push, pull, and fetch.",
          slug: "remote-basics",
          lessons: [
            {
              title: "Cloning and Pushing",
              description: "Get a repo and upload your work.",
              slug: "clone-push",
              estimatedMinutes: 6,
              learningObjectives: [
                "Clone a repository with git clone",
                "Push commits to a remote",
                "Add a remote with git remote add",
              ],
              skills: [
                { name: "git-clone-push", description: "Clone repositories and publish commits" },
              ],
              activities: [
                {
                  title: "Getting and Giving",
                  body: "`git clone <url>` copies a remote repo locally. `git push origin branch` uploads your commits. `git remote -v` shows configured remotes; `git remote add origin <url>` adds one to a repo you initialized locally.",
                },
                {
                  title: "Example",
                  body: "Local repo → GitHub: `git remote add origin https://github.com/you/proj.git && git push -u origin main`. The `-u` sets tracking once.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does git clone do?",
                  options: ["Creates a repo","Downloads a remote copy","Pushes changes","Merges repos"],
                  correctAnswer: "Downloads a remote copy",
                  explanation: "git clone copies the remote repo locally with all history.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command pushes the main branch to the origin remote?",
                  options: ["git push origin main", "git push main origin", "git upload origin main", "git send origin main"],
                  correctAnswer: "git push origin main",
                  explanation: "git push uploads local commits to the remote.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "git remote -v shows configured remotes.",
                  correctAnswer: "true",
                  explanation: "git remote -v lists remote names with their URLs.",
                },
                {
                  type: "fill_blank",
                  question: "Run: git remote add _____ <url> to connect a local repo to GitHub.",
                  explanation: "origin is the conventional name for the primary remote.",
                  difficulty: "beginner",
                  hint: "The default remote name.",
                  fillBlanks: [
                    { answer: "origin", hint: "It's the most common remote name." },
                  ],
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this command that downloads a full copy of a remote repository.",
                  explanation: "git clone copies the remote repo locally with all history and branches.",
                  difficulty: "beginner",
                  scrambledWord: "clone",
                },
              ],
            },
            {
              title: "fetch vs pull",
              description: "Download without merging.",
              slug: "fetch-pull",
              estimatedMinutes: 6,
              learningObjectives: [
                "Distinguish git fetch from git pull",
                "Use remote-tracking branches",
                "Pull with rebase",
              ],
              skills: [
                { name: "git-fetch-pull", description: "Sync with remotes safely" },
              ],
              activities: [
                {
                  title: "Fetch Downloads, Pull Integrates",
                  body: "`git fetch` downloads remote refs but changes nothing local — you stay safe and in control. `git pull` = fetch + merge, and `git pull --rebase` replays your local commits on top of the fetched work, producing linear history.",
                },
                {
                  title: "Preference",
                  body: "For personal branches, `--rebase` keeps history tidy. Fetch early and often to reduce surprises.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the difference between fetch and pull?",
                  options: ["Identical","fetch downloads without merging, pull downloads and merges","fetch for branches, pull for tags","fetch local, pull network"],
                  correctAnswer: "fetch downloads without merging, pull downloads and merges",
                  explanation: "fetch updates remote-tracking branches. pull = fetch + merge.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command pulls from origin main, replaying local commits on top?",
                  options: ["git pull --rebase origin main", "git fetch --rebase origin main", "git pull --merge origin main", "git rebase --pull origin main"],
                  correctAnswer: "git pull --rebase origin main",
                  explanation: "--rebase replays local commits on top of fetched work.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "fetch is safer than pull because it does not modify your working directory.",
                  correctAnswer: "true",
                  explanation: "fetch only updates remote-tracking refs.",
                },
                {
                  type: "multi_select",
                  question: "Which statements about git fetch are true?",
                  explanation: "Fetch downloads remote refs without touching your working directory, making it safe to review first.",
                  difficulty: "beginner",
                  multiSelectOptions: [
                    { text: "Downloads remote-tracking branches", isCorrect: true },
                    { text: "Modifies your working directory", isCorrect: false },
                    { text: "Is safer than pulling for reviewing changes", isCorrect: true },
                    { text: "Merges remote changes automatically", isCorrect: false },
                  ],
                },
                {
                  type: "fill_blank",
                  question: "git pull --_____ replays your local commits on top of the freshly fetched ones, keeping history linear.",
                  explanation: "git pull --rebase fetches remote work and replays your local commits on top instead of creating a merge commit.",
                  difficulty: "intermediate",
                  hint: "The option that fetches then replays commits.",
                  fillBlanks: [
                    { answer: "rebase", hint: "It's how you keep personal-branch history tidy." },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Collaboration",
          description: "Forks, pull requests, and review flow.",
          slug: "collaboration",
          lessons: [
            {
              title: "Fork, Branch, PR",
              description: "The standard open-source contribution loop.",
              slug: "fork-branch-pr",
              estimatedMinutes: 8,
              learningObjectives: [
                "Explain the fork → branch → PR flow",
                "Keep a fork in sync",
                "Describe the review lifecycle",
              ],
              skills: [
                { name: "pull-requests", description: "Contribute through forks and pull requests" },
              ],
              activities: [
                {
                  title: "The Loop",
                  body: "Fork on GitHub, `git clone` your fork, create a branch, push it, and open a **Pull Request** from your branch to upstream. Reviewers comment, you amend commits, and a maintainer merges. Always pull upstream changes into your branch first to minimize conflicts.",
                },
                {
                  title: "Sync Your Fork",
                  body: "`git remote add upstream <original-url>` then `git pull upstream main` keeps your fork current.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "What keeps your fork in sync with upstream?",
                  options: ["git push","git remote add upstream + pull","git merge","git rebase"],
                  correctAnswer: "git remote add upstream + pull",
                  explanation: "Adding upstream and pulling keeps your fork current.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A Pull Request proposes merging your branch for review.",
                  correctAnswer: "true",
                  explanation: "PRs are the standard way to propose changes.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command adds the original repository as the upstream remote?",
                  options: ["git remote add upstream <url>", "git remote add origin <url>", "git remote set-url upstream <url>", "git remote rename origin upstream"],
                  correctAnswer: "git remote add upstream <url>",
                  explanation: "git remote add creates a new remote reference.",
                },
                {
                  type: "sequence",
                  question: "Put the standard open-source contribution flow in order.",
                  explanation: "Fork on GitHub, clone your fork, branch locally, push, then open a pull request.",
                  difficulty: "intermediate",
                  sequenceItems: [
                    { id: "open-pr", text: "Open a Pull Request for review" },
                    { id: "create-branch", text: "Create a feature branch locally" },
                    { id: "push-branch", text: "Push your branch to your fork" },
                    { id: "clone-fork", text: "Clone your fork locally" },
                    { id: "fork-repo", text: "Fork the repository on GitHub" },
                  ],
                  sequenceCorrectOrder: ["fork-repo", "clone-fork", "create-branch", "push-branch", "open-pr"],
                },
                {
                  type: "match",
                  question: "Match each remote name to its usual purpose.",
                  explanation: "origin points to your fork, upstream to the original repository.",
                  difficulty: "intermediate",
                  matchPairs: [
                    { left: "origin", right: "Your fork or primary remote" },
                    { left: "upstream", right: "The original repository" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Collaboration",
      description: "Working well in a shared repository.",
      slug: "collaboration-flow",
      icon: "Users",
      units: [
        {
          title: "Team Workflow",
          description: "Conventions that keep history readable.",
          slug: "team-workflow",
          lessons: [
            {
              title: "Conventional Commits",
              description: "feat, fix, docs, and friends.",
              slug: "conventional-commits",
              estimatedMinutes: 5,
              learningObjectives: [
                "Write conventional commit prefixes",
                "Explain how tooling parses messages",
              ],
              skills: [
                { name: "conventional-commits", description: "Follow commit message conventions" },
              ],
              activities: [
                {
                  title: "A Shared Grammar",
                  body: "Prefixes like `feat:` (feature), `fix:`, `docs:`, `refactor:`, and `chore:` make history scannable and power automated changelogs and releases. Example: `feat(auth): add password reset flow`.",
                },
                {
                  title: "Scope",
                  body: "The parenthesized scope signals the area touched: `fix(api): return 404 for missing user`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which prefix indicates a new feature?",
                  options: ["fix:","feat:","docs:","chore:"],
                  correctAnswer: "feat:",
                  explanation: "feat: signals a new feature.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Conventional commits power automated changelogs.",
                  correctAnswer: "true",
                  explanation: "Tools parse prefixes to generate changelogs and version bumps.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is a valid conventional commit message for adding login to auth?",
                  options: ["feat(auth): add login", "feat: login to auth added", "auth: add login", "add login (auth)"],
                  correctAnswer: "feat(auth): add login",
                  explanation: "type(scope): description is the format.",
                },
                {
                  type: "match",
                  question: "Match each conventional commit prefix to its meaning.",
                  explanation: "Each prefix signals a specific kind of change that tools and reviewers can scan.",
                  difficulty: "beginner",
                  matchPairs: [
                    { left: "feat:", right: "A new feature" },
                    { left: "fix:", right: "A bug fix" },
                    { left: "docs:", right: "Documentation only" },
                    { left: "chore:", right: "Maintenance tasks" },
                  ],
                },
                {
                  type: "fill_blank",
                  question: "The format is type(_____): description — the parenthesized part marks the code area touched.",
                  explanation: "Scopes like auth, api, or ui identify which part of the codebase changed.",
                  difficulty: "beginner",
                  hint: "fits between the type and the colon.",
                  fillBlanks: [
                    { answer: "scope", hint: "It identifies the area of code touched." },
                  ],
                },
              ],
            },
            {
              title: "Protecting the Trunk",
              description: "Branch protection and CI on PRs.",
              slug: "branch-protection",
              estimatedMinutes: 5,
              learningObjectives: [
                "Explain branch protection rules",
                "Describe required status checks",
              ],
              skills: [
                { name: "branch-protection", description: "Guard the main branch" },
              ],
              activities: [
                {
                  title: "Rules for Merging",
                  body: "Teams require reviews, passing CI, and up-to-date branches before merging. Protected branches cannot receive direct pushes — every change flows through a green-checked pull request.",
                },
                {
                  title: "Why",
                  body: "It is the cheapest way to guarantee main always builds and tests pass.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "What do branch protection rules require?",
                  options: ["Direct pushes","Reviews and passing CI","One approval","Nothing"],
                  correctAnswer: "Reviews and passing CI",
                  explanation: "Protected branches require reviews and passing status checks.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Protected branches cannot receive direct pushes.",
                  correctAnswer: "true",
                  explanation: "Changes must flow through pull requests.",
                },
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command checks if your branch is behind main?",
                  options: ["git fetch origin && git log HEAD..origin/main --oneline", "git log origin/main..HEAD --oneline", "git diff origin/main", "git status origin/main"],
                  correctAnswer: "git fetch origin && git log HEAD..origin/main --oneline",
                  explanation: "Fetching updates refs, then the log shows missing commits.",
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this rule that requires reviews and passing CI before merging to main.",
                  explanation: "Branch protection blocks direct pushes so every change flows through a reviewed pull request.",
                  difficulty: "beginner",
                  scrambledWord: "protection",
                },
                {
                  type: "multi_select",
                  question: "Which requirements commonly apply to a protected branch before merging?",
                  explanation: "Protected branches typically require an approved review, passing CI status checks, and being up to date with main — direct pushes are blocked.",
                  difficulty: "intermediate",
                  multiSelectOptions: [
                    { text: "At least one approved review", isCorrect: true },
                    { text: "Required status checks pass", isCorrect: true },
                    { text: "The branch is up to date with main", isCorrect: true },
                    { text: "A direct push without a pull request", isCorrect: false },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Recovery",
          description: "Undo mistakes with confidence.",
          slug: "recovery",
          lessons: [
            {
              title: "git revert",
              description: "Undo published work safely.",
              slug: "git-revert",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain revert vs reset",
                "Revert a commit with git revert",
              ],
              skills: [
                { name: "git-revert", description: "Safely undo published commits" },
              ],
              activities: [
                {
                  title: "The Safe Undo",
                  body: "`git revert <hash>` creates a *new* commit that undoes the old one — history stays intact and collaborators simply pull the fix. Unlike `reset`, revert never rewrites shared history.",
                },
                {
                  title: "Example",
                  body: "`git revert HEAD` undoes the latest commit and prompts for a new message.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does git revert do differently from reset?",
                  options: ["Deletes commit","Creates new commit that undoes old one","Modifies in place","Pushes immediately"],
                  correctAnswer: "Creates new commit that undoes old one",
                  explanation: "revert is safe for shared history — it adds rather than rewrites.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command undoes the latest commit with a new inverse commit?",
                  options: ["git revert HEAD", "git reset HEAD", "git undo HEAD", "git delete HEAD"],
                  correctAnswer: "git revert HEAD",
                  explanation: "git revert HEAD creates a new commit inversing HEAD.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "revert is safe on pushed commits.",
                  correctAnswer: "true",
                  explanation: "Unlike reset, revert does not rewrite history.",
                },
                {
                  type: "sequence",
                  question: "Order these undo strategies from safest to most dangerous for shared history.",
                  explanation: "Revert adds a new commit, soft reset stays local, hard reset discards working changes.",
                  difficulty: "intermediate",
                  sequenceItems: [
                    { id: "hard-reset", text: "git reset --hard" },
                    { id: "soft-reset", text: "git reset --soft" },
                    { id: "revert", text: "git revert" },
                  ],
                  sequenceCorrectOrder: ["revert", "soft-reset", "hard-reset"],
                },
                {
                  type: "multi_select",
                  question: "Which statements about git revert are true?",
                  explanation: "Revert adds a new inverse commit, preserves history, and is safe for pushed work.",
                  difficulty: "intermediate",
                  multiSelectOptions: [
                    { text: "Creates a new commit that undoes changes", isCorrect: true },
                    { text: "Rewrites the existing commit history", isCorrect: false },
                    { text: "Is safe to use on pushed commits", isCorrect: true },
                    { text: "Deletes the reverted commit entirely", isCorrect: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};