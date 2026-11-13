import type { SeedPath } from "@/lib/curriculum/seed";

export const systemDesignFoundationsPath: SeedPath = {
  title: "System Design Foundations",
  description:
    "The building blocks — clients, servers, APIs, databases, caching — and the trade-offs like consistency vs availability that define every architecture.",
  slug: "system-design-foundations",
  modules: [
    {
      title: "Building Blocks",
      description: "The components every system is made of.",
      slug: "building-blocks",
      icon: "Blocks",
      units: [
        {
          title: "Core Components",
          description: "Clients, servers, APIs, and storage.",
          slug: "core-components",
          lessons: [
            {
              title: "Clients & Servers",
              description: "The request/response base of everything.",
              slug: "clients-servers",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the client/server model",
                "Distinguish web, API, and database tiers",
                "Trace a request through the tiers",
              ],
              skills: [
                { name: "client-server", description: "Reason about layered request flows" },
              ],
              activities: [
                {
                  title: "The Same Shape at Every Scale",
                  body: "Almost every system is a stack of **clients** and **servers**: a browser (client) calls a web API (server); that API calls a database (another server). Each hop is a request/response. The same mental model holds whether a service is a laptop app or a fleet behind a load balancer — clients ask, servers answer, and data tiers sit underneath.",
                },
                {
                  title: "Example",
                  body: "A checkout flow: browser → POST /orders on the API → the API inserts into the orders table → returns 201. Three tiers, one logical request.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "In the client/server model, what does a server do?",
                  options: [
                    "Listens for requests and returns responses",
                    "Only renders HTML",
                    "Stores everything in RAM only",
                    "Never touches the network",
                  ],
                  correctAnswer: "Listens for requests and returns responses",
                  explanation:
                    "Servers expose capabilities and answer clients; clients initiate the conversation.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "The same request/response pattern holds at every tier of a system, not just at the browser.",
                  correctAnswer: "true",
                  explanation:
                    "App-to-API and API-to-database hops are all request/response — the model recurses.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order a typical request through a three-tier app.",
                  sequenceItems: [
                    { id: "browser", text: "Browser issues a request" },
                    { id: "api", text: "API server handles it" },
                    { id: "query", text: "API queries the database" },
                    { id: "data", text: "Database returns rows" },
                    { id: "render", text: "API responds and browser renders" },
                  ],
                  sequenceCorrectOrder: ["browser", "api", "query", "data", "render"],
                  explanation:
                    "Browser → API → query → data back → response. Three tiers, cleanly layered.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each tier to its responsibility.",
                  matchPairs: [
                    { left: "Client", right: "Initiate and display" },
                    { left: "API server", right: "Business logic and orchestration" },
                    { left: "Database", right: "Persistent storage" },
                    { left: "Load balancer", right: "Distribute requests" },
                  ],
                  explanation:
                    "Clients ask, APIs orchestrate, databases persist, and balancers spread the load.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "In a request/response exchange, the component that initiates the request is called the ___.",
                  fillBlanks: [{ answer: "client" }],
                  explanation:
                    "Clients initiate requests; servers listen and return responses. The browser is the client in the classic web stack.",
                },
              ],
            },
            {
              title: "Databases 101",
              description: "SQL vs NoSQL, and why it matters.",
              slug: "databases-101",
              estimatedMinutes: 7,
              learningObjectives: [
                "Compare SQL and NoSQL databases",
                "Choose between them for a workload",
                "Explain read-heavy vs write-heavy patterns",
              ],
              skills: [
                { name: "db-selection", description: "Choose databases for workloads" },
              ],
              activities: [
                {
                  title: "Rows, Documents, and Graphs",
                  body: "**SQL** databases store structured rows in tables with enforced schemas and powerful **joins** — great for money, relationships, and reporting. **NoSQL** (document, key-value, wide-column) trades joins for flexibility and horizontal scale — great for sessions, high write rates, and evolving schemas. The classic cheat: relational integrity needs SQL; scale-out simplicity and flexible documents need NoSQL.",
                },
                {
                  title: "Example",
                  body: "Orders + transactions → PostgreSQL. Fast per-user session lookups or click streams → Redis, DynamoDB, or MongoDB. The choice depends on queries you need, not the brand.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is a strength of relational (SQL) databases?",
                  options: [
                    "Serving and joining related data across tables",
                    "Rejecting new tables forever",
                    "Never needing an index",
                    "Scaling write-only workloads automatically",
                  ],
                  correctAnswer: "Serving and joining related data across tables",
                  explanation:
                    "SQL's joins, constraints, and transactions excel at related structured data.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "NoSQL databases generally offer more flexible schemas and simpler horizontal scaling than SQL.",
                  correctAnswer: "true",
                  explanation:
                    "NoSQL's schemaless documents and key-based models make distributed scaling simpler, at the cost of joins.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each workload to the better fit.",
                  matchPairs: [
                    { left: "Money ledger with joins", right: "SQL" },
                    { left: "High-write session store", right: "NoSQL key-value" },
                    { left: "Evolving document schema", right: "NoSQL document" },
                    { left: "Complex analytical reporting", right: "SQL warehouse" },
                  ],
                  explanation:
                    "Transactional joins, high-write keys, evolving docs, and analytics each favor a different family.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A database that stores rows in tables with enforced schemas is called a ___ database.",
                  fillBlanks: [{ answer: "relational" }],
                  explanation:
                    "Relational (SQL) databases structure data as related tables with constraints.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When is NoSQL a sensible choice?",
                  multiSelectOptions: [
                    { text: "Extremely high write throughput", isCorrect: true },
                    { text: "Schema changes often and fast", isCorrect: true },
                    { text: "Heavy multi-entity relational queries", isCorrect: false },
                    { text: "Simple key-lookup access patterns", isCorrect: true },
                  ],
                  explanation:
                    "High writes, flexible schemas, and key lookups favor NoSQL; deep relational joins favor SQL.",
                },
              ],
            },
            {
              title: "Caching",
              description: "Storing hot data close to the caller.",
              slug: "caching",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain cache read and write patterns",
                "Describe TTL and eviction",
                "Choose cache locations by problem",
              ],
              skills: [
                { name: "caching", description: "Design and reason about caches" },
              ],
              activities: [
                {
                  title: "Nearby Copies",
                  body: "A **cache** stores frequently used results so a repeat request skips the slow upstream (database, API). **Cache-aside** is the common pattern: read cache → miss → read source → write cache with a **TTL**. **Write-through** updates cache + source together. TTLs and eviction (LRU) bound staleness and size. Cache everything you can afford to serve slightly stale.",
                },
                {
                  title: "Example",
                  body: "A product page: cache the DB row in Redis for 60s with key products:42. Reads hit Redis; writes invalidate or update the key.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "In cache-aside, what happens on a cache miss?",
                  options: [
                    "Read the source, store a copy in cache",
                    "Return an error",
                    "Quit the process",
                    "Purge the entire cache",
                  ],
                  correctAnswer: "Read the source, store a copy in cache",
                  explanation:
                    "On a miss you fetch from the source of truth, prime the cache, and serve the value.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A TTL bounds how stale cache data can become.",
                  correctAnswer: "true",
                  explanation:
                    "Time-to-live expires cached entries, capping how long data may be out of date.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a cache-aside read that misses.",
                  sequenceItems: [
                    { id: "request", text: "Request arrives for the key" },
                    { id: "lookup", text: "Cache lookup misses" },
                    { id: "fetch", text: "Source of truth is queried" },
                    { id: "prime", text: "Cache is populated with TTL" },
                    { id: "serve", text: "Value is returned to the caller" },
                  ],
                  sequenceCorrectOrder: ["request", "lookup", "fetch", "prime", "serve"],
                  explanation:
                    "Request → miss → fetch source → prime cache → serve. Next reads hit the cache.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The policy that evicts the least-recently-used entry is called ___.",
                  fillBlanks: [{ answer: "LRU" }],
                  explanation:
                    "LRU (least recently used) eviction drops the entry nothing touched recently.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are real caching hazards?",
                  multiSelectOptions: [
                    { text: "Serving stale data after a write", isCorrect: true },
                    { text: "Cache stampede on mass expiry", isCorrect: true },
                    { text: "Caching everything that's cheap to recompute", isCorrect: false },
                    { text: "Unbounded cache growth", isCorrect: true },
                  ],
                  explanation:
                    "Staleness, stampede, and unbounded growth are the hazards; caching hot-but-cheap values adds little.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each placement to its typical role.",
                  matchPairs: [
                    { left: "Browser cache", right: "Saves network round trips" },
                    { left: "CDN", right: "Static assets near users" },
                    { left: "In-memory cache", right: "Hot DB reads" },
                    { left: "Query cache", right: "Repeated expensive queries" },
                  ],
                  explanation:
                    "Browser/CDN cut network travel; in-memory and query caches cut backend work.",
                },
              ],
            },
          ],
        },
        {
          title: "APIs & Services",
          description: "How services talk to each other.",
          slug: "apis-services",
          lessons: [
            {
              title: "APIs at Scale",
              description: "Designing interfaces between systems.",
              slug: "apis-at-scale",
              estimatedMinutes: 6,
              learningObjectives: [
                "Distinguish REST from message-based calls",
                "Explain versioning",
                "Design interfaces before implementations",
              ],
              skills: [
                { name: "api-design", description: "Design stable service interfaces" },
              ],
              activities: [
                {
                  title: "Contracts First",
                  body: "A service's **API is its contract**. REST encourages noun-plus-verb resources; plenty of systems also use **events** and message queues (post a fact, let millions subscribe). **Versioning** (`/v1/users`) protects consumers when the contract evolves. The interface (what it accepts and returns) should be decided before the internals — that is the difference between APIs that survive and ones that churn.",
                },
                {
                  title: "Example",
                  body: "The catalog service exposes GET /v1/products/:id. Versioning means a breaking v2 can ship without breaking the mobile app stuck on v1.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the main benefit of versioned APIs?",
                  options: [
                    "Consumers can upgrade on their own schedule",
                    "Servers get faster",
                    "Databases need no indexes",
                    "Versioning removes rate limits",
                  ],
                  correctAnswer: "Consumers can upgrade on their own schedule",
                  explanation:
                    "Versioning decouples releases: breaking changes land in a new version while old consumers keep working.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Designing the API contract before implementation is a sound practice.",
                  correctAnswer: "true",
                  explanation:
                    "The contract is the surface your consumers depend on — design it before building the internals.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each API style to its flavor.",
                  matchPairs: [
                    { left: "REST", right: "Nouns + verbs over HTTP" },
                    { left: "Events / queues", right: "Publish and subscribe" },
                    { left: "gRPC", right: "Typed binary protocol" },
                    { left: "Webhooks", right: "Push via callbacks" },
                  ],
                  explanation:
                    "REST is request/response, events are fire-and-forget, gRPC is typed and binary, webhooks push results.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "PUT under a version prefix like /v1/ is a way to ___ gracefully.",
                  fillBlanks: [{ answer: "version" }],
                  explanation:
                    "Prefixing routes by version lets you evolve an API without breaking existing consumers.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which make an API stable and approachable?",
                  multiSelectOptions: [
                    { text: "Clear resource naming", isCorrect: true },
                    { text: "Backwards-compatible changes by default", isCorrect: true },
                    { text: "Silently breaking shape changes", isCorrect: false },
                    { text: "Descriptive error payloads", isCorrect: true },
                  ],
                  explanation:
                    "Consistent naming, compatibility, and clear errors keep consumers healthy; silent breakage burns them.",
                },
              ],
            },
            {
              title: "Queues & Events",
              description: "Decoupling with messages.",
              slug: "queues-events",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain why decoupling matters",
                "Describe queues vs pub/sub",
                "Handle at-least-once delivery",
              ],
              skills: [
                { name: "events", description: "Design event-driven systems" },
              ],
              activities: [
                {
                  title: "Post and Forget",
                  body: "A **message queue** decouples producers from consumers: the order service publishes 'order placed', the email and inventory services consume it independently. **Queues** (point-to-point, one consumer wins) versus **pub/sub** (many subscribers get a copy). Delivery is usually **at-least-once**, so consumers must be **idempotent** — processing the same message twice must be harmless.",
                },
                {
                  title: "Example",
                  body: "Publish 'order.placed' → the email workers, the analytics pipeline, and the fraud checker each react. If email fails, the message survives for retry instead of a whole checkout failing.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why decouple services with a queue?",
                  options: [
                    "Consumers can fail and retry without blocking producers",
                    "Producers run faster code",
                    "Databases are eliminated",
                    "Frontend renders quicker",
                  ],
                  correctAnswer: "Consumers can fail and retry without blocking producers",
                  explanation:
                    "A queue absorbs load and failures — producers continue while consumers retry or scale separately.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "With at-least-once delivery, a consumer must be idempotent to avoid duplicate effects.",
                  correctAnswer: "true",
                  explanation:
                    "At-least-once means duplicates are possible; idempotent consumers make duplicates harmless.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order an event-driven order flow.",
                  sequenceItems: [
                    { id: "checkout", text: "Checkout completes" },
                    { id: "publish", text: "Order-placed event is published" },
                    { id: "consume", text: "Email service consumes the event" },
                    { id: "fail", text: "Inventory worker fails temporarily" },
                    { id: "retry", text: "Message retries until processed" },
                  ],
                  sequenceCorrectOrder: ["checkout", "publish", "consume", "fail", "retry"],
                  explanation:
                    "Checkout → publish → independent consumers → one fails → redelivery. Failure is contained.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Designing a consumer that produces the same result when run twice is called being ___.",
                  fillBlanks: [{ answer: "idempotent" }],
                  explanation:
                    "Idempotency means repeat processing is harmless — essential for at-least-once systems.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each messaging concept to its behavior.",
                  matchPairs: [
                    { left: "Queue", right: "One consumer processes each message" },
                    { left: "Pub/sub", right: "Many consumers each get a copy" },
                    { left: "Dead-letter queue", right: "Messages that exhausted retries" },
                    { left: "Idempotency key", right: "Deduplicates consumer effects" },
                  ],
                  explanation:
                    "Queues distribute one-to-one, pub/sub fans out, DLQs park poison messages, and keys dedupe work.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Trade-offs",
      description: "Consistency, availability, and more.",
      slug: "tradeoffs",
      icon: "Scale",
      units: [
        {
          title: "CAP & Consistency",
          description: "The constraints that shape systems.",
          slug: "cap-consistency",
          lessons: [
            {
              title: "CAP Theorem",
              description: "Consistency, Availability, Partition tolerance.",
              slug: "cap-theorem",
              estimatedMinutes: 7,
              learningObjectives: [
                "State the CAP theorem",
                "Explain CP vs AP systems",
                "Apply CAP reasoning to real systems",
              ],
              skills: [
                { name: "cap", description: "Reason about consistency/availability trade-offs" },
              ],
              activities: [
                {
                  title: "Pick Two of Three",
                  body: "The **CAP theorem** says a distributed system cannot simultaneously guarantee **Consistency** (every read sees the latest write), **Availability** (every request gets a non-error response), and **Partition tolerance** (works despite network splits). Networks do partition, so you choose: **CP** systems choose consistency on a split (refuse some requests) — think a banking ledger; **AP** systems choose availability (serve possibly-stale reads) — think a feed or shopping cart.",
                },
                {
                  title: "Example",
                  body: "During a partition, an AP store serves the last known value; a CP store refuses the read until the partition heals. Both are 'correct' — for different products.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the CAP theorem about?",
                  options: [
                    "Consistency, Availability, and Partition tolerance",
                    "Caching, APIs, and Performance",
                    "Clients, Applications, and Processes",
                    "Capacity, Allocation, and Pricing",
                  ],
                  correctAnswer: "Consistency, Availability, and Partition tolerance",
                  explanation:
                    "CAP: a distributed system chooses consistency and availability only across network partitions.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "In practice, partitions happen, so distributed systems pick CP or AP.",
                  correctAnswer: "true",
                  explanation:
                    "Networks partition; the real choice is what to sacrifice when they do — consistency or availability.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each system stance to its behavior during a partition.",
                  matchPairs: [
                    { left: "CP", right: "Refuse reads to stay consistent" },
                    { left: "AP", right: "Serve possibly-stale reads" },
                    { left: "Consistency", right: "Every read sees the latest write" },
                    { left: "Availability", right: "Every request gets an answer" },
                  ],
                  explanation:
                    "CP stalls for correctness, AP answers with maybe-stale data — the two real strategies.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A system that favors consistency during a split is labeled ___ (Consistency + Partition).",
                  fillBlanks: [{ answer: "CP" }],
                  explanation:
                    "CP systems choose C and P, sacrificing availability during partitions; AP systems choose A and P.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which products typically choose availability over strict consistency?",
                  multiSelectOptions: [
                    { text: "A social media news feed", isCorrect: true },
                    { text: "A bank balance transfer", isCorrect: false },
                    { text: "A shopping cart", isCorrect: true },
                    { text: "An order inventory decrement", isCorrect: false },
                  ],
                  explanation:
                    "Feeds and carts tolerate staleness (AP); ledgers and inventory want strict correctness (CP).",
                },
              ],
            },
            {
              title: "Consistency Models",
              description: "Strong, eventual, and everything between.",
              slug: "consistency-models",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain strong and eventual consistency",
                "Describe read-your-writes",
                "Choose a model for a feature",
              ],
              skills: [
                { name: "consistency", description: "Choose consistency models deliberately" },
              ],
              activities: [
                {
                  title: "How Fresh Is Fresh?",
                  body: "**Strong consistency**: every read reflects the latest committed write (a single copy or a quorum). **Eventual consistency**: replicas converge over time; a read may see older data for a short window (DNS, most caches, replicated stores). **Read-your-writes** is a pragmatic middle ground used by chat apps and activity feeds — you see your own updates instantly, everyone else's eventually.",
                },
                {
                  title: "Example",
                  body: "You post a comment (read-your-writes: it appears for you immediately) while others see it a second later — eventual consistency under the hood, but your experience feels strong.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does eventual consistency guarantee?",
                  options: [
                    "Replicas converge to the same value over time",
                    "Reads are always blocked",
                    "Writes always fail forever",
                    "Only one node may exist",
                  ],
                  correctAnswer: "Replicas converge to the same value over time",
                  explanation:
                    "Given no new writes, eventually all replicas hold the same value — nobody says exactly when.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Read-your-writes gives a user immediate visibility of their own updates while others converge eventually.",
                  correctAnswer: "true",
                  explanation:
                    "It guarantees the author sees their writes; other readers get eventual convergence.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each model to its experience.",
                  matchPairs: [
                    { left: "Strong", right: "Instant global correctness" },
                    { left: "Eventual", right: "Converges after a short window" },
                    { left: "Read-your-writes", right: "Own updates immediate, rest eventual" },
                    { left: "Session consistency", right: "Stays consistent within one session" },
                  ],
                  explanation:
                    "Strong is globally fresh, eventual converges, read-your-writes favors the author, and sessions localize guarantees.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which scenarios comfortably use eventual consistency?",
                  multiSelectOptions: [
                    { text: "Like counters on a post", isCorrect: true },
                    { text: "DNS record propagation", isCorrect: true },
                    { text: "Balance deduction before a payment", isCorrect: false },
                    { text: "Distributed cache invalidation", isCorrect: true },
                  ],
                  explanation:
                    "Likes, DNS, and caches tolerate brief staleness; monetary balance checks demand stronger guarantees.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a replicated value converging.",
                  sequenceItems: [
                    { id: "write", text: "A write lands on replica A" },
                    { id: "propagate", text: "The update propagates to replica B" },
                    { id: "apply", text: "Replica B applies the update" },
                    { id: "converge", text: "Both replicas hold the same value" },
                    { id: "read", text: "A reader sees the converged value" },
                  ],
                  sequenceCorrectOrder: ["write", "propagate", "apply", "converge", "read"],
                  explanation:
                    "Write → propagate → apply → converge; reads after convergence see one value everywhere — eventual consistency in action.",
                },
              ],
            },
          ],
        },
        {
          title: "Capacity & Cost",
          description: "Planning for load and money.",
          slug: "capacity-cost",
          lessons: [
            {
              title: "Capacity Planning",
              description: "Rough estimates before architecture.",
              slug: "capacity-planning",
              estimatedMinutes: 6,
              learningObjectives: [
                "Estimate QPS, storage, and bandwidth",
                "Use back-of-envelope math",
                "Design for peak, budget for average",
              ],
              skills: [
                { name: "capacity", description: "Size systems with estimates" },
              ],
              activities: [
                {
                  title: "The Envelope", 
                  body: "System design starts with **back-of-envelope** math: daily active users → requests per second, bytes per request → storage per day, and monthly traffic → bandwidth. Numbers like '1M DAU each making ~30 reads → ~350 QPS average, ~5x at peak' are the input to every architectural choice. Round numbers, check orders of magnitude, and sanity-check the peak.",
                },
                {
                  title: "Example",
                  body: "100M writes/day at 256 bytes each ≈ 25 GB/day → ~9 TB a year. Suddenly SSDs, sharding, and retention policies are not hypotheticals.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a back-of-envelope calculation?",
                  options: [
                    "A fast, order-of-magnitude estimate",
                    "A byte-by-byte network trace",
                    "A formal proof",
                    "A GPU benchmark",
                  ],
                  correctAnswer: "A fast, order-of-magnitude estimate",
                  explanation:
                    "Envelope math uses rounded numbers and unit conversions to size systems quickly — accuracy is by magnitude.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a capacity estimate.",
                  sequenceItems: [
                    { id: "dau", text: "Estimate daily active users" },
                    { id: "actions", text: "Estimate actions per user" },
                    { id: "qps", text: "Convert to requests per second" },
                    { id: "bytes", text: "Estimate bytes per request" },
                    { id: "peak", text: "Multiply for peak load" },
                  ],
                  sequenceCorrectOrder: ["dau", "actions", "qps", "bytes", "peak"],
                  explanation:
                    "DAU → actions/user → QPS → bytes → peak. Layers of estimates stack into a plan.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Average load times a burst factor gives you the design point for ___ load.",
                  fillBlanks: [{ answer: "peak" }],
                  explanation:
                    "Design for peak (average × burst) so you do not fail the moment traffic spikes.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are legitimate capacity-planning goals?",
                  multiSelectOptions: [
                    { text: "Roughly right, not falsely precise", isCorrect: true },
                    { text: "Sizing storage and bandwidth", isCorrect: true },
                    { text: "Designing for the parade day peak", isCorrect: true },
                    { text: "Ignoring orders of magnitude", isCorrect: false },
                  ],
                  explanation:
                    "Envelope math sizes orders of magnitude, storage, bandwidth, and peaks — precision comes later.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each capacity input to what it sizes.",
                  matchPairs: [
                    { left: "Daily active users × actions per user", right: "Requests per second" },
                    { left: "Bytes per request × write volume", right: "Storage and bandwidth" },
                    { left: "Average load × burst factor", right: "Peak load" },
                    { left: "Retention window", right: "How long data must be kept" },
                  ],
                  explanation:
                    "Users × actions yield QPS, bytes and retention size storage, and average × burst sets the peak design point.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};