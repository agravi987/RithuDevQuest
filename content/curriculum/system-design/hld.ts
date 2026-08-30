import type { SeedPath } from "@/lib/curriculum/seed";

export const systemDesignHldPath: SeedPath = {
  title: "High-Level Design",
  description:
    "Architecture styles from monolith to event-driven, plus end-to-end design exercises for real products.",
  slug: "system-design-hld",
  modules: [
    {
      title: "Architectures",
      description: "Choosing a system's shape.",
      slug: "architectures",
      icon: "LayoutDashboard",
      units: [
        {
          title: "Styles",
          description: "Monolith, microservices, serverless.",
          slug: "styles",
          lessons: [
            {
              title: "Monolith vs Microservices",
              description: "One process or many?",
              slug: "monolith-microservices",
              estimatedMinutes: 7,
              learningObjectives: [
                "Compare monoliths and microservices",
                "Explain when each fits",
                "Describe the modular monolith",
              ],
              skills: [
                { name: "arch-styles", description: "Choose between monolith and distributed styles" },
              ],
              activities: [
                {
                  title: "One Box or Many",
                  body: "A **monolith** ships as one deployable — simple to build, test, and operate, with shared transactions and no network overhead. **Microservices** split one system into independently deployed services, each owning its data — great for team autonomy and independent scaling, but you pay with distributed transactions, networking, and operational sprawl. The **modular monolith** is the pragmatic middle: modular boundaries inside one deployable, ready to split later.",
                },
                {
                  title: "Example",
                  body: "A startup's first version is a modular monolith in one repo. When a team owns search and needs isolated scaling, only then does search split into a service.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a key operational advantage of a monolith?",
                  options: [
                    "One deployable to build, test, and operate",
                    "Zero code sharing",
                    "No database at all",
                    "Guaranteed infinite scaling",
                  ],
                  correctAnswer: "One deployable to build, test, and operate",
                  explanation:
                    "A monolith is one artifact — simpler CI/CD, debugging, and transactions; scale and team independence trade that away.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Microservices each owning their own data reduces coupling between them.",
                  correctAnswer: "true",
                  explanation:
                    "Per-service databases enforce boundaries so a schema change in one service does not ripple to others.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each architecture style to its trade mark.",
                  matchPairs: [
                    { left: "Monolith", right: "Simplicity, shared transaction" },
                    { left: "Microservices", right: "Independent scale and teams" },
                    { left: "Modular monolith", right: "Boundaries without network cost" },
                    { left: "Serverless", right: "Pay per invocation, no servers" },
                  ],
                  explanation:
                    "Each style trades simplicity, independence, boundaries, or cost for the others.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A single deployable with clear internal modules ready to split later is a ___ monolith.",
                  fillBlanks: [{ answer: "modular" }],
                  explanation:
                    "The modular monolith enforces internal boundaries now so a later split is mechanical.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When do microservices start paying for themselves?",
                  multiSelectOptions: [
                    { text: "Several teams needing independent deploys", isCorrect: true },
                    { text: "Workloads that scale independently", isCorrect: true },
                    { text: "A two-person codebase with one feature", isCorrect: false },
                    { text: "Mixed tech needs per domain", isCorrect: true },
                  ],
                  explanation:
                    "Independent deploys, isolated scaling, and per-domain tech justify the sprawl — small teams rarely benefit.",
                },
              ],
            },
            {
              title: "Event-Driven Architecture",
              description: "Systems that react to facts.",
              slug: "event-driven",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain event-driven systems",
                "Describe events, producers, and consumers",
                "Recognize event-sourcing patterns",
              ],
              skills: [
                { name: "event-driven", description: "Design event-driven systems" },
              ],
              activities: [
                {
                  title: "Facts, Not Commands",
                  body: "**Event-driven architecture** has components react to **events** — immutable facts like 'order placed' — published by **producers** and consumed by many **consumers**. It decouples sides, scales naturally, and gives you an auditable history. Analytics, notifications, and search all subscribe without the producer caring. The complexity moves to ordering, idempotency, and replay.",
                },
                {
                  title: "Example",
                  body: "'order.created' fans out to billing, inventory, emails, and analytics — the checkout never waits on any of them.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is an event in an event-driven system?",
                  options: [
                    "An immutable fact that happened",
                    "A command telling a service what to do",
                    "A database row",
                    "A CSS animation",
                  ],
                  correctAnswer: "An immutable fact that happened",
                  explanation:
                    "Events describe what occurred ('order placed'); commands request action. Events are append-only facts.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Events give independent consumers an integration surface without coupling producers to them.",
                  correctAnswer: "true",
                  explanation:
                    "Publish once, subscribe many times — analytics and emails attach without the producer changing.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order an event-driven integration flow.",
                  sequenceItems: [
                    { id: "action", text: "A business action happens" },
                    { id: "publish", text: "Producer publishes an event" },
                    { id: "store", text: "Event is persisted in the log" },
                    { id: "fanout", text: "Consumers receive the event" },
                    { id: "react", text: "Each consumer reacts independently" },
                  ],
                  sequenceCorrectOrder: ["action", "publish", "store", "fanout", "react"],
                  explanation:
                    "Action → publish → persist → fanout → react. Events are durable, ordered facts.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A pattern where the event log is the system of record and current state is derived from it is event ___.",
                  fillBlanks: [{ answer: "sourcing" }],
                  explanation:
                    "Event sourcing replays the event log to compute state — full auditability, added complexity.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are challenges of event-driven systems?",
                  multiSelectOptions: [
                    { text: "Message ordering across partitions", isCorrect: true },
                    { text: "Guaranteeing consumer idempotency", isCorrect: true },
                    { text: "Replaying logs after schema changes", isCorrect: true },
                    { text: "Having zero eventual consistency", isCorrect: false },
                  ],
                  explanation:
                    "Ordering, idempotency, and schema/versioning of events are the daily costs; eventual consistency is inherent.",
                },
              ],
            },
            {
              title: "Serverless Architectures",
              description: "Functions as the building blocks.",
              slug: "serverless-arch",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain function-based design",
                "Describe event triggers and state",
                "Identify serverless fit",
              ],
              skills: [
                { name: "serverless", description: "Design with serverless functions" },
              ],
              activities: [
                {
                  title: "Compose Functions",
                  body: "**Serverless** architectures compose single-purpose **functions** invoked by **events** — HTTP requests, queue messages, file uploads, schedules. Each function is small, scaled to zero, and billed per execution. Sweet spots are **event processing, bursty APIs, and glue** between services. The constraints: cold starts, function duration limits, and statelessness — persist state in external stores.",
                },
                {
                  title: "Example",
                  body: "An image pipeline: upload to a bucket → function resizes → writes thumbnails → emits events → a reporter counts stats.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What triggers a serverless function?",
                  options: [
                    "Events like HTTP requests, queues, or schedules",
                    "Manually installing it on a server",
                    "The CPU reaching 100% on hardware",
                    "A user restarting the browser",
                  ],
                  correctAnswer: "Events like HTTP requests, queues, or schedules",
                  explanation:
                    "Functions fire on events — HTTP, messages, uploads, cron — and scale with that event load.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Serverless functions are stateless, so durable state belongs in external stores.",
                  correctAnswer: "true",
                  explanation:
                    "Functions are ephemeral; anything persistent lives in databases, object storage, or queues.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each event source to a typical use.",
                  matchPairs: [
                    { left: "HTTP trigger", right: "Small API endpoint" },
                    { left: "Queue consumer", right: "Resize/decode workloads" },
                    { left: "Object upload", right: "Pipeline kickoffs" },
                    { left: "Schedule", right: "Cron maintenance" },
                  ],
                  explanation:
                    "HTTP serves APIs, queues absorb batch work, uploads start pipelines, and schedules run periodic jobs.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The delay before a scaled-to-zero function handles its first request is a ___ start.",
                  fillBlanks: [{ answer: "cold" }],
                  explanation:
                    "Cold starts occur when no warm instance exists — the latency to trade against pay-per-use savings.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which workloads fit serverless poorly?",
                  multiSelectOptions: [
                    { text: "Long-running stateful worker streams", isCorrect: true },
                    { text: "Sparse unpredictable APIs", isCorrect: false },
                    { text: "Jobs exceeding function time limits", isCorrect: true },
                    { text: "Bursty short-lived events", isCorrect: false },
                  ],
                  explanation:
                    "Stateful, long-running, over-limit jobs fight serverless; short bursty work loves it.",
                },
              ],
            },
          ],
        },
        {
          title: "Case Studies",
          description: "Designing real products.",
          slug: "case-studies",
          lessons: [
            {
              title: "URL Shortener",
              description: "A classic first design problem.",
              slug: "url-shortener",
              estimatedMinutes: 7,
              learningObjectives: [
                "Structure the write and read paths",
                "Design short IDs and redirects",
                "Size cache and storage",
              ],
              skills: [
                { name: "shortener", description: "Design a URL shortening service" },
              ],
              activities: [
                {
                  title: "Redirect at Scale",
                  body: "A **URL shortener** has a write path (shorten: generate a unique short ID, store the mapping) and a hot read path (redirect: look up the ID → 301/302 to the target). Short IDs come from counters or base62-encoding. Reads dominate 100:1, so the lookup table is cached heavily (Redis) in front of a database — a perfect cache-aside workload.",
                },
                {
                  title: "Example",
                  body: "POST /shorten {url} → id `aB3` stored as aB3 → target. GET /aB3 hits Redis; a miss reads the DB, re-primes, and redirects. 301 for permanent, 302 when tracking click counts.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is the hotter path in a URL shortener?",
                  options: [
                    "Reads (redirects), usually far more than writes",
                    "Writes (shortening), most traffic is new URLs",
                    "They are always equal",
                    "Neither matters",
                  ],
                  correctAnswer: "Reads (redirects), usually far more than writes",
                  explanation:
                    "Shortened links get clicked constantly while they are created once — reads dwarf writes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Caching the ID→target map in front of the database is the key scaling move.",
                  correctAnswer: "true",
                  explanation:
                    "The redirect path is a key-value read; a cache handles the skewed read load cheaply.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the redirect path for a short link.",
                  sequenceItems: [
                    { id: "request", text: "GET /aB3 arrives" },
                    { id: "cache", text: "Lookup hits the cache" },
                    { id: "miss", text: "On a miss, query the database" },
                    { id: "prime", text: "Database result re-primes the cache" },
                    { id: "redirect", text: "301/302 redirects the client" },
                  ],
                  sequenceCorrectOrder: ["request", "cache", "miss", "prime", "redirect"],
                  explanation:
                    "Request → cache hit (or miss → DB → re-prime) → redirect. Cache-aside at its cleanest.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A permanent redirect uses status ___; a temporary one for click tracking uses 302.",
                  fillBlanks: [{ answer: "301" }],
                  explanation:
                    "301 permanently redirects; 302 temporarily — SEO and tracking teams care about the difference.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which design choices fit a large shortener?",
                  multiSelectOptions: [
                    { text: "Base62-encoded short IDs from a counter", isCorrect: true },
                    { text: "Cache the hot redirect table", isCorrect: true },
                    { text: "Regenerate an ID on every click", isCorrect: false },
                    { text: "Shard the mapping by the short ID", isCorrect: true },
                  ],
                  explanation:
                    "Encoded IDs, caching, and ID-sharding scale the read path; IDs must be stable after creation.",
                },
              ],
            },
            {
              title: "Chat App",
              description: "Real-time messaging end to end.",
              slug: "chat-app",
              estimatedMinutes: 7,
              learningObjectives: [
                "Model conversations and messages",
                "Explain push, polling, and offline delivery",
                "Design the read and unread paths",
              ],
              skills: [
                { name: "chat-app", description: "Design a real-time chat service" },
              ],
              activities: [
                {
                  title: "Send, Store, Deliver",
                  body: "A chat app has a **write path** (store the message), a **fan-out path** (deliver to every member), and a **read path** (history + unread counts). Delivery uses **persistent connections** (WebSocket) for push plus HTTP polling for recovery. Messages are stored per-conversation and paginated; unread counts come from a per-user last-seen cursor. Offline users get queued delivery — messages wait, then arrive on reconnect.",
                },
                {
                  title: "Example",
                  body: "Alice texts Bob: the message row is saved, pushed over sockets to both — Bob is offline so it is queued — and Bob reconnects, receives the message, and the unread badge recalculates from his last-seen cursor.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is the usual push mechanism for live chat?",
                  options: [
                    "Persistent connections like WebSockets",
                    "Weekly email digests",
                    "Batch text file sync",
                    "USB transfer",
                  ],
                  correctAnswer: "Persistent connections like WebSockets",
                  explanation:
                    "WebSockets keep a long-lived connection, letting the server push messages the instant they arrive.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Offline delivery works by queueing messages and pushing them on reconnect.",
                  correctAnswer: "true",
                  explanation:
                    "Messages wait in a per-device/presence system and flush to the user when they come back online.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order Alice's message reaching Bob when Bob is offline.",
                  sequenceItems: [
                    { id: "send", text: "Alice sends a message" },
                    { id: "store", text: "Server stores the message" },
                    { id: "push", text: "Server tries to push it" },
                    { id: "queue", text: "Bob is offline, so it is queued" },
                    { id: "deliver", text: "Bob reconnects and receives it" },
                  ],
                  sequenceCorrectOrder: ["send", "store", "push", "queue", "deliver"],
                  explanation:
                    "Send → store → push attempt → queue on offline → deliver on reconnect.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Per-user unread counts are usually derived from a last-___ cursor.",
                  fillBlanks: [{ answer: "seen" }],
                  explanation:
                    "The read state (last seen message id) powers badges without per-message flags.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which pieces belong in a chat architecture?",
                  multiSelectOptions: [
                    { text: "A socket/connection service for presence", isCorrect: true },
                    { text: "Message storage with pagination", isCorrect: true },
                    { text: "A queue for offline delivery", isCorrect: true },
                    { text: "Storing all messages in browser RAM only", isCorrect: false },
                  ],
                  explanation:
                    "Connections, persistent message storage, and offline queues are the core; browser-only RAM would lose everything.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};