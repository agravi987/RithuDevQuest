import type { SeedPath } from "@/lib/curriculum/seed";

export const kubernetesPath: SeedPath = {
  title: "Kubernetes Orchestration",
  description:
    "Deploy, scale, and operate containerized applications with Kubernetes.",
  slug: "kubernetes",
  modules: [
    {
      title: "Fundamentals",
      description: "The control plane, nodes, and declarative API.",
      slug: "fundamentals",
      icon: "Boxes",
      units: [
        {
          title: "Architecture",
          description: "How the cluster is put together.",
          slug: "architecture",
          lessons: [
            {
              title: "Cluster Components",
              description:
                "kube-apiserver, etcd, scheduler, kubelet.",
              slug: "cluster-components",
              estimatedMinutes: 7,
              learningObjectives: [
                "Name the core control plane components",
                "Explain the role of the kubelet on nodes",
                "Describe how user requests flow through the API server",
              ],
              skills: [
                { name: "k8s-architecture", description: "Understand the Kubernetes architecture" },
              ],
              activities: [
                {
                  title: "The Pieces",
                  body: "The **control plane** (kube-apiserver, etcd, scheduler, controller-manager) makes decisions. The **nodes** run kubelet, which talks to the API server and manages the container runtime. Users talk to `kube-apiserver` — the single entry point and source of truth.",
                },
                {
                  title: "Speak of the API",
                  body: "Every tool in Kubernetes (kubectl included) is a client of the API server. Nothing else touches the nodes directly.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is the single entry point for all API requests?",
                  options: ["etcd","kube-apiserver","kubelet","scheduler"],
                  correctAnswer: "kube-apiserver",
                  explanation: "kube-apiserver is the front door for everything.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "etcd stores the cluster's desired and actual state.",
                  correctAnswer: "true",
                  explanation: "etcd is the distributed key-value store holding all cluster data.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that lists all cluster nodes.",
                  correctAnswer: "kubectl get nodes",
                  explanation: "kubectl get nodes shows all nodes with status.",
                },
              ],
            },
            {
              title: "Declarative Desired State",
              description:
                "You describe the goal; Kubernetes makes it so.",
              slug: "declarative-state",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain desired state and reconciliation",
                "Contrast declarative with imperative operations",
                "Understand why the API matters",
              ],
              skills: [
                { name: "desired-state", description: "Reason about declarative infrastructure" },
              ],
              activities: [
                {
                  title: "Declare It",
                  body: "You give Kubernetes a **desired state** (three replicas, image v2, port 8080). Controllers continuously **reconcile**: if reality drifts (a pod dies), they steer it back. This is why you apply YAML instead of running step-by-step commands.",
                },
                {
                  title: "The Feedback Loop",
                  body: "Self-healing, rollout, and scaling all fall out of the same reconcile loop — once you internalize it, Kubernetes stops being mysterious.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is reconciliation in Kubernetes?",
                  options: ["Manual admin intervention","Controllers continuously comparing desired to actual state","Deleting old resources","Scaling pods"],
                  correctAnswer: "Controllers continuously comparing desired to actual state",
                  explanation: "Controllers watch the API server and take action to match declared YAML.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "You declare desired state and the system makes it so.",
                  correctAnswer: "true",
                  explanation: "You apply YAML manifests, controllers reconcile to match.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that applies a manifest file.",
                  correctAnswer: "kubectl apply -f manifest.yaml",
                  explanation: "kubectl apply declares desired state from YAML.",
                },
              ],
            },
          ],
        },
        {
          title: "Day One",
          description: "Your first cluster interactions.",
          slug: "day-one",
          lessons: [
            {
              title: "kubectl Basics",
              description: "get, describe, apply, and delete.",
              slug: "kubectl-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Use kubectl get on core resources",
                "Inspect with describe",
                "Apply and delete manifests",
              ],
              skills: [
                { name: "kubectl", description: "Drive Kubernetes with kubectl" },
              ],
              activities: [
                {
                  title: "The One Command",
                  body: "`kubectl get pods` lists pods; `kubectl get nodes` lists nodes. `kubectl describe pod name` adds events and detail. `kubectl apply -f file.yaml` declares state; `kubectl delete -f file.yaml` removes it. Add `-n <namespace>` to scope output.",
                },
                {
                  title: "Watching",
                  body: "`kubectl get pods -w` streams updates — the fastest way to feel the reconciliation loop in action.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command shows detailed events for a resource?",
                  options: ["kubectl get","kubectl describe","kubectl delete","kubectl exec"],
                  correctAnswer: "kubectl describe",
                  explanation: "describe shows detailed info including events.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that watches pods in real time.",
                  correctAnswer: "kubectl get pods -w",
                  explanation: "-w streams updates for the reconciliation loop.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "kubectl apply is idempotent.",
                  correctAnswer: "true",
                  explanation: "Applying the same manifest twice is safe — creates or updates.",
                },
              ],
            },
            {
              title: "Namespaces",
              description: "Logical partitions of a cluster.",
              slug: "namespaces",
              estimatedMinutes: 5,
              learningObjectives: [
                "Explain what a namespace is",
                "List, create, and switch namespaces",
              ],
              skills: [
                { name: "namespaces", description: "Organize cluster resources by namespace" },
              ],
              activities: [
                {
                  title: "Separation",
                  body: "Namespaces scope resource names and policies: `kubectl get ns`, `kubectl create ns dev`, and `kubectl -n dev get pods`. Shared control-plane components live in `kube-system`.",
                },
                {
                  title: "Boundaries",
                  body: "Namespaces are organizational, not security boundaries on their own — RBAC and network policies do the real isolation.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a Kubernetes namespace?",
                  options: ["Physical machine","Logical partition of a cluster","Docker image","Storage class"],
                  correctAnswer: "Logical partition of a cluster",
                  explanation: "Namespaces scope resource names and policies.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that lists all namespaces.",
                  correctAnswer: "kubectl get namespaces|kubectl get ns",
                  explanation: "kubectl get namespaces shows all namespaces.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Namespaces alone provide strong security isolation.",
                  correctAnswer: "false",
                  explanation: "Namespaces are organizational. RBAC provides real isolation.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Pods",
      description: "The smallest deployable unit.",
      slug: "pods",
      icon: "Container",
      units: [
        {
          title: "Pod Basics",
          description: "Colocated containers with shared context.",
          slug: "pod-basics",
          lessons: [
            {
              title: "Anatomy of a Pod",
              description: "One or more containers sharing a network.",
              slug: "pod-anatomy",
              estimatedMinutes: 6,
              learningObjectives: [
                "Define a pod and its shared network namespace",
                "Write a minimal pod manifest",
                "Explain sidecar containers",
              ],
              skills: [
                { name: "pods", description: "Deploy and reason about pods" },
              ],
              activities: [
                {
                  title: "The Atomic Unit",
                  body: "A **pod** is the smallest thing Kubernetes can create: one or more containers sharing an IP, hostname, and volumes. The classic pattern is the **sidecar** — a helper container (logger, proxy) living beside the main one. You rarely create bare pods; Deployments manage them for you.",
                },
                {
                  title: "Minimal Manifest",
                  body: "```yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: web\nspec:\n  containers:\n    - name: web\n      image: nginx:stable\n```"
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the smallest deployable unit in Kubernetes?",
                  options: ["Node","Container","Pod","Deployment"],
                  correctAnswer: "Pod",
                  explanation: "A pod is the atomic unit — containers share an IP and volumes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Containers in a pod share the same network namespace.",
                  correctAnswer: "true",
                  explanation: "All containers in a pod share the pod's IP.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that lists all pods.",
                  correctAnswer: "kubectl get pods",
                  explanation: "kubectl get pods shows running pods with status.",
                },
              ],
            },
            {
              title: "Running and Inspecting",
              description: "Exec into, log from, and delete pods.",
              slug: "running-inspecting",
              estimatedMinutes: 6,
              learningObjectives: [
                "Run a one-off pod with kubectl run",
                "Stream logs with kubectl logs",
                "Execute into a container with kubectl exec",
              ],
              skills: [
                { name: "pod-operations", description: "Run, log, and inspect pods" },
              ],
              activities: [
                {
                  title: "Hands On",
                  body: "`kubectl run web --image=nginx` starts a pod for debugging. `kubectl logs web` shows output (`-f` follows, `--previous` shows the crashing last run). `kubectl exec -it web -- bash` drops you into the container — your bug-hunting Swiss Army knife.",
                },
                {
                  title: "Troubleshooting",
                  body: "For failures, `kubectl describe pod` reveals ImagePullBackOff, CrashLoopBackOff, and the exit code — read events before executing blind.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command opens a shell inside a running pod?",
                  options: ["kubectl logs","kubectl exec -it pod-name -- bash","kubectl describe","kubectl port-forward"],
                  correctAnswer: "kubectl exec -it pod-name -- bash",
                  explanation: "kubectl exec runs a command inside a container interactively.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that streams logs from pod web.",
                  correctAnswer: "kubectl logs web -f",
                  explanation: "-f follows new log lines.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "kubectl logs --previous shows logs from a crashed container.",
                  correctAnswer: "true",
                  explanation: "--previous retrieves the terminated container's logs.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Deployments",
      description: "Declarative, self-healing application management.",
      slug: "deployments",
      icon: "GitBranch",
      units: [
        {
          title: "Workloads",
          description: "ReplicaSets and Deployments.",
          slug: "workloads",
          lessons: [
            {
              title: "Deployments and ReplicaSets",
              description: "Replicas, updates, and self-healing.",
              slug: "deployments-replicasets",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain how a Deployment manages ReplicaSets",
                "Declare replicas in a manifest",
                "Understand rolling updates",
              ],
              skills: [
                { name: "deployments", description: "Deploy and update workloads" },
              ],
              activities: [
                {
                  title: "The Manager",
                  body: "A **Deployment** declares the desired state (image, replicas, labels) and creates a **ReplicaSet**, which in turn creates pods. On update, the Deployment rolls a new ReplicaSet out and scales the old one down — zero-downtime by default.",
                },
                {
                  title: "Manifest",
                  body: "```yaml\napiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: web }\n  template:\n    metadata:\n      labels: { app: web }\n    spec:\n      containers:\n        - name: web\n          image: myapp:v2\n```"
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does a Deployment manage?",
                  options: ["Nodes","ReplicaSets which manage Pods","Containers","Network policies"],
                  correctAnswer: "ReplicaSets which manage Pods",
                  explanation: "Deployment creates ReplicaSets, ReplicaSets ensure pod count.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "Deployments provide zero-downtime rolling updates.",
                  correctAnswer: "true",
                  explanation: "New ReplicaScale out while old one scales down.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that checks rollout status of web.",
                  correctAnswer: "kubectl rollout status deploy/web",
                  explanation: "rollout status watches update progress.",
                },
              ],
            },
            {
              title: "Scaling",
              description: "Manual and event-driven scaling.",
              slug: "scaling",
              estimatedMinutes: 6,
              learningObjectives: [
                "Scale replicas with kubectl scale",
                "Explain the HorizontalPodAutoscaler",
                "Describe rolling update behavior",
              ],
              skills: [
                { name: "scaling", description: "Scale deployments" },
              ],
              activities: [
                {
                  title: "More, Please",
                  body: "`kubectl scale deploy web --replicas=5` sets desired state manually; the Deployment reconciler does the rest. For automatic scaling, a **HorizontalPodAutoscaler** measures metrics (CPU/resource/queues) and adjusts replicas — always keep a hungry control plane on top.",
                },
                {
                  title: "Rollout Mastery",
                  body: "`kubectl rollout status deploy/web` watches an update to completion; `kubectl rollout undo deploy/web` reverts fast when the new version misbehaves.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command scales deployment to 5 replicas?",
                  options: ["kubectl scale deploy web --replicas=5","kubectl replicas deploy web 5","kubectl set replicas web 5","kubectl resize deploy web 5"],
                  correctAnswer: "kubectl scale deploy web --replicas=5",
                  explanation: "kubectl scale sets the desired replica count.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question: "Type the command that reverts the last web rollout.",
                  correctAnswer: "kubectl rollout undo deploy/web",
                  explanation: "rollout undo rolls back to the previous ReplicaSet.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "HPA automatically scales based on metrics like CPU.",
                  correctAnswer: "true",
                  explanation: "HPA measures metrics and adjusts replica count.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Services",
      description: "Stable networking for dynamic pods.",
      slug: "services",
      icon: "Network",
      units: [
        {
          title: "Service Discovery",
          description: "How clients reach pods reliably.",
          slug: "service-discovery",
          lessons: [
            {
              title: "What a Service Does",
              description: "Selector, ClusterIP, and endpoints.",
              slug: "what-service-does",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain why pods need a stable endpoint",
                "Write a Service manifest with a selector",
                "List the Service types",
              ],
              skills: [
                { name: "services", description: "Expose pods with stable addresses" },
              ],
              activities: [
                {
                  title: "The Stability Layer",
                  body: "Pods come and go, so their IPs are useless to callers. A **Service** selects pods by label and gives them a stable **ClusterIP** plus a DNS name (`web.default.svc.cluster.local`). Traffic lands on whichever healthy pods match the label — load-balanced automatically.",
                },
                {
                  title: "Manifest",
                  body: "```yaml\napiVersion: v1\nkind: Service\nspec:\n  selector: { app: web }\n  ports:\n    - port: 80\n      targetPort: 8080\n```"
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why do pods need a Service?",
                  options: ["To store data","To have a stable network endpoint","To run commands","To manage secrets"],
                  correctAnswer: "To have a stable network endpoint",
                  explanation: "Pod IPs are ephemeral. Services provide stable ClusterIP and DNS.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that lists all services.",
                  correctAnswer: "kubectl get services|kubectl get svc",
                  explanation: "kubectl get services shows all Services with type and ports.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A Service uses label selectors to find pods.",
                  correctAnswer: "true",
                  explanation: "The selector matches pod labels for traffic routing.",
                },
              ],
            },
            {
              title: "Exposing to the World",
              description: "NodePort and LoadBalancer.",
              slug: "nodeport-lb",
              estimatedMinutes: 6,
              learningObjectives: [
                "Contrast ClusterIP, NodePort, and LoadBalancer",
                "Explain when an Ingress fits",
              ],
              skills: [
                { name: "service-types", description: "Choose the right Service type" },
              ],
              activities: [
                {
                  title: "The Types",
                  body: "**ClusterIP** (default) is internal only. **NodePort** opens a high port on every node. **LoadBalancer** asks the cloud provider for an external IP that fronts a NodePort. Beyond these, an **Ingress** routes HTTP by hostname/path — L7, not just L4.",
                },
                {
                  title: "Reachability Guide",
                  body: "Internal API → ClusterIP. Quick tests → NodePort. Production exposure → LoadBalancer + Ingress with TLS.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which Service type asks the cloud provider for an external IP?",
                  options: ["ClusterIP","NodePort","LoadBalancer","ExternalName"],
                  correctAnswer: "LoadBalancer",
                  explanation: "LoadBalancer provisions an external IP via cloud provider.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that describes service web.",
                  correctAnswer: "kubectl describe svc web",
                  explanation: "describe shows selectors, endpoints, and events.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "An Ingress routes HTTP by hostname and path at Layer 7.",
                  correctAnswer: "true",
                  explanation: "Ingress provides HTTP routing unlike L4 Services.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "ConfigMaps & Secrets",
      description: "Configuration without rebuilding images.",
      slug: "configmaps-secrets",
      icon: "KeySquare",
      units: [
        {
          title: "Configuration",
          description: "Decouple config from container images.",
          slug: "config",
          lessons: [
            {
              title: "ConfigMaps",
              description: "Non-sensitive configuration, decoupled.",
              slug: "configmaps",
              estimatedMinutes: 6,
              learningObjectives: [
                "Create a ConfigMap from a file or literal",
                "Mount it as a volume or env var",
                "Explain why config changes don't need rebuilds",
              ],
              skills: [
                { name: "configmaps", description: "Provide configuration to workloads" },
              ],
              activities: [
                {
                  title: "Config as Data",
                  body: "A **ConfigMap** holds key/value or file-like data: `kubectl create cm app-config --from-literal=LOG_LEVEL=info --from-file=app.properties`. Mount it as environment variables or as a volume — pods read live config without rebuilding the image.",
                },
                {
                  title: "Careful About",
                  body: "ConfigMaps are not encrypted and are wide-open in the cluster. Never put credentials here — that is what Secrets are for.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a ConfigMap used for?",
                  options: ["Passwords","Non-sensitive configuration","Container images","Network policies"],
                  correctAnswer: "Non-sensitive configuration",
                  explanation: "ConfigMaps hold key-value pairs for non-sensitive config.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question: "Type the command that creates ConfigMap app-config.",
                  correctAnswer: "kubectl create cm app-config --from-literal=LOG_LEVEL=info",
                  explanation: "kubectl create configmap creates from literal key-value pairs.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "ConfigMaps are encrypted at rest by default.",
                  correctAnswer: "false",
                  explanation: "ConfigMaps are plain text. Use Secrets for sensitive data.",
                },
              ],
            },
            {
              title: "Secrets",
              description: "Base64-encoded, intended-sensitive data.",
              slug: "secrets",
              estimatedMinutes: 7,
              learningObjectives: [
                "Create and consume Secrets",
                "Explain base64 encoding and its limits",
                "Identify encryption-at-rest's role",
              ],
              skills: [
                { name: "secrets", description: "Handle sensitive data in Kubernetes" },
              ],
              activities: [
                {
                  title: "Mild Obscurity",
                  body: "A **Secret** stores values base64-encoded — encoded, *not* encrypted. Anyone with read access (or cluster admin) can decode them. Kubernetes at rest encryption (KMS), RBAC, and external secret operators (Secrets Store CSI, Vault) harden real deployments.",
                },
                {
                  title: "Usage",
                  body: "Create with `kubectl create secret generic db-creds --from-literal=password=...` or from files, then mount or inject via `envFrom`. Rotate by recreating the Secret and rolling the workload.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "How are Secret values stored?",
                  options: ["AES encrypted","Base64-encoded (not encrypted)","Plaintext","SHA-256 hashed"],
                  correctAnswer: "Base64-encoded (not encrypted)",
                  explanation: "Secrets use base64 encoding, which is obfuscation not encryption.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question: "Type the command that creates secret db-creds.",
                  correctAnswer: "kubectl create secret generic db-creds --from-literal=password=mysecret",
                  explanation: "kubectl create secret generic creates from literal pairs.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Kubernetes supports encryption at rest for Secrets via KMS.",
                  correctAnswer: "true",
                  explanation: "With KMS provider, Secrets can be encrypted in etcd.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};