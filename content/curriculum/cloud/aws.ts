import type { SeedPath } from "@/lib/curriculum/seed";

export const awsPath: SeedPath = {
  title: "Amazon Web Services",
  description:
    "Compute, storage, databases, networking, and IAM on the world's largest cloud — the core services behind most deployments.",
  slug: "aws",
  crossReferences: [
    {
      careerSlug: "devops",
      pathSlug: "linux",
      title: "Linux Fundamentals",
      note: "Shell and SSH fluency for EC2 instances and troubleshooting.",
    },
    {
      careerSlug: "cloud",
      pathSlug: "networking",
      title: "Cloud Networking",
      note: "IP, DNS, and HTTP fundamentals before designing VPCs.",
    },
  ],
  modules: [
    {
      title: "Compute",
      description: "EC2, Lambda, and autoscaling.",
      slug: "compute",
      icon: "Cpu",
      units: [
        {
          title: "Virtual Machines",
          description: "EC2 instances and how to choose them.",
          slug: "ec2",
          lessons: [
            {
              title: "EC2 Instances",
              description: "Compute capacity on demand.",
              slug: "ec2-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain what an EC2 instance is",
                "Choose instance families for workloads",
                "Describe AMIs, instance types, and pricing models",
              ],
              skills: [
                { name: "ec2", description: "Provision and reason about EC2 instances" },
              ],
              activities: [
                {
                  title: "Virtual Servers",
                  body: "**EC2** gives you virtual machines on demand. You pick an **AMI** (the baked-in OS image), an **instance type** (vCPU + memory + storage), a **networking** placement, and a **key pair** for SSH. Families exist by workload: `t` burstable general purpose, `c` compute-optimized, `m` memory-optimized, `r` memory-heavy, `g` GPU. You pay per second, and **reserved instances** or **savings plans** cut costs for steady workloads.",
                },
                {
                  title: "Example",
                  body: "A lightweight API server might run on `t3.micro` (2 vCPU, 1 GiB RAM, ~1h free tier) while a batch data job uses a `c6i.xlarge` compute-optimized box.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does EC2 stand for?",
                  options: [
                    "Elastic Compute Cloud",
                    "Enhanced Container Computing",
                    "Elastic Container Cloud",
                    "Enterprise Cloud Center",
                  ],
                  correctAnswer: "Elastic Compute Cloud",
                  explanation:
                    "EC2 is Amazon's Elastic Compute Cloud — virtual machines on demand.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which instance families match the stated workload?",
                  multiSelectOptions: [
                    { text: "t-family for low-cost general purpose", isCorrect: true },
                    { text: "c-family for CPU-intensive jobs", isCorrect: true },
                    { text: "r-family for large in-memory caches", isCorrect: true },
                    { text: "g-family for tiny web servers", isCorrect: false },
                  ],
                  explanation:
                    "t is general purpose, c is compute-heavy, r is RAM-heavy; g-family is for GPU/GPGPU work.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A key pair is used to authenticate SSH connections to an EC2 instance.",
                  correctAnswer: "true",
                  explanation:
                    "The instance holds the private key side of the pair; you authenticate with your matching private key over SSH.",
                },
                {
                  type: "match",
                  difficulty: "advanced",
                  question: "Match each instance family to its bias.",
                  matchPairs: [
                    { left: "t3", right: "Burstable general purpose" },
                    { left: "c6i", right: "Compute optimized" },
                    { left: "r6i", right: "Memory optimized" },
                    { left: "g5", right: "GPU workloads" },
                  ],
                  explanation:
                    "t = burstable general purpose, c = compute, r = memory, g = GPU.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "An ___ (AMI) is a pre-built machine image containing the OS and software baked into the instance.",
                  fillBlanks: [{ answer: "Amazon Machine Image|AMI" }],
                  explanation:
                    "The Amazon Machine Image is the OS snapshot used to launch an instance.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You need to SSH into a brand-new t3.micro web instance in a public subnet so you can configure nginx.",
                  parts: [
                    {
                      prompt:
                        "Type the standard SSH command connecting as user ec2-user to the public IP 54.1.2.3 using key file ~/.ssh/web.pem.",
                      correctAnswer:
                        "ssh -i ~/.ssh/web.pem ec2-user@54.1.2.3",
                    },
                    {
                      prompt:
                        "On the instance, type the command that confirms your operating system (distribution) and version.",
                      correctAnswer:
                        "cat /etc/os-release|cat /etc/os-release && cat /etc/redhat-release|hostnamectl",
                    },
                  ],
                  explanation:
                    "ssh -i gives the key file and user@IP the target; /etc/os-release identifies the distro.",
                },
              ],
            },
            {
              title: "Lambda",
              description: "Serverless functions in the cloud.",
              slug: "lambda",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the serverless execution model",
                "Describe the Lambda invocation and pricing model",
                "Identify cold starts and how to mitigate them",
              ],
              skills: [
                { name: "lambda", description: "Run code without provisioning servers" },
              ],
              activities: [
                {
                  title: "Run Code, Not Servers",
                  body: "**Lambda** executes your code in response to events (API calls, S3 uploads, queue messages) without you managing servers. You set memory and a **timeout** (max 15 minutes), AWS runs the function on ephemeral containers, and you **only pay for invocation time** while the function runs. A **cold start** happens when a new container must spin up — provisioning concurrency keeps instances warm for latency-sensitive paths.",
                },
                {
                  title: "Example",
                  body: "An image-resize function triggers on every S3 upload to the `incoming/` prefix and writes thumbnails to `processed/`. No server is ever provisioned.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How is a typical Lambda function billed?",
                  options: [
                    "By the month per instance",
                    "By invocation time while running",
                    "A flat annual fee regardless of use",
                    "Per gigabyte of storage reserved",
                  ],
                  correctAnswer: "By invocation time while running",
                  explanation:
                    "Lambda bills per invocation, scaled by memory configured and duration of execution — free tier includes 1M invocations/month.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Lambda functions have a hard 15-minute execution timeout.",
                  correctAnswer: "true",
                  explanation:
                    "The maximum timeout is 900 seconds (15 min), so Lambda suits event-driven short jobs, not long-running workers.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order what happens when an object is uploaded to S3 and triggers a Lambda.",
                  sequenceItems: [
                    { id: "upload", text: "Object lands in the S3 bucket" },
                    { id: "event", text: "S3 emits an event notification" },
                    { id: "invoke", text: "Lambda runs the mapped function" },
                    { id: "process", text: "Function processes the object" },
                    { id: "bill", text: "AWS bills for execution duration" },
                  ],
                  sequenceCorrectOrder: ["upload", "event", "invoke", "process", "bill"],
                  explanation:
                    "Upload → event → invoke → process → meter/bill. This is the classic serverless event flow.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "The delay when a new Lambda container has to spin up before your first request is called a ___ start.",
                  fillBlanks: [{ answer: "cold" }],
                  explanation:
                    "Cold starts occur when no warm container is idle; keeping concurrency warm mitigates them.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which workloads are a poor fit for Lambda?",
                  multiSelectOptions: [
                    { text: "Long-running worker jobs over 15 minutes", isCorrect: true },
                    { text: "Ephemeral API handlers", isCorrect: false },
                    { text: "WebSocket servers holding persistent connections", isCorrect: true },
                    { text: "Scheduled cron-style maintenance", isCorrect: false },
                  ],
                  explanation:
                    "Lambda's 15-minute cap and short-lived container model make long-running workers and stateful connections poor fits.",
                },
              ],
            },
          ],
        },
        {
          title: "Scaling Compute",
          description: "Autoscaling groups and elasticity.",
          slug: "scaling-compute",
          lessons: [
            {
              title: "Auto Scaling",
              description: "Scale EC2 fleets to match demand.",
              slug: "auto-scaling",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain an Auto Scaling group",
                "Describe scaling policies and cooldowns",
                "Relate ASGs to load balancers",
              ],
              skills: [
                { name: "auto-scaling", description: "Scale compute fleets automatically" },
              ],
              activities: [
                {
                  title: "Elasticity",
                  body: "An **Auto Scaling group (ASG)** keeps a minimum/maximum/desired count of instances. **Target tracking policies** scale out when CPU crosses a threshold and scale in when idle. With the ASG attached to a **load balancer**, new instances join the target group only after passing the health check. Debounce churn with **cooldowns** so instances are not launched and terminated in a flapping loop.",
                },
                {
                  title: "Example",
                  body: "Desired=2, min=2, max=8. When CPU hits 70% for 3 minutes, the ASG adds instances one step at a time until demand settles or the max is reached.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "An Auto Scaling group's 'desired capacity' means:",
                  options: [
                    "How many instances should run right now",
                    "The absolute maximum it can ever reach",
                    "The number of AZs it spans",
                    "How fast instances boot",
                  ],
                  correctAnswer: "How many instances should run right now",
                  explanation:
                    "Desired capacity is the number the ASG works to maintain. Min and max bound it.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "New instances launched by an ASG are only registered with its load balancer after passing the health check.",
                  correctAnswer: "true",
                  explanation:
                    "Instances stay 'unhealthy' until the ELB health check passes, so traffic is not sent to a booting box.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the ASG events when CPU crosses the scale-out threshold.",
                  sequenceItems: [
                    { id: "metric", text: "CloudWatch CPU metric crosses threshold" },
                    { id: "policy", text: "Target-tracking policy fires" },
                    { id: "launch", text: "ASG launches a new instance" },
                    { id: "register", text: "Instance passes health check" },
                    { id: "route", text: "Load balancer begins routing traffic" },
                  ],
                  sequenceCorrectOrder: ["metric", "policy", "launch", "register", "route"],
                  explanation:
                    "Metric → policy → launch → health check → service. Scale-in reverses the same loop.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each ASG setting to its meaning.",
                  matchPairs: [
                    { left: "Min size", right: "Never run fewer instances" },
                    { left: "Max size", right: "Never run more instances" },
                    { left: "Cooldown", right: "Pause between scaling actions" },
                    { left: "Health check grace", right: "Wait before judging a new instance" },
                  ],
                  explanation:
                    "Min/max bound the fleet, cooldowns dampen flapping, and the health-check grace period lets instances boot.",
                },
                {
                  type: "fill_blank",
                  difficulty: "advanced",
                  question:
                    "A scale-___ policy removes instances during low demand to reduce cost.",
                  fillBlanks: [{ answer: "in" }],
                  explanation:
                    "Scale-in terminates instances when utilization drops; scale-out adds them.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Storage",
      description: "S3, EBS, and EFS.",
      slug: "storage",
      icon: "Database",
      units: [
        {
          title: "Object Storage",
          description: "S3 and its durability guarantees.",
          slug: "object-storage",
          lessons: [
            {
              title: "S3",
              description: "Object storage at web scale.",
              slug: "s3",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain S3's object model: buckets, keys, versions",
                "Describe S3 durability and storage classes",
                "Secure buckets with policies and bucket versioning",
              ],
              skills: [
                { name: "s3", description: "Store and serve objects in S3" },
              ],
              activities: [
                {
                  title: "Objects in Buckets",
                  body: "**S3** stores **objects** (files + metadata) inside globally-unique **buckets**, addressed by **key** like `s3://my-bucket/images/photo.png`. Buckets are 11 nines durable (99.999999999%) — objects are replicated across at least three AZs. Storage classes trade price for access speed: **Standard** for hot data, **Glacier** for archives. **Versioning** keeps old copies of every key, and **bucket policies** control who can read/write.",
                },
                {
                  title: "Example",
                  body: "`aws s3 sync ./build s3://my-static-site` uploads a site. Combined with a bucket policy allowing public GetObject, that bucket becomes a cheap static website.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which protocol does the AWS CLI use to talk to S3 by default over HTTPS?",
                  options: ["REST", "FTP", "WebDAV", "SMTP"],
                  correctAnswer: "REST",
                  explanation:
                    "S3 is a RESTful web service; every CLI operation is an HTTP(S) API call signed with your credentials.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which S3 features improve data protection?",
                  multiSelectOptions: [
                    { text: "Bucket versioning", isCorrect: true },
                    { text: "Cross-region replication", isCorrect: true },
                    { text: "Public read bucket policy", isCorrect: false },
                    { text: "Lifecycle rules to Glacier", isCorrect: true },
                  ],
                  explanation:
                    "Versioning, replication, and lifecycle archiving all protect data; a public read policy is an exposure, not protection.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "S3 bucket names must be globally unique across all AWS accounts.",
                  correctAnswer: "true",
                  explanation:
                    "Bucket names live in a global namespace — you cannot reuse a name someone else owns.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "You accidentally deleted a file from an S3 bucket and need to know whether versioning had been enabled on it.",
                  parts: [
                    {
                      prompt:
                        "Type the AWS CLI command that lists all versions for the object data/config.json in bucket acme-data.",
                      correctAnswer:
                        "aws s3api list-object-versions --bucket acme-data --prefix data/config.json",
                    },
                    {
                      prompt:
                        "Versioning is on. Type the CLI command that shows the bucket's current versioning status.",
                      correctAnswer:
                        "aws s3api get-bucket-versioning --bucket acme-data",
                    },
                  ],
                  explanation:
                    "list-object-versions shows every stored version; if none appear, the delete removed the only copy because versioning was off.",
                },
                {
                  type: "match",
                  difficulty: "advanced",
                  question: "Match each S3 storage class to its best use.",
                  matchPairs: [
                    { left: "S3 Standard", right: "Frequently accessed hot data" },
                    { left: "S3 Intelligent-Tiering", right: "Patterns that move between tiers" },
                    { left: "S3 Glacier", right: "Long-term cold archives" },
                    { left: "S3 One Zone-IA", right: "Rarely read, recreate-able data" },
                  ],
                  explanation:
                    "Standard suits hot data, Intelligent-Tiering guesses the tier, Glacier is archives, and One Zone-IA trades durability for cost.",
                },
                {
                  type: "word_scramble",
                  difficulty: "intermediate",
                  question: "Unscramble the word that describes S3's ~11 nines durability:",
                  scrambledWord: "durable",
                  explanation:
                    "S3 is engineered to be extremely durable — 99.999999999% annual durability.",
                },
              ],
            },
            {
              title: "Block Storage",
              description: "EBS volumes and snapshots.",
              slug: "ebs",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain EBS volumes attached to a single instance",
                "Describe snapshots for backup",
                "Choose gp3 vs io2 volume types",
              ],
              skills: [
                { name: "ebs", description: "Attach and back up block storage" },
              ],
              activities: [
                {
                  title: "Disks That Travel",
                  body: "An **EBS volume** is a network-attached block device tied to **one** EC2 instance in **one** AZ. It persists independently of the instance, so you can attach it elsewhere or back it up with **snapshots** (stored in S3, incremental). Common types: `gp3` balanced SSD for most work, `io2` for high-IOPS databases. EFS, by contrast, is a shared file system mountable by many instances at once.",
                },
                {
                  title: "Example",
                  body: "gp3 gives up to 3,000 IOPS baseline at a fixed cost, while io2 Block Express pushes past 200K sustained IOPS for serious databases.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How many EC2 instances can an EBS volume be attached to at once?",
                  options: ["One", "Two", "Unlimited", "Five"],
                  correctAnswer: "One",
                  explanation:
                    "An EBS volume attaches to a single instance in a single AZ (multi-attach is a niche io2 feature).",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "EBS snapshots are stored in S3 and are incremental after the first.",
                  correctAnswer: "true",
                  explanation:
                    "Snapshots live in S3; subsequent snapshots only store changed blocks, saving cost.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A snapshot that records only the blocks that changed since the last snapshot is called ___.",
                  fillBlanks: [{ answer: "incremental" }],
                  explanation:
                    "Incremental snapshots capture changed blocks only, making back-ups fast and cheap.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each storage service to its access model.",
                  matchPairs: [
                    { left: "EBS", right: "Block device for one instance" },
                    { left: "EFS", right: "Shared file system for many instances" },
                    { left: "S3", right: "Object storage over HTTP" },
                    { left: "Snapshot", right: "Point-in-time backup" },
                  ],
                  explanation:
                    "EBS is block storage, EFS is a shared FS, S3 is object storage, and snapshots back EBS up.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps to move an EBS volume to another region using snapshots.",
                  sequenceItems: [
                    { id: "snapshot", text: "Create a snapshot of the source volume" },
                    { id: "copy", text: "Copy the snapshot to the destination region" },
                    { id: "restore", text: "Create a volume from the snapshot in the destination region" },
                    { id: "attach", text: "Attach the new volume to an instance" },
                  ],
                  sequenceCorrectOrder: ["snapshot", "copy", "restore", "attach"],
                  explanation:
                    "Snapshots are region-scoped, so cross-region movement is snapshot, copy snapshot, restore a volume, then attach.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Databases",
      description: "RDS and DynamoDB.",
      slug: "databases",
      icon: "DatabaseZap",
      units: [
        {
          title: "Managed Databases",
          description: "RDS and serverless NoSQL.",
          slug: "managed-databases",
          lessons: [
            {
              title: "RDS",
              description: "Managed relational databases.",
              slug: "rds",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain what RDS manages for you",
                "Describe read replicas and multi-AZ",
                "Choose RDS engines",
              ],
              skills: [
                { name: "rds", description: "Run managed relational databases" },
              ],
              activities: [
                {
                  title: "Your Database, Managed",
                  body: "**RDS** runs PostgreSQL, MySQL, MariaDB, SQL Server, or Oracle with the operations handled: patching, backups, scaling, and replication. **Multi-AZ** mirrors your database to a standby in another AZ for failover. **Read replicas** offload read traffic and are critical for heavy reporting loads. You still write SQL — RDS just removes the babysitting.",
                },
                {
                  title: "Example",
                  body: "A production web app uses an RDS PostgreSQL `db.m6g.large` in Multi-AZ with one read replica for analytics queries.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which of these is a benefit of RDS versus running your own PostgreSQL?",
                  options: [
                    "Automated backups and patching",
                    "Free unlimited storage",
                    "No need for security groups",
                    "Guaranteed SQL compatibility with DynamoDB",
                  ],
                  correctAnswer: "Automated backups and patching",
                  explanation:
                    "RDS automates operations — backups, patching, failover — so you focus on the schema and queries.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A multi-AZ RDS deployment uses a synchronous standby for automatic failover.",
                  correctAnswer: "true",
                  explanation:
                    "Multi-AZ keeps a standby in another AZ; if the primary fails, RDS fails over with minimal downtime.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "When would you add an RDS read replica?",
                  multiSelectOptions: [
                    { text: "Heavy reporting queries slow the primary", isCorrect: true },
                    { text: "You need to failover instantly on write disruption", isCorrect: false },
                    { text: "Analytics can tolerate slightly stale data", isCorrect: true },
                    { text: "You want a second AZ for reads", isCorrect: true },
                  ],
                  explanation:
                    "Read replicas absorb read load. Failover for writes is a Multi-AZ concern, not a replica's job.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each RDS term to its meaning.",
                  matchPairs: [
                    { left: "Multi-AZ", right: "Synchronous standby for failover" },
                    { left: "Read replica", right: "Async copy for reads" },
                    { left: "Snapshot", right: "Point-in-time backup" },
                    { left: "Parameter group", right: "Engine configuration knobs" },
                  ],
                  explanation:
                    "Multi-AZ provides failover, replicas serve reads, snapshots back up, and parameter groups tune the engine.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "An RDS deployment across two availability zones for automatic failover is called multi-___.",
                  fillBlanks: [{ answer: "AZ" }],
                  explanation:
                    "Multi-AZ replicates synchronously to a standby in another availability zone.",
                },
              ],
            },
            {
              title: "DynamoDB",
              description: "Fully managed NoSQL at any scale.",
              slug: "dynamodb",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the DynamoDB item/table model",
                "Use partition and sort keys",
                "Describe on-demand vs provisioned capacity",
              ],
              skills: [
                { name: "dynamodb", description: "Model and query NoSQL tables" },
              ],
              activities: [
                {
                  title: "Key-Value Speed",
                  body: "**DynamoDB** is a fully managed NoSQL database with single-digit **millisecond** reads. Each **item** is a record addressed by a **partition key** (and optionally a **sort key** for range queries) — that is the primary key. Capacity is either **on-demand** (you pay per request) or **provisioned** (fixed read/write units with autoscaling). It is the natural fit for session stores, feature flags, and high-scale APIs.",
                },
                {
                  title: "Example",
                  body: "A gaming leaderboard table keys on `playerId` (partition) and `score` (sort) — fast lookups per player plus range scans by score.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does DynamoDB use as the required part of every item's primary key?",
                  options: [
                    "Partition key",
                    "Foreign key",
                    "Timestamp",
                    "Auto-increment ID",
                  ],
                  correctAnswer: "Partition key",
                  explanation:
                    "Every item needs a partition key; an optional sort key enables range queries within a partition.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "DynamoDB is a perfectly fine choice for complex JOIN-heavy relational reporting.",
                  correctAnswer: "false",
                  explanation:
                    "DynamoDB has no JOINs. It is built for fast key/value access — use a relational database for joins.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each the DynamoDB concept to its role.",
                  matchPairs: [
                    { left: "Partition key", right: "Distributes items across shards" },
                    { left: "Sort key", right: "Orders items within a partition" },
                    { left: "Item", right: "A single record" },
                    { left: "On-demand", right: "Pay per request" },
                  ],
                  explanation:
                    "Partition keys shard data, sort keys order within a partition, items are records, and on-demand meters per request.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "DynamoDB is designed for single-digit ___ latency (msec) reads at any scale.",
                  fillBlanks: [{ answer: "millisecond" }],
                  explanation:
                    "Its architecture targets single-digit millisecond reads — that speed is the main reason teams choose it.",
                },
                {
                  type: "word_scramble",
                  difficulty: "intermediate",
                  question: "Unscramble the NoSQL term:",
                  scrambledWord: "nosql",
                  explanation:
                    "DynamoDB is a NoSQL database — schemaless key-value and document storage.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Networking & IAM",
      description: "VPCs, subnets, and identity.",
      slug: "networking-iam",
      icon: "Network",
      units: [
        {
          title: "Virtual Networking",
          description: "VPCs, subnets, security groups.",
          slug: "vpc",
          lessons: [
            {
              title: "VPCs and Subnets",
              description: "Isolate and segment cloud networks.",
              slug: "vpc-subnets",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain a VPC and CIDR planning",
                "Describe public vs private subnets",
                "Explain internet and NAT gateways",
              ],
              skills: [
                { name: "vpc", description: "Design isolated cloud networks" },
              ],
              activities: [
                {
                  title: "Your Own Network",
                  body: "A **VPC** is your isolated slice of the AWS network. Within it you carve **subnets** from the CIDR range: **public subnets** have a route to an **internet gateway**; **private subnets** route out through a **NAT gateway** instead. Best practice is to keep databases in private subnets so only the app tier can reach them — nothing else even has a route to them.",
                },
                {
                  title: "Example",
                  body: "VPC 10.0.0.0/16 with a public subnet 10.0.1.0/24 for the web tier and a private subnet 10.0.2.0/24 for the database.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What connects a public subnet to the internet?",
                  options: [
                    "Internet gateway",
                    "NAT gateway",
                    "VPC peering",
                    "Direct Connect",
                  ],
                  correctAnswer: "Internet gateway",
                  explanation:
                    "An internet gateway lets public subnets talk to the internet. NAT lets private subnets reach out while staying inbound-closed.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "An instance in a private subnet can initiate outbound HTTPS if a NAT gateway is present.",
                  correctAnswer: "true",
                  explanation:
                    "NAT gateways allow outbound-only connections — private instances can fetch updates but cannot be reached from outside.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which statements about VPC CIDR ranges are true?",
                  multiSelectOptions: [
                    { text: "Overlapping VPCs cannot be peered directly", isCorrect: true },
                    { text: "Subnets inherit the CIDR range of the VPC", isCorrect: true },
                    { text: "A VPC can hold subnets in multiple AZs", isCorrect: true },
                    { text: "A subnet can span multiple AZs", isCorrect: false },
                  ],
                  explanation:
                    "Subnets are carved from the VPC range, cannot overlap across peered VPCs, and live within a single AZ.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "A web client requests your site. Order the network path.",
                  sequenceItems: [
                    { id: "dns", text: "Client resolves the route53 alias" },
                    { id: "alb", text: "Request hits the load balancer in the public subnet" },
                    { id: "target", text: "ALB forwards to an app instance" },
                    { id: "inbound", text: "Security group allows TCP 443 inbound" },
                  ],
                  sequenceCorrectOrder: ["dns", "alb", "inbound", "target"],
                  explanation:
                    "DNS → load balancer edge → security group filter → backend target.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A VPC subnet with no route to the internet is called a ___ subnet.",
                  fillBlanks: [{ answer: "private" }],
                  explanation:
                    "Private subnets lack an internet gateway route; outbound uses NAT or nothing.",
                },
              ],
            },
            {
              title: "IAM Essentials",
              description: "Users, roles, and least privilege.",
              slug: "iam",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain IAM users, roles, and policies",
                "Describe the principle of least privilege",
                "Use conditions and MFA for hardening",
              ],
              skills: [
                { name: "iam", description: "Model identities and permissions" },
              ],
              activities: [
                {
                  title: "Who Can Do What",
                  body: "**IAM** manages identities and permissions. **Users** are people; **roles** are assumed by services or cross-account principals; **policies** are JSON documents granting actions on resources. **Least privilege** means granting only the actions actually needed. Policies can carry **conditions** (e.g. 'only if IP is the office', or 'only if MFA present'). An EC2 instance gets a role instead of hard-coded keys.",
                },
                {
                  title: "Example",
                  body: "A role for the app server grants `s3:GetObject` on `arn:aws:s3:::app-assets/*` — nothing more. No long-lived keys live on the instance.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which IAM construct is meant to be assumed by an EC2 instance rather than a person?",
                  options: ["Role", "User", "Password policy", "Access key pair"],
                  correctAnswer: "Role",
                  explanation:
                    "Roles are assume-able by services (EC2, Lambda). Users are for people; keys are credentials, not identities.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A policy grants access unless an explicit Deny overrides it.",
                  correctAnswer: "false",
                  explanation:
                    "Explicit Deny always wins in IAM, even over a broader Allow — Deny is evaluated first.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each IAM concept to its description.",
                  matchPairs: [
                    { left: "User", right: "Identity for a person" },
                    { left: "Role", right: "Assume-able identity for services" },
                    { left: "Policy", right: "JSON of permissions" },
                    { left: "Condition", right: "Limits when a permission applies" },
                  ],
                  explanation:
                    "Users identify people, roles serve machines, policies spell permissions, and conditions scope them.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question: "Order the steps of an app server reading an object from S3 via an instance role.",
                  sequenceItems: [
                    { id: "assume", text: "Instance assumes its role with temporary credentials" },
                    { id: "policy", text: "Policy check: s3:GetObject on the bucket" },
                    { id: "condition", text: "Conditions (if any) are evaluated" },
                    { id: "deny", text: "Explicit Deny is checked first" },
                    { id: "grant", text: "Request succeeds and the object streams back" },
                  ],
                  sequenceCorrectOrder: ["assume", "deny", "policy", "condition", "grant"],
                  explanation:
                    "Credentials → check explicit Deny → evaluate policy → conditions → grant or deny.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Granting only the minimum permissions required is called the principle of least ___.",
                  fillBlanks: [{ answer: "privilege" }],
                  explanation:
                    "Least privilege means every identity gets exactly the access it needs and no more.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the security term:",
                  scrambledWord: "multifactor",
                  explanation:
                    "Multi-factor authentication (MFA) is a second authentication factor beyond a password.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Deployment",
      description: "ECS, EKS, and CloudFormation.",
      slug: "deployment",
      icon: "Rocket",
      units: [
        {
          title: "Containers on AWS",
          description: "ECS and EKS in practice.",
          slug: "containers",
          lessons: [
            {
              title: "ECS vs EKS",
              description: "Choose your container platform.",
              slug: "ecs-eks",
              estimatedMinutes: 7,
              learningObjectives: [
                "Compare ECS and EKS",
                "Explain Fargate vs EC2 launch",
                "Describe services, tasks, and target groups",
              ],
              skills: [
                { name: "containers-aws", description: "Run containers on AWS" },
              ],
              activities: [
                {
                  title: "Two Container Homes",
                  body: "**ECS** is AWS's native container orchestrator: you define a **task** (container image, CPU, memory) and a **service** (desired count, networking, load balancer target). **EKS** is managed Kubernetes — pick it when you want portability or a K8s-native toolchain. Both can run on **Fargate** (no EC2 to manage) or on EC2 instances you own.",
                },
                {
                  title: "Example",
                  body: "A one-off migration script is an ECS task; a long-running API is an ECS service behind an ALB; a polyglot team already on Helm chooses EKS.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which AWS service is managed Kubernetes?",
                  options: ["EKS", "ECS", "Lightsail", "Elastic Beanstalk"],
                  correctAnswer: "EKS",
                  explanation:
                    "EKS is Amazon's managed Kubernetes; ECS is the native container orchestrator that is not Kubernetes.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "With Fargate, you pay for container vCPU and memory without managing EC2 instances.",
                  correctAnswer: "true",
                  explanation:
                    "Fargate removes the underlying EC2 layer — you pay per running container resources.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which of these describe an ECS Service (vs a one-off Task)?",
                  multiSelectOptions: [
                    { text: "It maintains a desired number of replicas", isCorrect: true },
                    { text: "It can register with a load balancer", isCorrect: true },
                    { text: "It runs once and exits", isCorrect: false },
                    { text: "It can be updated with rolling deployments", isCorrect: true },
                  ],
                  explanation:
                    "Services keep replicas running, join load balancers, and roll updates; one-off tasks run and exit.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each ECS concept to its role.",
                  matchPairs: [
                    { left: "Task definition", right: "Describes image, CPU, memory" },
                    { left: "Service", right: "Keeps replicas running" },
                    { left: "Task", right: "A single running container set" },
                    { left: "Target group", right: "Routes LB traffic to tasks" },
                  ],
                  explanation:
                    "Task definitions declare the shape, services maintain count, tasks are the runs, and target groups wire the LB.",
                },
                {
                  type: "fill_blank",
                  difficulty: "advanced",
                  question:
                    "ECS on Fargate requires ___ mode networking so each task gets its own private IP in the VPC.",
                  fillBlanks: [{ answer: "awsvpc" }],
                  explanation:
                    "awsvpc networking gives every Fargate task its own ENI and IP, so services work with security groups and ALBs.",
                },
              ],
            },
            {
              title: "Infrastructure as Code",
              description: "CloudFormation and IaC principles.",
              slug: "cloudformation",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain infrastructure as code",
                "Describe CloudFormation stacks and resources",
                "Relate CloudFormation to Terraform alternatives",
              ],
              skills: [
                { name: "iac", description: "Manage infrastructure declaratively" },
              ],
              activities: [
                {
                  title: "Desired State",
                  body: "**Infrastructure as code (IaC)** means your VPC, subnets, instances, and DBs are defined in templates instead of clicked in a console. **CloudFormation** renders a template (YAML/JSON) into a **stack** and creates, updates, or deletes resources to match the desired state. Failed updates **roll back** automatically. Terraform is the popular tool-agnostic alternative with the same philosophy.",
                },
                {
                  title: "Example",
                  body: "A template declaring one VPC, one security group, and one instance lets you recreate the whole environment in another region by changing a parameter.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does CloudFormation create when it processes a template?",
                  options: ["A stack", "A container", "A snapshot", "An AMI"],
                  correctAnswer: "A stack",
                  explanation:
                    "CloudFormation turns a template into a stack — a group of related resources managed as one unit.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "If a CloudFormation stack update fails, CloudFormation rolls the stack back to its last known-good state.",
                  correctAnswer: "true",
                  explanation:
                    "Rollback is the default behavior on failed changes — a key safety property of IaC.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the lifecycle of a CloudFormation stack.",
                  sequenceItems: [
                    { id: "write", text: "Author the template (YAML/JSON)" },
                    { id: "create", text: "Create the stack from the template" },
                    { id: "provision", text: "CloudFormation provisions resources" },
                    { id: "update", text: "App-spec changes trigger updates" },
                    { id: "delete", text: "Delete tears down everything" },
                  ],
                  sequenceCorrectOrder: ["write", "create", "provision", "update", "delete"],
                  explanation:
                    "Author → create → provision → update → delete. The whole lifecycle is declarative.",
                },
                {
                  type: "match",
                  difficulty: "advanced",
                  question: "Match each IaC term to its meaning.",
                  matchPairs: [
                    { left: "Template", right: "Declarative resource definition" },
                    { left: "Stack", right: "One managed group of resources" },
                    { left: "Rollback", right: "Revert on failed change" },
                    { left: "Drift", right: "Live resources differ from the template" },
                  ],
                  explanation:
                    "Templates define resources, stacks manage groups, rollback protects updates, and drift detects manual changes.",
                },
                {
                  type: "fill_blank",
                  difficulty: "advanced",
                  question:
                    "When the real-world infrastructure no longer matches the template, the stack is said to have ___.",
                  fillBlanks: [{ answer: "drift" }],
                  explanation:
                    "Drift detection compares your live resources with the template so manual console edits get caught.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};