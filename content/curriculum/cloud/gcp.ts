import type { SeedPath } from "@/lib/curriculum/seed";

export const gcpPath: SeedPath = {
  title: "Google Cloud",
  description:
    "Compute Engine, Cloud Run, BigQuery, and GKE — Google Cloud's core services for the working engineer.",
  slug: "gcp",
  crossReferences: [
    {
      careerSlug: "devops",
      pathSlug: "linux",
      title: "Linux Fundamentals",
      note: "The shell and SSH skills used with Compute Engine and gcloud.",
    },
    {
      careerSlug: "devops",
      pathSlug: "docker",
      title: "Docker & Containers",
      note: "Container fundamentals behind Cloud Run and GKE.",
    },
  ],
  modules: [
    {
      title: "Compute",
      description: "Compute Engine, Cloud Run, GKE.",
      slug: "compute",
      icon: "Cpu",
      units: [
        {
          title: "Virtual Machines",
          description: "Compute Engine and families.",
          slug: "compute-engine",
          lessons: [
            {
              title: "Compute Engine",
              description: "VMs with custom machine shapes.",
              slug: "compute-engine-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain Compute Engine VMs",
                "Describe machine families and custom shapes",
                "Use instance templates and managed instance groups",
              ],
              skills: [
                { name: "compute-engine", description: "Provision and reason about GCP VMs" },
              ],
              activities: [
                {
                  title: "Customizable VMs",
                  body: "**Compute Engine** is GCP's VM product. Unlike fixed instance types elsewhere, you can pick **custom machine shapes** — any vCPU/memory combination. **Predefined families** cover common mixes (`e2`, `n2`, `c3`, `m3`). **Instance templates** define a machine spec, and **managed instance groups (MIGs)** scale templates up and down automatically — the GCP analogue of an autoscaling group.",
                },
                {
                  title: "Example",
                  body: "An `e2-standard-4` is a cheap all-rounder; a custom 6 vCPU / 24 GiB shape fits a workload between the standard tiers.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which GCP product provides raw virtual machines?",
                  options: ["Compute Engine", "Cloud Run", "App Engine", "BigQuery"],
                  correctAnswer: "Compute Engine",
                  explanation:
                    "Compute Engine is the IaaS VM offering — the closest analogue to AWS EC2.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Compute Engine lets you build custom machine shapes with any valid vCPU/memory combination.",
                  correctAnswer: "true",
                  explanation:
                    "Custom shapes are a GCP strength — pick ratios that predefined families do not offer.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each Compute Engine concept to its role.",
                  matchPairs: [
                    { left: "Instance template", right: "Reusable VM spec" },
                    { left: "Managed instance group", right: "Autoscales matching VMs" },
                    { left: "Custom machine type", right: "Any vCPU/memory ratio" },
                    { left: "Startup script", right: "Runs on first boot" },
                  ],
                  explanation:
                    "Templates define VMs, MIGs scale them, custom shapes fit odd workloads, and startup scripts automate boot.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A fleet of identical VMs created from one template and scaled automatically is a managed ___ group.",
                  fillBlanks: [{ answer: "instance" }],
                  explanation:
                    "Managed instance groups maintain a fleet of VM replicas from a single template.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the acronym for a group of VMs that can autoscale:",
                  scrambledWord: "mig",
                  explanation:
                    "MIG — managed instance group — the unit that auto scales under a load balancer.",
                },
              ],
            },
            {
              title: "Serverless Compute",
              description: "Cloud Run and scale-to-zero.",
              slug: "cloud-run",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain Cloud Run's auto-scaling model",
                "Describe scale-to-zero",
                "Choose Cloud Run vs Cloud Functions",
              ],
              skills: [
                { name: "cloud-run", description: "Deploy containers without servers" },
              ],
              activities: [
                {
                  title: "Containers, Serverless",
                  body: "**Cloud Run** runs container images on demand, scaling from **zero** to thousands of replicas as requests arrive. You provide a container that serves HTTP, and GCP bills only while requests are in flight (in 100ms increments). **Cloud Functions** is the same idea for single-purpose functions. Cloud Run shines because it keeps your standard Docker workflow while removing the servers.",
                },
                {
                  title: "Example",
                  body: "Deploy the same image you run locally: `gcloud run deploy api --source . --region us-central1` — you get a public HTTPS URL immediately.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does Cloud Run do with replicas when the service is idle?",
                  options: ["Scales to zero", "Keeps one always-on instance", "Keeps a minimum of three", "Runs on dedicated servers"],
                  correctAnswer: "Scales to zero",
                  explanation:
                    "Cloud Run can scale all the way to zero instances when no requests arrive — no baseline cost.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Cloud Run executes your own container images over standard HTTP.",
                  correctAnswer: "true",
                  explanation:
                    "Bring any HTTP-serving container — Cloud Run just runs it and scales it.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which of these are Cloud Run characteristics?",
                  multiSelectOptions: [
                    { text: "Autoscaling from zero replicas", isCorrect: true },
                    { text: "Billing in 100ms request increments", isCorrect: true },
                    { text: "Requires state to survive in memory", isCorrect: false },
                    { text: "Handles concurrent requests per instance", isCorrect: true },
                  ],
                  explanation:
                    "Cloud Run scales to zero, bills per 100ms, and handles concurrency — but instances are ephemeral, so state belongs in external storage.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the lifecycle of a request to a cold Cloud Run service.",
                  sequenceItems: [
                    { id: "http", text: "HTTPS request arrives at the URL" },
                    { id: "replica", text: "Cloud Run cold-starts a replica" },
                    { id: "serve", text: "Container serves the request" },
                    { id: "scale", text: "Replicas scale with concurrency" },
                    { id: "idle", text: "Service scales back toward zero" },
                  ],
                  sequenceCorrectOrder: ["http", "replica", "serve", "scale", "idle"],
                  explanation:
                    "Cold request → start replica → serve → scale with load → scale back down when idle.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A Cloud Run service whose first request pays a startup delay is said to have a ___ start.",
                  fillBlanks: [{ answer: "cold" }],
                  explanation:
                    "As with Lambda, a cold start happens when no warm instance exists for the first request.",
                },
              ],
            },
          ],
        },
        {
          title: "Managed Compute",
          description: "Kubernetes Engine.",
          slug: "managed-compute",
          lessons: [
            {
              title: "GKE Basics",
              description: "Managed Kubernetes on GCP.",
              slug: "gke",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain Google Kubernetes Engine",
                "Describe node pools and autoscaling",
                "Relate GKE to EKS and AKS",
              ],
              skills: [
                { name: "gke", description: "Run managed Kubernetes clusters" },
              ],
              activities: [
                {
                  title: "Kubernetes, Managed",
                  body: "**GKE** is Google's managed Kubernetes. The control plane is handled for you; **node pools** group your worker machines, with **cluster autoscaling** adding or removing nodes as pods demand. GKE is often called the origin of Kubernetes — Google wrote the first versions. Standard resources (`Deployment`, `Service`, `Ingress`, HPA) all work unchanged.",
                },
                {
                  title: "Example",
                  body: "`gcloud container clusters create app` gives a regional cluster. A HorizontalPodAutoscaler scales replicas while cluster autoscaling grows the node pool underneath.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which CLI authenticates to a GKE cluster and updates the kubectl context?",
                  options: ["gcloud", "az", "ssh", "git"],
                  correctAnswer: "gcloud",
                  explanation:
                    "gcloud authenticates and points kubectl's current context at your cluster.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "In GKE, node pools hold the worker machines and the cluster autoscaler adjusts their count.",
                  correctAnswer: "true",
                  explanation:
                    "Node pools are worker groups; the cluster autoscaler grows or shrinks them based on scheduling pressure.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which of these describe how GKE manages nodes?",
                  multiSelectOptions: [
                    { text: "Automated node upgrades", isCorrect: true },
                    { text: "Cluster autoscaler adds nodes when pods cannot schedule", isCorrect: true },
                    { text: "Manual node count only", isCorrect: false },
                    { text: "Spot nodes for cheaper batch work", isCorrect: true },
                  ],
                  explanation:
                    "GKE supports auto-upgrades, the cluster autoscaler, and spot/preemptible nodes; purely manual counts are the old way.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each Kubernetes concept to its role on GKE.",
                  matchPairs: [
                    { left: "Control plane", right: "Managed for you by GKE" },
                    { left: "Node pool", right: "Group of worker machines" },
                    { left: "HPA", right: "Scales pods by metrics" },
                    { left: "Cluster autoscaler", right: "Scales nodes by demand" },
                  ],
                  explanation:
                    "GKE owns the control plane; node pools hold workers; the HPA scales pods and the autoscaler scales nodes.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "The two levels of autoscaling on GKE are the HPA (pods) and the cluster ___ (nodes).",
                  fillBlanks: [{ answer: "autoscaler" }],
                  explanation:
                    "The HPA scales workloads; the cluster autoscaler scales the underlying node pool to fit them.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Storage & Databases",
      description: "Cloud Storage, Cloud SQL, BigQuery.",
      slug: "storage-databases",
      icon: "Database",
      units: [
        {
          title: "Object Storage",
          description: "Cloud Storage buckets and classes.",
          slug: "cloud-storage",
          lessons: [
            {
              title: "Cloud Storage",
              description: "GCS buckets, objects, classes.",
              slug: "gcs",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain buckets and objects in Cloud Storage",
                "Describe storage classes",
                "Use gsutil",
              ],
              skills: [
                { name: "gcs", description: "Store objects in Google Cloud Storage" },
              ],
              activities: [
                {
                  title: "Unified Object Storage",
                  body: "**Cloud Storage (GCS)** gives you **buckets** holding **objects** addressed by key — the same mental model as S3. Storage **classes** trade price for availability: `Standard`, `Nearline` (30-day), `Coldline` (90-day), `Archive`. **Uniform bucket-level access** keeps IAM the single source of permissions. `gsutil` mirrors the `aws` CLI: `gsutil cp`, `gsutil ls`, `gsutil rsync`.",
                },
                {
                  title: "Example",
                  body: "`gsutil cp ./build/* gs://my-site/` uploads a static site; a Nearline class suits monthly analytics exports.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which CLI tool is used to interact with GCS object storage?",
                  options: ["gsutil", "kubectl", "terraform", "node"],
                  correctAnswer: "gsutil",
                  explanation:
                    "gsutil is the object-storage CLI for GCS, deliberately subcommand-compatible with the s3 CLI.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Cloud Storage bucket names must be globally unique.",
                  correctAnswer: "true",
                  explanation:
                    "Like S3, GCS bucket names live in a shared global namespace.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each Cloud Storage class to its intended access pattern.",
                  matchPairs: [
                    { left: "Standard", right: "Hot frequently accessed data" },
                    { left: "Nearline", right: "Accessed about monthly" },
                    { left: "Coldline", right: "Accessed about quarterly" },
                    { left: "Archive", right: "Accessed less than once a year" },
                  ],
                  explanation:
                    "Standard for hot data, Nearline ~monthly, Coldline ~quarterly, Archive for long-term cold storage.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Centralizing all object permissions on IAM instead of per-object ACLs is called ___ bucket-level access.",
                  fillBlanks: [{ answer: "uniform" }],
                  explanation:
                    "Uniform bucket-level access centralizes permissions on IAM, removing fragile per-object ACLs.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the GCS container that holds objects:",
                  scrambledWord: "bucket",
                  explanation:
                    "Buckets hold objects in Cloud Storage — the same container concept as S3.",
                },
              ],
            },
          ],
        },
        {
          title: "Relational & Big Data",
          description: "Cloud SQL and BigQuery.",
          slug: "relational-bigquery",
          lessons: [
            {
              title: "Cloud SQL",
              description: "Managed relational databases.",
              slug: "cloud-sql",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain what Cloud SQL manages",
                "Describe failover replicas",
                "Choose Cloud SQL engines and tiers",
              ],
              skills: [
                { name: "cloud-sql", description: "Run managed relational databases on GCP" },
              ],
              activities: [
                {
                  title: "Postgres Without the Ops",
                  body: "**Cloud SQL** runs PostgreSQL, MySQL, and SQL Server with backups, patching, and scaling handled. **High availability (HA) configurations** use a synchronous standby for failover. **Read replicas** absorb analytics traffic. It is the boring, reliable choice for relational data at steady scale — when you outgrow it, move to **Cloud Spanner** or a self-managed option.",
                },
                {
                  title: "Example",
                  body: "A standard `db-custom-2-7680` Cloud SQL PostgreSQL instance in HA mode with one read replica for reporting.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is an operational task Cloud SQL removes for you?",
                  options: ["Automated backups and patching", "Writing your queries", "Designing your schema", "Choosing column types"],
                  correctAnswer: "Automated backups and patching",
                  explanation:
                    "Cloud SQL automates backups, patching, and maintenance — you keep control of schema and queries.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A Cloud SQL HA configuration uses a synchronous standby for automatic failover.",
                  correctAnswer: "true",
                  explanation:
                    "HA pairs your primary with a synchronous standby; failover is automatic on outage.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A copy of a Cloud SQL instance that serves read-only traffic is a read ___.",
                  fillBlanks: [{ answer: "replica" }],
                  explanation:
                    "Read replicas offload reads from the primary and are fine when slight replication lag is acceptable.",
                },
                {
                  type: "match",
                  difficulty: "advanced",
                  question: "Match each Cloud SQL networking concept to its purpose.",
                  matchPairs: [
                    { left: "Private IP", right: "Reachable only inside your VPC" },
                    { left: "Authorized networks", right: "Allowlisted client IPs" },
                    { left: "SSL connections", right: "Encrypted traffic in transit" },
                    { left: "Cloud SQL Proxy", right: "Secure tunnel without allowlisting" },
                  ],
                  explanation:
                    "Private IP keeps the DB out of the public internet; authorized networks and SSL lock it down; the proxy removes the need for client IP allowlisting.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "Which of these are managed for you by Cloud SQL?",
                  multiSelectOptions: [
                    { text: "Automated database backups", isCorrect: true },
                    { text: "Security patching of the database engine", isCorrect: true },
                    { text: "Designing your application schema", isCorrect: false },
                    { text: "Automatic storage growth", isCorrect: true },
                  ],
                  explanation:
                    "Cloud SQL automates backups, patching, and storage — the schema and queries stay under your control.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question:
                    "Order the steps when Cloud SQL performs automatic failover in an HA configuration.",
                  sequenceItems: [
                    { id: "detect", text: "Primary instance failure is detected" },
                    { id: "standby", text: "Healthy synchronous standby is confirmed" },
                    { id: "promote", text: "Standby is promoted to primary" },
                    { id: "route", text: "Connections reroute to the new primary" },
                    { id: "repair", text: "A fresh standby is provisioned" },
                  ],
                  sequenceCorrectOrder: ["detect", "standby", "promote", "route", "repair"],
                  explanation:
                    "Detect → verify standby → promote → reroute connections → repair the standby.",
                },
              ],
            },
            {
              title: "BigQuery",
              description: "Serverless data warehouses.",
              slug: "bigquery",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the serverless warehouse model",
                "Describe columnar storage and SQL",
                "Reason about BigQuery costs",
              ],
              skills: [
                { name: "bigquery", description: "Query petabyte-scale data with SQL" },
              ],
              activities: [
                {
                  title: "Query the Warehouse",
                  body: "**BigQuery** is a serverless data warehouse: no clusters, no sizing. Data is stored **columnar**, so queries scan only the columns they need. You pay for **bytes scanned** per query (plus storage). Standard SQL applies directly, so analysts and engineers query terabytes with the same tool. Use the **Console**, `bq` CLI, or the REST API.",
                },
                {
                  title: "Example",
                  body: "`SELECT state, COUNT(*) FROM bigquery-public-data.usa_names.usa_1910_current GROUP BY state ORDER BY 2 DESC` runs instantly over decades of records.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "BigQuery bills you primarily for what?",
                  options: ["Bytes of data scanned per query", "Queries per day", "Number of compute nodes", "Rows inserted"],
                  correctAnswer: "Bytes of data scanned per query",
                  explanation:
                    "Slider-style pricing: you pay per amount of data processed by each query, not per query or per node.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "BigQuery queries use standard SQL against columnar storage.",
                  correctAnswer: "true",
                  explanation:
                    "BigQuery is standard-SQL compatible and stores data column-wise for fast scan.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which practices reduce BigQuery cost?",
                  multiSelectOptions: [
                    { text: "Filtering with WHERE before selecting columns", isCorrect: true },
                    { text: "Selecting only needed columns", isCorrect: true },
                    { text: "Running SELECT * on huge tables repeatedly", isCorrect: false },
                    { text: "Partitioning tables by date", isCorrect: true },
                  ],
                  explanation:
                    "Columnar storage means fewer selected columns = less data scanned. Partitioning and WHERE clauses prune scanned data too; SELECT * is the anti-pattern.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order the phases of a BigQuery query.",
                  sequenceItems: [
                    { id: "parse", text: "Parser validates the SQL" },
                    { id: "plan", text: "Optimizer builds a query plan" },
                    { id: "prune", text: "Partition/column pruning limits scans" },
                    { id: "scan", text: "Distributed workers scan the data" },
                    { id: "aggregate", text: "Results are aggregated and returned" },
                  ],
                  sequenceCorrectOrder: ["parse", "plan", "prune", "scan", "aggregate"],
                  explanation:
                    "Parse → plan → prune → scan → aggregate. Pruning is why partitioning and column selection matter.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "BigQuery stores data ___ (column-wise rather than row-wise) to scan efficiently.",
                  fillBlanks: [{ answer: "columnar" }],
                  explanation:
                    "Columnar storage means a query touching two of ten columns scans just those two.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Networking & IAM",
      description: "VPCs and service accounts.",
      slug: "networking-iam",
      icon: "Network",
      units: [
        {
          title: "Virtual Networking",
          description: "VPC networks and subnets.",
          slug: "vpc",
          lessons: [
            {
              title: "VPC Networks",
              description: "Global networks, regional subnets.",
              slug: "vpc-networks",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain GCP VPC global networking",
                "Describe regional subnets",
                "Use firewall rules and Cloud NAT",
              ],
              skills: [
                { name: "gcp-vpc", description: "Design Google Cloud networks" },
              ],
              activities: [
                {
                  title: "A Global Network",
                  body: "A **GCP VPC network** is a global construct spanning all regions, unlike per-region AWS VPCs. **Subnets** are regional. **Firewall rules** are stateful and default-deny inbound; a **Cloud NAT** lets private-internal instances reach the internet outbound. **VPC peering** joins networks, and **Shared VPC** centralizes administration.",
                },
                {
                  title: "Example",
                  body: "One `default` VPC with a subnet per region; web-facing instances get public IPs, databases stay internal-only behind firewall rules that allow only the app subnet.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How do GCP VPC networks differ from classic per-region VPCs?",
                  options: ["They are global across regions", "They are per-AZ", "They cannot be segmented", "They have no firewall rules"],
                  correctAnswer: "They are global across regions",
                  explanation:
                    "A single GCP VPC spans regions — subnets live inside it regionally.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "GCP firewall rules are stateful and inbound traffic is denied by default.",
                  correctAnswer: "true",
                  explanation:
                    "Firewall rules are stateful; unless you explicitly allow inbound from a source range, it is dropped.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A ___ NAT translation service gives private-only instances outbound internet access.",
                  fillBlanks: [{ answer: "Cloud" }],
                  explanation:
                    "Cloud NAT provides outbound internet for instances with no public IPs.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each networking concept to its GCP role.",
                  matchPairs: [
                    { left: "VPC", right: "Global isolated network" },
                    { left: "Subnet", right: "Regional IP range segment" },
                    { left: "Cloud NAT", right: "Outbound internet for private instances" },
                    { left: "Firewall rule", right: "Stateful allow/deny filter" },
                  ],
                  explanation:
                    "The VPC is global, subnets are regional, NAT gives outbound access, and firewall rules filter traffic.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "Order how a private Compute Engine instance reaches the public internet through Cloud NAT.",
                  sequenceItems: [
                    { id: "private", text: "Instance has only an internal IP" },
                    { id: "egress", text: "Instance sends traffic outbound" },
                    { id: "nat", text: "Cloud NAT translates the source address" },
                    { id: "return", text: "NAT stores the mapping for replies" },
                    { id: "deliver", text: "Response packets route back to the instance" },
                  ],
                  sequenceCorrectOrder: ["private", "egress", "nat", "return", "deliver"],
                  explanation:
                    "Private instance → outbound traffic → Cloud NAT translation → reply mapping → return path.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question:
                    "Unscramble the word for the GCP service that provides outbound internet access to private-only instances:",
                  scrambledWord: "nat",
                  explanation:
                    "Cloud NAT translates private address space outbound so instances without public IPs still reach the internet.",
                },
              ],
            },
            {
              title: "IAM",
              description: "Roles, policies, service accounts.",
              slug: "iam",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain IAM members and roles",
                "Describe primitive vs predefined roles",
                "Use service accounts for machine identity",
              ],
              skills: [
                { name: "gcp-iam", description: "Model Google Cloud identities and permissions" },
              ],
              activities: [
                {
                  title: "Members Get Roles",
                  body: "In **GCP IAM**, you bind **members** (people, groups, service accounts) to **roles** (bundles of permissions) at some **resource** (project, folder, folder tree). **Predefined roles** are maintained by Google; **custom roles** let you hand-pick permissions. **Service accounts** give machines identity — a VM or Cloud Run service can assume one without any hard-coded credentials. **Conditions** scope when permissions apply (e.g. only during business hours).",
                },
                {
                  title: "Example",
                  body: "A Cloud Run service gets a service account with `roles/storage.objectViewer` on one bucket — reads objects without any keys.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which GCP IAM term represents a machine identity?",
                  options: ["Service account", "Service key", "Blob", "Log sink"],
                  correctAnswer: "Service account",
                  explanation:
                    "Service accounts are IAM identities for services like VMs and Cloud Run.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Roles grant permissions, and conditions can limit when those permissions apply.",
                  correctAnswer: "true",
                  explanation:
                    "Roles bundle permissions; conditions further scope them by attributes like time or resource.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are best practices for GCP IAM?",
                  multiSelectOptions: [
                    { text: "Prefer predefined roles over primitive roles", isCorrect: true },
                    { text: "Grant service accounts least privilege", isCorrect: true },
                    { text: "Share root passwords with the whole team", isCorrect: false },
                    { text: "Use conditions to scope access", isCorrect: true },
                  ],
                  explanation:
                    "Predefined roles, least privilege, and conditions are the standard hardening practice; shared root passwords are forbidden.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each IAM concept to its meaning.",
                  matchPairs: [
                    { left: "Role", right: "Bundle of permissions" },
                    { left: "Member", right: "Who gets the role" },
                    { left: "Service account", right: "Machine identity" },
                    { left: "Condition", right: "Scopes when permission applies" },
                  ],
                  explanation:
                    "Roles are permission bundles, members are the subjects, service accounts identify machines, and conditions scope the grant.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question: "Order how a Cloud Run service gains access to a GCS bucket.",
                  sequenceItems: [
                    { id: "bind", text: "Role is bound to the service account" },
                    { id: "assume", text: "Cloud Run runs with the service account" },
                    { id: "sign", text: "Requests are signed with its identity" },
                    { id: "eval", text: "IAM evaluates role and conditions" },
                    { id: "allow", text: "Bucket read is allowed" },
                  ],
                  sequenceCorrectOrder: ["bind", "assume", "sign", "eval", "allow"],
                  explanation:
                    "Bind the role → run as the account → sign requests → evaluate IAM → allow the read.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "An IAM identity used only by machines, never by people, is a ___ account.",
                  fillBlanks: [{ answer: "service" }],
                  explanation:
                    "Service accounts are purpose-built machine identities.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Event-Driven Computing",
      description: "Cloud Functions and Pub/Sub.",
      slug: "event-driven",
      icon: "Zap",
      units: [
        {
          title: "Functions as a Service",
          description: "Triggered, stateless, ephemeral.",
          slug: "cloud-functions",
          lessons: [
            {
              title: "Cloud Functions (2nd Gen)",
              description: "Event-driven functions on Cloud Run.",
              slug: "cloud-functions-2g",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain Cloud Functions 2nd gen event model",
                "Trigger functions from HTTP, Pub/Sub, and Storage",
                "Compare Cloud Functions vs Cloud Run",
              ],
              skills: [
                {
                  name: "cloud-functions",
                  description: "Build event-driven functions on GCP",
                },
              ],
              activities: [
                {
                  title: "Functions That React",
                  body: "**Cloud Functions 2nd gen** runs stateless functions in response to events. Under the hood it builds on **Cloud Run** — each invocation gets a container with your code. Supported triggers include **HTTP requests**, **Pub/Sub messages**, and **Cloud Storage object changes** (create, archive, finalize). The function scales to zero, bills per 100ms, and you never manage servers. Second-gen functions support **up to 2 GiB memory**, **concurrency**, and **v2identity** (service-account per function).",
                },
                {
                  title: "Example",
                  body: "A function triggers on `google.storage.object.finalize` to generate a thumbnail whenever a new image lands in a bucket — no polling, no servers, pure event.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Which GCP product runs stateless code in response to events without server management?",
                  options: [
                    "Cloud Functions",
                    "Compute Engine",
                    "BigQuery",
                    "Cloud Spanner",
                  ],
                  correctAnswer: "Cloud Functions",
                  explanation:
                    "Cloud Functions is the managed event-driven compute offering — serverless, ephemeral, and event-triggered.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Cloud Functions 2nd gen builds on Cloud Run under the hood.",
                  correctAnswer: "true",
                  explanation:
                    "Each 2nd gen function deploys as a Cloud Run service, inheriting its scaling, concurrency, and IAM model.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A function that triggers only when a new object lands in a bucket is said to react to a storage ___.",
                  fillBlanks: [{ answer: "event" }],
                  explanation:
                    "Object lifecycle transitions are exposed as events that Cloud Functions can subscribe to.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question:
                    "Match each Cloud Functions 2nd gen trigger to its event.",
                  matchPairs: [
                    {
                      left: "HTTP request",
                      right: "Direct invocation via URL",
                    },
                    {
                      left: "Pub/Sub message",
                      right: "Asynchronous event on a topic",
                    },
                    {
                      left: "Storage finalize",
                      right: "Object creation in a bucket",
                    },
                    {
                      left: "Firestore write",
                      right: "Document change in a collection",
                    },
                  ],
                  explanation:
                    "Each trigger type maps to one or more GCP event sources that fire your function code.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "Order the steps when a Pub/Sub message triggers a Cloud Function.",
                  sequenceItems: [
                    {
                      id: "publish",
                      text: "Message is published to the topic",
                    },
                    {
                      id: "fan-out",
                      text: "Subscription delivers to subscribers",
                    },
                    {
                      id: "invoke",
                      text: "Cloud Functions invokes your handler",
                    },
                    {
                      id: "process",
                      text: "Function processes the message",
                    },
                    {
                      id: "ack",
                      text: "Acknowledgement sent back to Pub/Sub",
                    },
                  ],
                  sequenceCorrectOrder: [
                    "publish",
                    "fan-out",
                    "invoke",
                    "process",
                    "ack",
                  ],
                  explanation:
                    "Publish → subscription delivery → function invocation → processing → acknowledgement.",
                },
                {
                  type: "scenario",
                  difficulty: "advanced",
                  question:
                    "You are building a thumbnail generator: images upload to a bucket, you need messaging to fan out events, and functions to process each upload. Identify the GCP service for each role.",
                  parts: [
                    {
                      prompt:
                        "Which GCP service stores the uploaded original images?",
                      correctAnswer: "Cloud Storage",
                    },
                    {
                      prompt:
                        "Which messaging service fans out events to subscribers?",
                      correctAnswer: "Pub/Sub",
                    },
                    {
                      prompt:
                        "Which compute service runs your thumbnail generation code?",
                      correctAnswer: "Cloud Functions",
                    },
                  ],
                  explanation:
                    "Storage holds the images, Pub/Sub distributes events, and Cloud Functions runs the processing logic.",
                },
              ],
            },
          ],
        },
        {
          title: "Managed Messaging",
          description: "Pub/Sub topics and subscriptions.",
          slug: "pub-sub",
          lessons: [
            {
              title: "Pub/Sub Messaging",
              description: "Asynchronous event streaming at scale.",
              slug: "pub-sub",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain topics and subscriptions",
                "Contrast push and pull subscriptions",
                "Describe at-least-once delivery guarantees",
              ],
              skills: [
                {
                  name: "pub-sub",
                  description: "Design event-driven systems with Pub/Sub",
                },
              ],
              activities: [
                {
                  title: "Publish, Subscribe, Deliver",
                  body: "**Pub/Sub** is a fully managed, serverless messaging bus. Producers publish messages to **topics**; **subscriptions** deliver those messages to consumers. Two delivery modes: **pull** (the subscriber polls the subscription) and **push** (Pub/Sub makes an HTTP POST to your endpoint). Messages are retained for up to 31 days and delivered **at-least-once** — your code must be idempotent. Ordering guarantees exist only when a **message ordering key** is set.",
                },
                {
                  title: "Example",
                  body: "An order service publishes an `order.created` event to a topic. A Pub/Sub subscription pushes the event to a Cloud Function, which writes an email to a queue — decoupling the two systems.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "In Pub/Sub, what is the logical endpoint to which all subscribers listen?",
                  options: [
                    "Topic",
                    "Bucket",
                    "Instance",
                    "Load Balancer",
                  ],
                  correctAnswer: "Topic",
                  explanation:
                    "Publishers send to topics; subscriptions attached to those topics deliver to subscribers.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Pub/Sub delivers every message at least once, so subscribers must be idempotent.",
                  correctAnswer: "true",
                  explanation:
                    "At-least-once delivery means duplicates are possible; your handler must tolerate them.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A subscriber that receives messages via an HTTP POST request is using a ___ subscription.",
                  fillBlanks: [{ answer: "push" }],
                  explanation:
                    "Push subscriptions have Pub/Sub make an HTTP POST to your endpoint rather than requiring the client to poll.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the Pub/Sub concept to its role.",
                  matchPairs: [
                    {
                      left: "Topic",
                      right: "Logical channel for messages",
                    },
                    {
                      left: "Subscription",
                      right: "Delivers messages to a subscriber",
                    },
                    {
                      left: "Push delivery",
                      right: "Pub/Sub POSTs to an endpoint",
                    },
                    {
                      left: "Pull delivery",
                      right: "Subscriber polls the subscription",
                    },
                  ],
                  explanation:
                    "Topics hold messages, subscriptions route them, and push/pull are the two delivery modes.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question:
                    "Order the steps of a message flowing through Pub/Sub from publisher to consumer.",
                  sequenceItems: [
                    {
                      id: "publish",
                      text: "Publisher sends a message to a topic",
                    },
                    {
                      id: "retain",
                      text: "Pub/Sub retains the message",
                    },
                    {
                      id: "fan-out",
                      text: "All active subscriptions receive a copy",
                    },
                    {
                      id: "deliver",
                      text: "Message is delivered via push or pulled",
                    },
                    {
                      id: "ack",
                      text: "Consumer acknowledges the message",
                    },
                  ],
                  sequenceCorrectOrder: [
                    "publish",
                    "retain",
                    "fan-out",
                    "deliver",
                    "ack",
                  ],
                  explanation:
                    "Publish → retain → fan-out to subscriptions → deliver → acknowledgement.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question:
                    "Which characteristics describe Pub/Sub delivery behavior?",
                  multiSelectOptions: [
                    {
                      text: "At-least-once delivery by default",
                      isCorrect: true,
                    },
                    {
                      text: "Exactly-once delivery without any configuration",
                      isCorrect: false,
                    },
                    {
                      text: "Message retention up to 31 days",
                      isCorrect: true,
                    },
                    {
                      text: "Ordering only when using an ordering key",
                      isCorrect: true,
                    },
                  ],
                  explanation:
                    "Pub/Sub is at-least-once and retains messages for up to 31 days. Strict ordering requires an ordering key; exactly-once requires special handling.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A message sent to a Pub/Sub topic is delivered to all ___ attached to that topic.",
                  fillBlanks: [{ answer: "subscriptions" }],
                  explanation:
                    "Every active subscription receives its own copy of each published message.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};