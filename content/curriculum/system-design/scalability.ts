import type { SeedPath } from "@/lib/curriculum/seed";

export const systemDesignScalabilityPath: SeedPath = {
  title: "Scalability & Reliability",
  description:
    "Scaling users and data, then keeping the whole system up with redundancy, failover, and SLAs.",
  slug: "system-design-scalability",
  modules: [
    {
      title: "Scaling",
      description: "Growing compute and data.",
      slug: "scale",
      icon: "TrendingUp",
      units: [
        {
          title: "Growth Strategies",
          description: "More machines, more smarts.",
          slug: "growth",
          lessons: [
            {
              title: "Vertical vs Horizontal",
              description: "Bigger boxes or more boxes?",
              slug: "vertical-horizontal",
              estimatedMinutes: 6,
              learningObjectives: [
                "Compare vertical and horizontal scaling",
                "Give the limits of each approach",
                "Pick a strategy by workload",
              ],
              skills: [
                { name: "scaling", description: "Choose vertical or horizontal scaling" },
              ],
              activities: [
                {
                  title: "Up or Out",
                  body: "**Vertical scaling** buys a bigger machine — simple, no application changes, but it tops out and creates a single point of failure. **Horizontal scaling** adds more machines behind a load balancer — unlimited scale, built-in redundancy, but stateless services and shared state coordination required. Stateless tiers scale horizontally trivially; stateful ones (databases, sessions) need partitioning or replication.",
                },
                {
                  title: "Example",
                  body: "An API with no in-memory state climbs to 20 instances behind a load balancer. Its Postgres, stateful, scales vertically up; hot scale comes from read replicas and sharding.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Where does horizontal scaling hit its first real constraint?",
                  options: [
                    "Shared stateful parts like databases or sessions",
                    "The power bill for a single server",
                    "The CPU count on one box",
                    "The network card",
                  ],
                  correctAnswer: "Shared stateful parts like databases or sessions",
                  explanation:
                    "Stateless app instances scale out freely; centralized state must be partitioned or replicated first.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Vertical scaling eventually hits a hardware ceiling and keeps a single point of failure.",
                  correctAnswer: "true",
                  explanation:
                    "One big box runs out eventually and still means one box — horizontal adds redundancy.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each tactic to its flavor.",
                  matchPairs: [
                    { left: "Bigger CPU", right: "Vertical" },
                    { left: "More app instances", right: "Horizontal" },
                    { left: "Read replicas", right: "Horizontal for state" },
                    { left: "No code changes needed", right: "Vertical benefit" },
                  ],
                  explanation:
                    "Vertical trades code simplicity for a ceiling; horizontal trades operability for scale.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Scaling with more machines rather than bigger ones is ___ scaling.",
                  fillBlanks: [{ answer: "horizontal" }],
                  explanation:
                    "Horizontal = more nodes in parallel; vertical = one larger node.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "What must an app do to scale horizontally cleanly?",
                  multiSelectOptions: [
                    { text: "Keep app instances stateless", isCorrect: true },
                    { text: "Externalize sessions and caches", isCorrect: true },
                    { text: "Store every user file inside the container", isCorrect: false },
                    { text: "Make writes partitionable", isCorrect: true },
                  ],
                  explanation:
                    "Statelessness, externalized session/cache state, and partitionable writes let any node serve any request.",
                },
              ],
            },
            {
              title: "Load Balancing",
              description: "Spreading traffic across nodes.",
              slug: "load-balancing",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain load balancer roles",
                "Compare balancing algorithms",
                "Handle health checks and sticky sessions",
              ],
              skills: [
                { name: "load-balancing", description: "Design load-balanced tiers" },
              ],
              activities: [
                {
                  title: "The Traffic Cop",
                  body: "A **load balancer** sits in front of a tier, distributing requests across healthy backends. Common policies: **round robin** (even split), **least connections** (busiest-aware), **IP hash** (stickiness for sessions). It also does **health checks** — marking failed nodes out, adding them back when healthy — and terminates TLS. Sticky sessions (same client → same node) matter only when state isn't externalized.",
                },
                {
                  title: "Example",
                  body: "A websocket fleet uses least-connections policies; TLS terminates at the LB; a failing node is health-checked out in seconds and returns later.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the core job of a load balancer?",
                  options: [
                    "Spread requests across healthy backends",
                    "Store static files only",
                    "Compile frontend code",
                    "Replace the database",
                  ],
                  correctAnswer: "Spread requests across healthy backends",
                  explanation:
                    "The LB distributes traffic and routes around unhealthy nodes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Health checks let a load balancer route around failing nodes automatically.",
                  correctAnswer: "true",
                  explanation:
                    "Periodic health probes mark nodes out of rotation until they recover.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the algorithm to its trait.",
                  matchPairs: [
                    { left: "Round robin", right: "Even, simple split" },
                    { left: "Least connections", right: "Busiest-aware" },
                    { left: "IP hash", right: "Same client, same node" },
                    { left: "Health-based", right: "Skips failing nodes" },
                  ],
                  explanation:
                    "Round robin is fair; least connections follows load; IP hash sticks sessions; health checks skip failures.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Pinning a client to a specific backend across requests is called a ___ session.",
                  fillBlanks: [{ answer: "sticky" }],
                  explanation:
                    "Sticky sessions send one client to one node — a crutch better solved by externalized state.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "What should a load balancer also do besides routing?",
                  multiSelectOptions: [
                    { text: "Terminate TLS to offload backends", isCorrect: true },
                    { text: "Retry safe requests on failure", isCorrect: true },
                    { text: "Run the cron scheduler", isCorrect: false },
                    { text: "Reject requests to broken nodes", isCorrect: true },
                  ],
                  explanation:
                    "TLS offload, safe retries, and failure rejection are standard LB duties — cron is a job for a scheduler.",
                },
              ],
            },
          ],
        },
        {
          title: "Data at Scale",
          description: "Sharding, replication, and partitioning.",
          slug: "data-scale",
          lessons: [
            {
              title: "Sharding & Partitioning",
              description: "Splitting data across machines.",
              slug: "sharding",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain sharding and shard key choice",
                "Describe range vs hash sharding",
                "Handle the cross-shard costs",
              ],
              skills: [
                { name: "sharding", description: "Shard data at scale" },
              ],
              activities: [
                {
                  title: "Split to Scale Writes",
                  body: "**Sharding** splits one logical dataset across many databases. The **shard key** decides where a row lives. **Range** sharding (A–M, N–Z) helps range queries and hot-zone locality but can skew hot keys. **Hash** sharding spreads uniformly but kills range scans. Costs: queries touching many shards, cross-shard transactions, and resharding when data grows.",
                },
                {
                  title: "Example",
                  body: "A users table sharded by `user_id % 16` distributes writes evenly; a 'find all my orders' query must fan out to all shards, so the app denormalizes a per-shard user index with `user_id` as the local key.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does a shard key do?",
                  options: [
                    "Decides which shard stores a given row",
                    "Encrypts the database",
                    "Chooses the cache size",
                    "Compresses all columns",
                  ],
                  correctAnswer: "Decides which shard stores a given row",
                  explanation:
                    "The shard key routes each row to exactly one shard — it defines the split.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Hash sharding spreads data evenly but makes range queries cross multiple shards.",
                  correctAnswer: "true",
                  explanation:
                    "Hashing randomizes placement — uniform but unfriendly to ordered scans.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the sharding concern to its handling.",
                  matchPairs: [
                    { left: "Hot range keys", right: "Hash sharding" },
                    { left: "Range queries", right: "Range sharding or index" },
                    { left: "Cross-shard transactions", right: "Reduce or accept cost" },
                    { left: "Future growth", right: "Plan a resize path" },
                  ],
                  explanation:
                    "Hashing fixes hot keys, range keys serve scans, transactions cost extra, growth needs a plan.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Splitting a dataset across multiple databases, each holding a subset, is called ___.",
                  fillBlanks: [{ answer: "sharding" }],
                  explanation:
                    "Sharding distributes rows by key across distinct database instances.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which shard key traits make a good choice?",
                  multiSelectOptions: [
                    { text: "Cardinal and evenly distributed", isCorrect: true },
                    { text: "Co-locating related access patterns", isCorrect: true },
                    { text: "A single value everyone shares", isCorrect: false },
                    { text: "Stable, rarely changing", isCorrect: true },
                  ],
                  explanation:
                    "Even distribution, locality of access, and stability make a shard key usable long-term.",
                },
              ],
            },
            {
              title: "Replication & Indexing",
              description: "Copies for reads and speed.",
              slug: "replication-indexing",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain replication for durability and reads",
                "Contrast master and multi-master setups",
                "Design indexes for queries",
              ],
              skills: [
                { name: "replication", description: "Design replication and indexes" },
              ],
              activities: [
                {
                  title: "Copies Buy Durability",
                  body: "**Replication** keeps copies of data on other nodes — durability against machine loss and read scaling via **read replicas** (single writer). **Multi-master** accepts writes on many nodes but trades in conflict resolution. **Indexes** speed lookups at the cost of write overhead; choose per hot query — covering composite indexes beat many single-column ones.",
                },
                {
                  title: "Example",
                  body: "A primary serves writes; three read replicas absorb reporting. A hot query `WHERE user_id AND created_at` gets a composite index on exactly those columns.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the main purpose of a read replica?",
                  options: [
                    "Absorb read load off the primary",
                    "Serve user-facing ads",
                    "Back up source code",
                    "Compile frontends",
                  ],
                  correctAnswer: "Absorb read load off the primary",
                  explanation:
                    "Replicas scale the read path so the primary stays free for writes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Indexes trade write overhead and storage for faster reads.",
                  correctAnswer: "true",
                  explanation:
                    "Every index updates on writes; in exchange, the queries it serves get fast.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a read-replica evolution.",
                  sequenceItems: [
                    { id: "primary", text: "Primary handles writes" },
                    { id: "lag", text: "Reads grow, primary saturates" },
                    { id: "replica", text: "First replica streams the log" },
                    { id: "route", text: "Read traffic routes to replicas" },
                    { id: "reconcile", text: "Apps tolerate small lag" },
                  ],
                  sequenceCorrectOrder: ["primary", "lag", "replica", "route", "reconcile"],
                  explanation:
                    "Primary writes → read pressure → replica streaming → read routing → handle replication lag.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A primary-plus-replicas setup with one writer is often called a single-___ setup.",
                  fillBlanks: [{ answer: "writer" }],
                  explanation:
                    "Single-writer replication avoids write conflicts entirely — one primary, many read copies.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are valid replication motivations?",
                  multiSelectOptions: [
                    { text: "Surviving machine loss", isCorrect: true },
                    { text: "Scaling read-heavy traffic", isCorrect: true },
                    { text: "Scaling writes with zero conflicts", isCorrect: false },
                    { text: "Geographic locality for users", isCorrect: true },
                  ],
                  explanation:
                    "Durability, read scale, and locality all motivate copies; write scale needs sharding, not copies.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Reliability",
      description: "Staying up and accountable.",
      slug: "reliability",
      icon: "ShieldCheck",
      units: [
        {
          title: "Redundancy & Failover",
          description: "No single point of failure.",
          slug: "redundancy-failover",
          lessons: [
            {
              title: "Redundancy & Failover",
              description: "Designing for component loss.",
              slug: "redundancy-failover",
              estimatedMinutes: 6,
              learningObjectives: [
                "Remove single points of failure",
                "Explain active-passive failover",
                "Design multi-AZ deployments",
              ],
              skills: [
                { name: "redundancy", description: "Design redundant systems" },
              ],
              activities: [
                {
                  title: "Design For Loss",
                  body: "**Redundancy** duplicates critical components. **Failover** moves traffic to the spare automatically when the primary fails. Common patterns: **active-passive** (a standby promotes on failure), **active-active** (both serve, loss just lowers capacity), and multi-AZ/multi-region placement so a single facility failure doesn't take you down. Recovery time depends on detection. Load balancers + health checks do much of the work automatically.",
                },
                {
                  title: "Example",
                  body: "A web tier runs 2+ instances across 3 AZs. The database is active-passive: the standby promotes when the primary's health check fails, and an RTO of minutes holds.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is failover?",
                  options: [
                    "Automatically transferring traffic to a standby after a failure",
                    "Deleting logs after an incident",
                    "Rebalancing a shard key",
                    "Sending users a survey",
                  ],
                  correctAnswer: "Automatically transferring traffic to a standby after a failure",
                  explanation:
                    "Failover promotes the spare and reroutes traffic with no manual heroics.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Active-active redundancy means an AZ loss degrades capacity but does not require promotion.",
                  correctAnswer: "true",
                  explanation:
                    "Both nodes serve all along; losing one just reduces total capacity — nothing to promote.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order an active-passive database failover.",
                  sequenceItems: [
                    { id: "detect", text: "Health check fails on primary" },
                    { id: "standby", text: "Standby detected as healthy" },
                    { id: "promote", text: "Standby promotes to primary" },
                    { id: "route", text: "Traffic routes to new primary" },
                    { id: "repair", text: "Old primary re-provisions as standby" },
                  ],
                  sequenceCorrectOrder: ["detect", "standby", "promote", "route", "repair"],
                  explanation:
                    "Detect → verify standby → promote → reroute → repair the peer. Order defines your RTO.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Placing replicas across physical data centers is called multi-___ design.",
                  fillBlanks: [{ answer: "AZ" }],
                  explanation:
                    "Availability Zones isolate failures, so multi-AZ placement survives a zone-level outage.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which techniques remove single points of failure?",
                  multiSelectOptions: [
                    { text: "Two+ app instances behind a load balancer", isCorrect: true },
                    { text: "Multi-AZ database replicas", isCorrect: true },
                    { text: "One giant server with one disk", isCorrect: false },
                    { text: "An immutable backup pipeline", isCorrect: true },
                  ],
                  explanation:
                    "Duplication + automatic routing, multi-AZ placement, and good backups all raise resilience.",
                },
              ],
            },
            {
              title: "Monitoring & SLAs",
              description: "Observing and agreeing on uptime.",
              slug: "monitoring-slas",
              estimatedMinutes: 7,
              learningObjectives: [
                "Distinguish metrics, logs, and traces",
                "Frame SLIs, SLOs, and SLAs",
                "Design dashboards and alerting",
              ],
              skills: [
                { name: "monitoring", description: "Design monitoring and SLOs" },
              ],
              activities: [
                {
                  title: "Observe Everything",
                  body: "**Metrics** (counters, gauges, histograms) show health trends. **Logs** give event detail for debugging. **Traces** connect one request across services. Golden signals: latency, traffic, errors, saturation. **SLI** = measured indicator (e.g., p99 latency). **SLO** = target you commit to internally (99.9%). **SLA** = the public contract, often with compensation.",
                },
                {
                  title: "Example",
                  body: "Error rate (SLI) < 0.1% over 30 days (SLO). The SLA promises 99.9% uptime with service credits; dashboards alert at the error budget burn rate.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which captures the path of one request across many services?",
                  options: [
                    "Distributed traces",
                    "A single counter",
                    "An uptime report",
                    "A log file",
                  ],
                  correctAnswer: "Distributed traces",
                  explanation:
                    "Traces stitch spans across services to show where a request spent its time.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "An SLO is an internal target, while an SLA is a public contract with consequences.",
                  correctAnswer: "true",
                  explanation:
                    "SLOs guide engineering; SLAs bind the vendor with contractual teeth.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the term to its role.",
                  matchPairs: [
                    { left: "SLI", right: "Measured indicator" },
                    { left: "SLO", right: "Internal target" },
                    { left: "SLA", right: "Public contract" },
                    { left: "Error budget", right: "Allowed failure room" },
                  ],
                  explanation:
                    "SLI measures, SLO sets a target, SLA contracts it, and the error budget mans the margin.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The 'four golden' signals include latency, traffic, errors, and ___.",
                  fillBlanks: [{ answer: "saturation" }],
                  explanation:
                    "Saturation measures how close a resource is to capacity — the fourth golden signal.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which alarm designs avoid alert fatigue?",
                  multiSelectOptions: [
                    { text: "Alert on SLO burn rate, not every blip", isCorrect: true },
                    { text: "Dashboards owners traceable to a service", isCorrect: true },
                    { text: "A generic alert for everything green", isCorrect: false },
                    { text: "Page only on actionable conditions", isCorrect: true },
                  ],
                  explanation:
                    "Burn-rate alerts, owned dashboards, and actionable paging keep alerts truthful.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};