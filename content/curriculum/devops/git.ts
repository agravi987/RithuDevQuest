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
            },
          ],
        },
      ],
    },
  ],
};