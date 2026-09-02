import type { SeedPath } from "@/lib/curriculum/seed";

export const dockerPath: SeedPath = {
  title: "Docker & Containers",
  description:
    "Package, ship, and run applications in isolated containers.",
  slug: "docker",
  modules: [
    {
      title: "Containers 101",
      description: "What containers are and why they matter.",
      slug: "containers-101",
      icon: "Container",
      units: [
        {
          title: "Concepts",
          description: "Images, containers, and the ecosystem.",
          slug: "concepts",
          lessons: [
            {
              title: "What is a Container?",
              description:
                "OS-level virtualization, not a virtual machine.",
              slug: "what-is-a-container",
              estimatedMinutes: 6,
              learningObjectives: [
                "Contrast containers with virtual machines",
                "Explain namespace and cgroup isolation",
                "List reasons teams adopt containers",
              ],
              skills: [
                { name: "container-awareness", description: "Understand container fundamentals" },
              ],
              activities: [
                {
                  title: "Shared Kernel",
                  body: "A container shares the host kernel but isolates processes, filesystem, network, and resources using Linux **namespaces** and **cgroups**. A VM virtualizes hardware and boots a full OS; a container just runs a process group in a sandbox.",
                },
                {
                  title: "Why Containers",
                  body: "Reproducible builds, fast startup, immutability, and portability from laptop to cloud. This is the unit the whole DevOps toolchain is built on.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How does a container differ from a VM?",
                  options: ["Containers virtualize hardware","Containers share host kernel, VMs run full OS","Identical","VMs are lighter"],
                  correctAnswer: "Containers share host kernel, VMs run full OS",
                  explanation: "Containers use namespaces and cgroups while sharing the kernel.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Containers use Linux namespaces and cgroups for isolation.",
                  correctAnswer: "true",
                  explanation: "Namespaces isolate processes, cgroups limit resources.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that runs the hello-world container.",
                  correctAnswer: "docker run hello-world",
                  explanation: "docker run pulls and executes the image.",
                },
                {
                  type: "multi_select",
                  question: "Which characteristics are true of Linux containers?",
                  explanation: "Containers share the host OS kernel and use namespaces and cgroups for process and resource isolation.",
                  difficulty: "beginner",
                  hint: "Think about what containers virtualize versus what VMs virtualize.",
                  multiSelectOptions: [
                    { text: "Each container runs its own full operating system", isCorrect: false },
                    { text: "Containers share the host kernel", isCorrect: true },
                    { text: "Cgroups limit CPU and memory usage per container", isCorrect: true },
                    { text: "Containers boot their own BIOS", isCorrect: false },
                  ],
                },
              ],
            },
            {
              title: "Images vs Containers",
              description:
                "The blueprint and the running instance.",
              slug: "images-vs-containers",
              estimatedMinutes: 6,
              learningObjectives: [
                "Define a container image",
                "Explain the image → container relationship",
                "Describe layers in an image",
              ],
              skills: [
                { name: "image-concept", description: "Distinguish images from containers" },
              ],
              activities: [
                {
                  title: "Like Classes and Objects",
                  body: "An **image** is an immutable snapshot: a stack of read-only layers plus a command to run. A **container** is a running instance of that image, adding a thin writable layer. Pulling images is cheap when layers are shared."
                },
                {
                  title: "Check Yourself",
                  body: "`docker images` lists blueprints; `docker ps` lists running instances.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a container image?",
                  options: ["A running container","An immutable snapshot with layers","A Dockerfile","A VM disk"],
                  correctAnswer: "An immutable snapshot with layers",
                  explanation: "An image is layers plus a command. A container is a running instance.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that lists all local Docker images.",
                  correctAnswer: "docker images",
                  explanation: "docker images shows all locally stored images.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A container adds a writable layer on top of image layers.",
                  correctAnswer: "true",
                  explanation: "Changes go to the writable layer, not the image.",
                },
                {
                  type: "fill_blank",
                  question: "Complete the command that lists all local Docker images.",
                  explanation: "The docker images command displays all locally stored Docker images with their tags, IDs, and sizes.",
                  difficulty: "beginner",
                  hint: "The subcommand is the plural of 'image'.",
                  fillBlanks: [
                    { answer: "docker images" },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "First Container",
          description: "Run your first container end to end.",
          slug: "first-container",
          lessons: [
            {
              title: "docker run",
              description: "From image to running process.",
              slug: "docker-run",
              estimatedMinutes: 7,
              learningObjectives: [
                "Run a container with docker run",
                "Use --rm, -it, and --name",
                "Inspect with docker ps and docker logs",
              ],
              skills: [
                { name: "docker-run", description: "Run and interact with containers" },
              ],
              activities: [
                {
                  title: "Your First Container",
                  body: "`docker run hello-world` pulls and runs a tiny image that prints a message. `docker run -it ubuntu bash` gives you an interactive shell. `--rm` auto-deletes the container on exit; `--name` gives it a memorable label.",
                },
                {
                  title: "Watch It",
                  body: "`docker ps` lists running containers, `docker ps -a` includes stopped ones, and `docker logs <name>` prints the container's output.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does --rm do in docker run?",
                  options: ["Runs as root","Auto-deletes on exit","Mounts volume","Publishes port"],
                  correctAnswer: "Auto-deletes on exit",
                  explanation: "--rm removes the container automatically when it stops.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that runs interactive Ubuntu with bash.",
                  correctAnswer: "docker run -it ubuntu bash",
                  explanation: "-i keeps stdin open, -t allocates a pseudo-TTY.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "docker ps -a shows both running and stopped containers.",
                  correctAnswer: "true",
                  explanation: "ps shows running only. -a includes stopped containers.",
                },
                {
                  type: "match",
                  question: "Match each docker run flag to its function.",
                  explanation: "--rm auto-removes the container on exit, -i keeps stdin open, -t allocates a pseudo-TTY, and --name assigns a custom label.",
                  difficulty: "beginner",
                  hint: "The -it flags are often used together for interactive sessions.",
                  matchPairs: [
                    { left: "--rm", right: "Auto-remove on exit" },
                    { left: "-i", right: "Keep stdin open" },
                    { left: "-t", right: "Allocate pseudo-TTY" },
                    { left: "--name", right: "Assign container name" },
                  ],
                },
              ],
            },
            {
              title: "Lifecycle Commands",
              description: "stop, start, restart, and remove.",
              slug: "lifecycle",
              estimatedMinutes: 5,
              learningObjectives: [
                "Stop and start containers",
                "Remove containers and images",
                "Read container status correctly",
              ],
              skills: [
                { name: "docker-lifecycle", description: "Manage the container lifecycle" },
              ],
              activities: [
                {
                  title: "Control",
                  body: "`docker stop <name>` sends SIGTERM (graceful), `docker start` restarts a stopped container, `docker restart` phases it. `docker rm` deletes a container; `docker rmi` deletes an image. Use `-f` only when a container ignores SIGTERM.",
                },
                {
                  title: "Example",
                  body: "`docker stop my-app && docker rm my-app && docker rmi my-app:latest` cleans the slate completely.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What signal does docker stop send by default?",
                  options: ["SIGKILL","SIGTERM","SIGHUP","SIGINT"],
                  correctAnswer: "SIGTERM",
                  explanation: "docker stop sends SIGTERM for graceful shutdown.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that stops and removes container my-app.",
                  correctAnswer: "docker stop my-app && docker rm my-app",
                  explanation: "stop gracefully stops, rm deletes the container.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "docker rmi deletes a Docker image.",
                  correctAnswer: "true",
                  explanation: "docker rmi removes images. docker rm removes containers.",
                },
                {
                  type: "sequence",
                  question: "Arrange the container states in the correct lifecycle order.",
                  explanation: "A container is created, started, runs, stopped, and can be restarted or removed. This lifecycle governs how Docker manages containers.",
                  difficulty: "beginner",
                  hint: "Think about what happens when you first run a container.",
                  sequenceItems: [
                    { id: "stopped", text: "Stopped" },
                    { id: "created", text: "Created" },
                    { id: "running", text: "Running" },
                    { id: "removed", text: "Removed" },
                  ],
                  sequenceCorrectOrder: ["created", "running", "stopped", "removed"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Images",
      description: "Build and share custom images.",
      slug: "images",
      icon: "Package",
      units: [
        {
          title: "Dockerfiles",
          description: "Describe your image as code.",
          slug: "dockerfiles",
          lessons: [
            {
              title: "Dockerfile Essentials",
              description: "FROM, RUN, COPY, CMD.",
              slug: "dockerfile-essentials",
              estimatedMinutes: 8,
              learningObjectives: [
                "Write a minimal, sensible Dockerfile",
                "Use FROM, RUN, COPY, and CMD correctly",
                "Explain build context and layers",
              ],
              skills: [
                { name: "dockerfile", description: "Author Dockerfiles" },
              ],
              activities: [
                {
                  title: "The Recipe",
                  body: "`FROM node:20-alpine` picks a base, `RUN` executes build commands, `COPY` brings local files in, and `CMD` sets the default command. Every `RUN`/`COPY` creates a cached layer — order instructions from least to most frequently changing to maximize cache hits.",
                },
                {
                  title: "Minimal Example",
                  body: "```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD [\"node\", \"server.js\"]\n```"
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which instruction sets the base image?",
                  options: ["RUN","FROM","COPY","CMD"],
                  correctAnswer: "FROM",
                  explanation: "FROM specifies the base image for the Dockerfile.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Every RUN and COPY creates a cached layer.",
                  correctAnswer: "true",
                  explanation: "Each instruction creates a layer. Cached layers are reused.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question: "Type the command that builds image myapp:v1.",
                  correctAnswer: "docker build -t myapp:v1 .",
                  explanation: "docker build uses current dir as context, -t tags the image.",
                },
                {
                  type: "sequence",
                  question: "Put these Dockerfile instructions in the typical recommended order.",
                  explanation: "Start with FROM, set the working directory, copy dependency files first for better caching, install dependencies, then copy application code.",
                  difficulty: "intermediate",
                  hint: "Consider which instructions change frequently and cache layer reuse.",
                  sequenceItems: [
                    { id: "copy-code", text: "COPY . ." },
                    { id: "run-install", text: "RUN npm ci" },
                    { id: "workdir", text: "WORKDIR /app" },
                    { id: "copy-deps", text: "COPY package*.json ./" },
                    { id: "from", text: "FROM node:20-alpine" },
                  ],
                  sequenceCorrectOrder: ["from", "workdir", "copy-deps", "run-install", "copy-code"],
                },
              ],
            },
            {
              title: "Building Images",
              description: "docker build, tags, and context.",
              slug: "building-images",
              estimatedMinutes: 7,
              learningObjectives: [
                "Build an image with docker build",
                "Tag images with name:version",
                "Explain the build context",
              ],
              skills: [
                { name: "docker-build", description: "Build and tag images" },
              ],
              activities: [
                {
                  title: "Build It",
                  body: "`docker build -t myapp:v1 .` builds from the current directory as the build **context** (the set of files COPY can see). Tag with `name:version`. Rebuilds reuse cached layers when inputs didn't change.",
                },
                {
                  title: "Also Consider",
                  body: "A `.dockerignore` mirrors `.gitignore` to keep secrets and large files out of the context.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the build context?",
                  options: ["Dockerfile location","Files sent to Docker daemon","Base image","Output image"],
                  correctAnswer: "Files sent to Docker daemon",
                  explanation: "The build context is the directory sent to the daemon for COPY/ADD.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that builds and tags webapp:latest.",
                  correctAnswer: "docker build -t webapp:latest .",
                  explanation: "-t sets the tag, . is the build context.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: ".dockerignore excludes files from the build context.",
                  correctAnswer: "true",
                  explanation: ".dockerignore works like .gitignore for the build context.",
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this term: the set of files sent to the Docker daemon during a build.",
                  explanation: "The build context is the directory tree sent to the daemon, which COPY and ADD instructions can access.",
                  difficulty: "beginner",
                  hint: "Think about what directory you specify as the last argument to docker build.",
                  scrambledWord: "context",
                },
              ],
            },
          ],
        },
        {
          title: "Registry",
          description: "Docker Hub and private registries.",
          slug: "registry",
          lessons: [
            {
              title: "Push and Pull",
              description: "Share images through registries.",
              slug: "push-pull",
              estimatedMinutes: 6,
              learningObjectives: [
                "Pull an image with docker pull",
                "Push an image with docker push",
                "Understand image tags and digests",
              ],
              skills: [
                { name: "container-registry", description: "Distribute images" },
              ],
              activities: [
                {
                  title: "Distribution",
                  body: "`docker pull nginx:stable` fetches an image; `docker push myuser/myapp:latest` uploads it after `docker login`. Tags move; a **digest** (sha256) pins the exact content — always reference digests for reproducible deploys.",
                },
                {
                  title: "CI/CD",
                  body: "Pipelines build, tag, and push automatically; deployments then `pull` the pinned digest.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a Docker image digest?",
                  options: ["Human-readable name","Content-addressable sha256 hash","Version number","Size estimate"],
                  correctAnswer: "Content-addressable sha256 hash",
                  explanation: "A digest uniquely identifies image content for reproducible deploys.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that pulls nginx:stable.",
                  correctAnswer: "docker pull nginx:stable",
                  explanation: "docker pull downloads the image from the registry.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "You must run docker login before pushing.",
                  correctAnswer: "true",
                  explanation: "docker login authenticates with the registry.",
                },
                {
                  type: "fill_blank",
                  question: "Complete the command that pushes image myuser/myapp:latest to Docker Hub.",
                  explanation: "After docker login, docker push uploads a tagged image to the remote registry so others can pull it.",
                  difficulty: "beginner",
                  hint: "The subcommand is the opposite of pull.",
                  fillBlanks: [
                    { answer: "docker push myuser/myapp:latest" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Volumes",
      description: "Persistent data in a containerized world.",
      slug: "volumes",
      icon: "HardDrive",
      units: [
        {
          title: "Persistence",
          description: "Named volumes and bind mounts.",
          slug: "persistence",
          lessons: [
            {
              title: "Named Volumes",
              description: "Let Docker manage your storage.",
              slug: "named-volumes",
              estimatedMinutes: 7,
              learningObjectives: [
                "Create and mount named volumes",
                "Explain where Docker stores volume data",
                "Inspect volumes with docker volume",
              ],
              skills: [
                { name: "docker-volumes", description: "Persist data with named volumes" },
              ],
              activities: [
                {
                  title: "Surviving Restarts",
                  body: "Container filesystems disappear with the container. A **named volume** (`-v mydata:/data`) is managed by Docker and survives container removal. `docker volume create mydata` or just let `-v name:path` create it. The physical data lives under `/var/lib/docker/volumes/` on the host.",
                },
                {
                  title: "Example",
                  body: "`docker run -d -v pgdata:/var/lib/postgresql/data postgres:16` — the database outlives every restart.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Where does Docker store named volume data?",
                  options: ["Container writable layer","/var/lib/docker/volumes/ on host","Image layers","Dockerfile"],
                  correctAnswer: "/var/lib/docker/volumes/ on host",
                  explanation: "Named volumes are Docker-managed on the host filesystem.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that runs postgres with named volume pgdata.",
                  correctAnswer: "docker run -v pgdata:/var/lib/postgresql/data postgres:16",
                  explanation: "-v name:/path creates a named volume.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Container filesystems are ephemeral.",
                  correctAnswer: "true",
                  explanation: "Without volumes, data is lost when the container is removed.",
                },
                {
                  type: "match",
                  question: "Match each Docker storage concept to its description.",
                  explanation: "Named volumes are Docker-managed and persist after removal, bind mounts map a host path directly, and the -v flag is used to create both types.",
                  difficulty: "beginner",
                  hint: "Think about who manages the storage location in each case.",
                  matchPairs: [
                    { left: "Named volume", right: "Docker-managed persistent storage" },
                    { left: "Bind mount", right: "Direct host directory mapping" },
                    { left: "-v flag", right: "Creates both volumes and bind mounts" },
                    { left: "Container layer", right: "Ephemeral writable storage" },
                  ],
                },
              ],
            },
            {
              title: "Bind Mounts",
              description: "Map host directories into the container.",
              slug: "bind-mounts",
              estimatedMinutes: 6,
              learningObjectives: [
                "Mount a host path into a container",
                "Compare bind mounts to named volumes",
                "Use :ro for read-only mounts",
              ],
              skills: [
                { name: "bind-mounts", description: "Share host directories with containers" },
              ],
              activities: [
                {
                  title: "The Dev Loop",
                  body: "`-v $(pwd):/app` mounts your working directory into the container as `/app` — edits on the host appear instantly inside. Add `:ro` (`-v $(pwd):/app:ro`) to protect the view. Great for development, awkward for production (host-coupling).",
                },
                {
                  title: "Choose Wisely",
                  body: "Bind mount = direct host path; named volume = Docker-managed location. Prefer named volumes for data, bind mounts for config and hot-reload.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does -v $(pwd):/app do?",
                  options: ["Creates named volume","Mounts current dir into container at /app","Copies files","Sets env var"],
                  correctAnswer: "Mounts current dir into container at /app",
                  explanation: "Bind mounts map a host path directly into the container.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question: "Type the command that bind-mounts current dir read-only.",
                  correctAnswer: "docker run -v $(pwd):/app:ro myimage",
                  explanation: ":ro makes the mount read-only inside the container.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Named volumes are preferred over bind mounts for production data.",
                  correctAnswer: "true",
                  explanation: "Named volumes are Docker-managed and better for persistent data.",
                },
                {
                  type: "multi_select",
                  question: "Which statements about Docker bind mounts are true?",
                  explanation: "Bind mounts map host paths directly into the container, are ideal for development with hot-reload, and support read-only mode with the :ro suffix.",
                  difficulty: "intermediate",
                  hint: "Consider how bind mounts differ from named volumes in terms of management.",
                  multiSelectOptions: [
                    { text: "They map a host directory directly into the container", isCorrect: true },
                    { text: "They are ideal for development with live code reload", isCorrect: true },
                    { text: "They support read-only mode using the :ro suffix", isCorrect: true },
                    { text: "Docker fully manages the storage location for you", isCorrect: false },
                  ],
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this term: mapping a host path directly into a container filesystem.",
                  explanation: "A bind mount links a specific host directory to a container path, making host file changes visible inside the container instantly.",
                  difficulty: "beginner",
                  hint: "This is different from a named volume — it's a direct filesystem link.",
                  scrambledWord: "mount",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Networking",
      description: "How containers talk to each other and the world.",
      slug: "networking",
      icon: "Network",
      units: [
        {
          title: "Ports",
          description: "Expose application ports to the host.",
          slug: "ports",
          lessons: [
            {
              title: "Publishing Ports",
              description: "-p maps container to host ports.",
              slug: "publishing-ports",
              estimatedMinutes: 6,
              learningObjectives: [
                "Publish a container port with -p",
                "Understand host:container mapping",
                "Explain the difference between expose and publish",
              ],
              skills: [
                { name: "port-publishing", description: "Expose container ports" },
              ],
              activities: [
                {
                  title: "The Map",
                  body: "`-p 8080:80` publishes: traffic to host port 8080 reaches container port 80. If you omit host port (`-p 80`), Docker chooses an ephemeral one (see `docker ps`). `EXPOSE` in a Dockerfile only documents intent — only `-p` actually publishes.",
                },
                {
                  title: "Why the Translation",
                  body: "Each container has its own network namespace; port mapping is the bridge to the host's network.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does -p 8080:80 do?",
                  options: ["Sets env vars","Maps host 8080 to container 80","Creates network","Mounts volume"],
                  correctAnswer: "Maps host 8080 to container 80",
                  explanation: "-p host:container publishes the container port.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that runs nginx publishing port 3000:80.",
                  correctAnswer: "docker run -p 3000:80 nginx",
                  explanation: "-p 3000:80 maps host 3000 to container 80.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "EXPOSE in a Dockerfile actually publishes the port.",
                  correctAnswer: "false",
                  explanation: "EXPOSE only documents intent. Only -p publishes.",
                },
                {
                  type: "fill_blank",
                  question: "Complete the command to publish host port 9090 mapping to container port 80 for nginx.",
                  explanation: "The -p flag uses host:container format. Traffic to host port 9090 will be forwarded to container port 80.",
                  difficulty: "beginner",
                  hint: "Use the -p flag with host:container syntax.",
                  fillBlanks: [
                    { answer: "docker run -p 9090:80 nginx" },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "Communication",
          description: "Networks and service discovery.",
          slug: "communication",
          lessons: [
            {
              title: "User-Defined Networks",
              description: "Containers talking via DNS names.",
              slug: "custom-networks",
              estimatedMinutes: 7,
              learningObjectives: [
                "Create a bridge network",
                "Attach containers to a network",
                "Use container names as DNS hostnames",
              ],
              skills: [
                { name: "docker-networks", description: "Connect containers on custom networks" },
              ],
              activities: [
                {
                  title: "Internal DNS",
                  body: "`docker network create mynet` creates a bridge network. Run containers with `--network mynet` and they resolve each other by **name** (e.g., `web` reaching `db:5432`). No IP guessing or `--link` needed.",
                },
                {
                  title: "Example",
                  body: "`docker run -d --network mynet --name db postgres:16` then `docker run --network mynet -e DATABASE_URL=postgres://...@db:5432/app myapp`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How do containers communicate on a user-defined network?",
                  options: ["By IP only","By container name (DNS)","By MAC","By port only"],
                  correctAnswer: "By container name (DNS)",
                  explanation: "Docker provides DNS on user-defined networks.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that creates bridge network mynet.",
                  correctAnswer: "docker network create mynet",
                  explanation: "docker network create makes a new bridge network.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Containers on different networks cannot communicate by default.",
                  correctAnswer: "true",
                  explanation: "Network isolation is the default behavior.",
                },
                {
                  type: "match",
                  question: "Match each networking concept to its description.",
                  explanation: "Docker user-defined networks provide automatic DNS resolution, the default bridge network lacks DNS, and EXPOSE only documents intent without publishing.",
                  difficulty: "intermediate",
                  hint: "DNS resolution is a key feature that distinguishes user-defined networks from the default bridge.",
                  matchPairs: [
                    { left: "User-defined bridge", right: "Provides automatic DNS resolution" },
                    { left: "Default bridge", right: "No automatic DNS between containers" },
                    { left: "EXPOSE", right: "Documents intent only, does not publish" },
                    { left: "--network", right: "Attaches a container to a specific network" },
                  ],
                },
                {
                  type: "sequence",
                  question: "Arrange these steps to connect two containers on a custom network.",
                  explanation: "First create the network, then run containers attached to it, and they can communicate by container name.",
                  difficulty: "intermediate",
                  hint: "The network must exist before containers can join it.",
                  sequenceItems: [
                    { id: "connect-db", text: "Run db container with --network mynet" },
                    { id: "create-net", text: "Create mynet with docker network create" },
                    { id: "connect-web", text: "Run web container with --network mynet" },
                    { id: "resolve", text: "Web resolves db by name via DNS" },
                  ],
                  sequenceCorrectOrder: ["create-net", "connect-db", "connect-web", "resolve"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Compose",
      description: "Declare multi-container apps in YAML.",
      slug: "compose",
      icon: "Stack",
      units: [
        {
          title: "Compose Files",
          description: "services, networks, and volumes.",
          slug: "compose-files",
          lessons: [
            {
              title: "docker-compose.yml",
              description: "Declare the whole stack in YAML.",
              slug: "compose-yml",
              estimatedMinutes: 8,
              learningObjectives: [
                "Define services in a compose file",
                "Wire volumes and networks declaratively",
                "Set environment variables per service",
              ],
              skills: [
                { name: "docker-compose", description: "Author compose files" },
              ],
              activities: [
                {
                  title: "The Shape of Compose",
                  body: "A `compose.yaml` holds `services:` (each container), `volumes:` (except named top-level volumes), and `networks:`. Services get environment with `environment:` (or `env_file:`), and health checks keep dependencies honest. Secrets belong in `environment:` only from a vault, never committed."
                },
                {
                  title: "Tiny Example",
                  body: "```yaml\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: devonly\n    ports:\n      - \"5432:5432\"\n```"
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the top-level key for containers in compose?",
                  options: ["containers:","services:","apps:","deploy:"],
                  correctAnswer: "services:",
                  explanation: "services: defines each container in the compose file.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that starts services in background.",
                  correctAnswer: "docker compose up -d",
                  explanation: "docker compose up starts services, -d runs detached.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Compose files should never contain real production secrets.",
                  correctAnswer: "true",
                  explanation: "Compose files are committed to git. Use a secret manager.",
                },
                {
                  type: "multi_select",
                  question: "Which keys can appear at the top level of a docker-compose.yml file?",
                  explanation: "Compose files declare services, volumes, and networks as top-level keys to describe the whole application stack.",
                  difficulty: "beginner",
                  hint: "Think about the main sections a compose file declares.",
                  multiSelectOptions: [
                    { text: "services:", isCorrect: true },
                    { text: "volumes:", isCorrect: true },
                    { text: "networks:", isCorrect: true },
                    { text: "docker:", isCorrect: false },
                  ],
                },
                {
                  type: "fill_blank",
                  question: "Complete the compose key that defines each container in a compose file.",
                  explanation: "The services: top-level key lists every container (service) that makes up the application stack.",
                  difficulty: "beginner",
                  hint: "Each container is called a service in compose terms.",
                  fillBlanks: [
                    { answer: "services" },
                  ],
                },
              ],
            },
            {
              title: "Compose Lifecycle",
              description: "up, down, logs, and ps.",
              slug: "compose-lifecycle",
              estimatedMinutes: 6,
              learningObjectives: [
                "Start the stack with compose up",
                "Stop with down (and -v to wipe volumes)",
                "Stream logs with compose logs -f",
              ],
              skills: [
                { name: "compose-lifecycle", description: "Drive the compose lifecycle" },
              ],
              activities: [
                {
                  title: "Day-to-Day",
                  body: "`docker compose up -d` builds missing images and starts in the background. `docker compose ps` shows status, `docker compose logs -f web` tails a service's logs, and `docker compose down` stops (add `-v` to also delete volumes — data gone).",
                },
                {
                  title: "Rebuilding",
                  body: "After a code change: `docker compose up -d --build web` rebuilds just that service.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does docker compose down -v do?",
                  options: ["Stops only","Stops and removes containers AND volumes","Restarts","Shows status"],
                  correctAnswer: "Stops and removes containers AND volumes",
                  explanation: "-v also removes named volumes, wiping data.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that tails web service logs.",
                  correctAnswer: "docker compose logs -f web",
                  explanation: "-f follows new log lines in real time.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "docker compose up --build rebuilds images.",
                  correctAnswer: "true",
                  explanation: "--build forces a rebuild even with cached layers.",
                },
                {
                  type: "word_scramble",
                  question: "Unscramble this term: the command that stops and removes all compose services.",
                  explanation: "docker compose down stops the stack and can, with -v, also remove associated volumes.",
                  difficulty: "beginner",
                  hint: "This is the opposite of up. It is a three-letter command.",
                  scrambledWord: "down",
                },
                {
                  type: "sequence",
                  question: "Arrange these compose commands in the order you would use them to rebuild just one service after a code change.",
                  explanation: "First rebuild the specific service with --build, start it detached, then verify and inspect its status and logs.",
                  difficulty: "intermediate",
                  hint: "Rebuild happens before bringing the stack up, then you tail logs to confirm.",
                  sequenceItems: [
                    { id: "logs", text: "docker compose logs -f web" },
                    { id: "up", text: "docker compose up -d" },
                    { id: "ps", text: "docker compose ps" },
                    { id: "build", text: "docker compose up -d --build web" },
                  ],
                  sequenceCorrectOrder: ["build", "up", "ps", "logs"],
                },
              ],
            },
          ],
        },
        {
          title: "Config in Production",
          description: "Reusable patterns that age well.",
          slug: "config-prod",
          lessons: [
            {
              title: "Environment-Specific Compose",
              description: "Compose file merging and overrides.",
              slug: "compose-overrides",
              estimatedMinutes: 6,
              learningObjectives: [
                "Merge compose files with -f",
                "Use .env interpolation",
                "Keep secrets out of compose files",
              ],
              skills: [
                { name: "compose-config", description: "Manage compose configuration safely" },
              ],
              activities: [
                {
                  title: "Compose Composition",
                  body: "`docker compose -f compose.yaml -f compose.prod.yaml up` layers files, later values winning. `${VAR:-default}` interpolation reads from the shell or `.env`. Never commit real secrets — use variables sourced from a secret manager.",
                },
                {
                  title: "Prudence",
                  body: "For serious environments, prefer dedicated Kubernetes (this path) for orchestration and keep compose for local/dev cohesion.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "How do you merge compose files?",
                  options: ["Copy-paste","docker compose -f base.yaml -f override.yaml up","docker compose merge","docker compose combine"],
                  correctAnswer: "docker compose -f base.yaml -f override.yaml up",
                  explanation: "Multiple -f flags layer files, later values override.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question: "Type the command that starts with base and production compose files.",
                  correctAnswer: "docker compose -f compose.yaml -f compose.prod.yaml up -d",
                  explanation: "Multiple -f flags merge compose files.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Shell variable interpolation uses ${VAR} syntax.",
                  correctAnswer: "true",
                  explanation: "docker compose reads ${VAR} from shell or .env.",
                },
                {
                  type: "match",
                  question: "Match each compose configuration feature to its purpose.",
                  explanation: "Multiple -f flags merge compose files with later values winning, ${VAR} reads variables from the environment, and compose overrides keep environment-specific config separate from the base file.",
                  difficulty: "intermediate",
                  hint: "Each feature handles a different configuration concern.",
                  matchPairs: [
                    { left: "-f flag", right: "Merges additional compose files" },
                    { left: "${VAR}", right: "Interpolates shell or .env values" },
                    { left: ".env", right: "Stores variables read by interpolation" },
                    { left: "Override file", right: "Environment-specific overrides" },
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