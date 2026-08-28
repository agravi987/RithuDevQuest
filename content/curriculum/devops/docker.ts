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
            },
          ],
        },
      ],
    },
  ],
};