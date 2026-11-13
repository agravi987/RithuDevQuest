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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists all cluster nodes?",
                  options: ["kubectl get pods","kubectl get nodes","kubectl describe nodes","kubectl top nodes"],
                  correctAnswer: "kubectl get nodes",
                  explanation: "kubectl get nodes shows all nodes with status.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each control plane component to its primary role.",
                  explanation: "The API server is the front door, etcd holds state, the scheduler places pods, and the kubelet runs containers on nodes.",
                  hint: "Think about who talks to users, who stores data, who decides placement, and who sits on the node.",
                  matchPairs: [
                    { left: "kube-apiserver", right: "Entry point for all requests" },
                    { left: "etcd", right: "Stores all cluster state" },
                    { left: "scheduler", right: "Assigns pods to nodes" },
                    { left: "kubelet", right: "Runs containers on each node" },
                  ],
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "The component that decides which node a new pod should run on is the __().",
                  explanation: "The scheduler watches for unscheduled pods and picks the best node for each.",
                  hint: "It 'schedules' work onto nodes.",
                  fillBlanks: [
                    { answer: "scheduler" },
                  ],
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command applies a manifest file?",
                  options: ["kubectl create -f manifest.yaml","kubectl apply -f manifest.yaml","kubectl deploy -f manifest.yaml","kubectl set -f manifest.yaml"],
                  correctAnswer: "kubectl apply -f manifest.yaml",
                  explanation: "kubectl apply declares desired state from YAML.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order the steps of the reconciliation loop after you apply a manifest.",
                  explanation: "You declare the desired state, the API server stores it, controllers read it and compare to reality, then they act to close the gap.",
                  hint: "Kubernetes compares what you want with what currently exists before doing anything.",
                  sequenceItems: [
                    { id: "act", text: "Controller takes action to match reality to the desired state" },
                    { id: "declare", text: "You apply a manifest describing the desired state" },
                    { id: "store", text: "The API server persists the desired state in etcd" },
                    { id: "compare", text: "Controllers read the desired state and compare it to actual resources" },
                  ],
                  sequenceCorrectOrder: ["declare", "store", "compare", "act"],
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "You give Kubernetes a desired state and controllers continuously __() it against what actually exists.",
                  explanation: "Controllers watch reality and steer it back to the declared state whenever they drift apart.",
                  hint: "It means 'to bring back into agreement'.",
                  fillBlanks: [
                    { answer: "reconcile" },
                  ],
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command watches pods in real time?",
                  options: ["kubectl get pods -w","kubectl watch pods web","kubectl logs pods -f","kubectl get pods --poll"],
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
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "To see detailed information and events for a pod named web, you run kubectl __() pod web.",
                  explanation: "kubectl describe enriches the listing with events, status, and container details — ideal for troubleshooting.",
                  hint: "It's the opposite of a short listing.",
                  fillBlanks: [
                    { answer: "describe" },
                  ],
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command deletes the resources defined in a manifest file?",
                  options: ["kubectl remove -f file.yaml","kubectl delete -f file.yaml","kubectl prune -f file.yaml","kubectl destroy -f file.yaml"],
                  correctAnswer: "kubectl delete -f file.yaml",
                  explanation: "kubectl delete -f removes the resources declared in the YAML manifest.",
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists all namespaces?",
                  options: ["kubectl get namespaces","kubectl get clusters","kubectl describe namespaces web","kubectl get contexts"],
                  correctAnswer: "kubectl get namespaces",
                  explanation: "kubectl get namespaces shows all namespaces.",
                },
{
                  type: "true_false",
                  difficulty: "intermediate",
                  question: "Namespaces alone provide strong security isolation.",
                  correctAnswer: "false",
                  explanation: "Namespaces are organizational. RBAC provides real isolation.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which statements about namespaces are true?",
                  explanation: "Namespaces scope resource names and pod policies, while shared control plane components live in kube-system. Namespaces are organizational, not security boundaries on their own.",
                  hint: "Consider what namespaces do and do not isolate.",
                  multiSelectOptions: [
                    { text: "They scope resource names within a cluster", isCorrect: true },
                    { text: "Resource names must be unique within a namespace", isCorrect: true },
                    { text: "They replace RBAC for security isolation", isCorrect: false },
                    { text: "Shared control plane components run in kube-system", isCorrect: true },
                  ],
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command creates a new namespace named dev?",
                  options: ["kubectl create ns dev","kubectl make namespace dev","kubectl new namespace dev","kubectl add namespace dev"],
                  correctAnswer: "kubectl create ns dev",
                  explanation: "kubectl create ns dev creates a namespace to scope resource names and policies.",
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists all pods?",
                  options: ["kubectl get nodes","kubectl get pods","kubectl list pods","kubectl get deployments"],
                  correctAnswer: "kubectl get pods",
                  explanation: "kubectl get pods shows running pods with status.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "The smallest deployable unit in Kubernetes, whose containers share an IP and volumes, is a __().",
                  explanation: "A pod wraps one or more containers in a shared network namespace and storage.",
                  hint: "Not the container and not the node — somewhere in between.",
                  fillBlanks: [
                    { answer: "pod" },
                  ],
                },
                {
                  type: "word_scramble",
                  difficulty: "intermediate",
                  question: "Unscramble the term for a helper container that lives beside the main container, such as a logger or proxy.",
                  explanation: "A sidecar augments the main container — both share the pod's network namespace and lifecycle.",
                  hint: "Think of a motorcycle attachment.",
                  scrambledWord: "sidecar",
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command streams logs from pod web?",
                  options: ["kubectl tail web -f","kubectl logs web -f","kubectl stream pod web","kubectl describe pod web"],
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
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each troubleshooting command to what it does.",
                  explanation: "exec runs a command inside the container, logs streams output, describe shows events and status, and run starts a one-off pod.",
                  hint: "Map each verb to its debugging purpose.",
                  matchPairs: [
                    { left: "kubectl exec -it web -- bash", right: "Open a shell inside the container" },
                    { left: "kubectl logs web -f", right: "Stream pod output" },
                    { left: "kubectl describe pod web", right: "Show events and status" },
                    { left: "kubectl run tmp --image=nginx", right: "Start a one-off debugging pod" },
                  ],
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command starts a one-off pod named web using the nginx image?",
                  options: ["kubectl start web --image=nginx","kubectl run web --image=nginx","kubectl create pod web --image=nginx","kubectl exec web --image=nginx"],
                  correctAnswer: "kubectl run web --image=nginx",
                  explanation: "kubectl run creates a pod for quick debugging and testing.",
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command checks rollout status of web?",
                  options: ["kubectl rollout status deploy/web","kubectl status rollout web","kubectl get rollout web","kubectl rollout check deploy/web"],
                  correctAnswer: "kubectl rollout status deploy/web",
                  explanation: "rollout status watches update progress.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each workload controller to its responsibility.",
                  explanation: "A Deployment declares the desired state, a ReplicaSet maintains the pod count, and pods are the actual running containers.",
                  hint: "Order them from the boss down to the worker.",
                  matchPairs: [
                    { left: "Deployment", right: "Declares desired state and manages versions" },
                    { left: "ReplicaSet", right: "Ensures the desired number of pods" },
                    { left: "Pod", right: "The actual running unit of work" },
                  ],
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order how a Deployment update rolls out so there is zero downtime.",
                  explanation: "The Deployment creates a new ReplicaSet, scales it up while the old one scales down, and only fully retires the old ReplicaSet once the new pods are ready.",
                  hint: "The new version comes up before the old version goes away.",
                  sequenceItems: [
                    { id: "old-down", text: "The old ReplicaSet scales down to zero" },
                    { id: "new-up", text: "A new ReplicaSet is created for the updated image" },
                    { id: "old-create", text: "The original ReplicaSet keeps serving old pods" },
                    { id: "crossover", text: "The new ReplicaSet scales up as the old one scales down" },
                  ],
                  sequenceCorrectOrder: ["old-create", "new-up", "crossover", "old-down"],
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
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command reverts the last web rollout?",
                  options: ["kubectl rollout undo deploy/web","kubectl rollout revert deploy/web","kubectl deploy rollback web","kubectl undo rollout web"],
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
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which approaches can scale a Deployment in Kubernetes?",
                  explanation: "You can scale manually with kubectl scale, let a HorizontalPodAutoscaler respond to metrics automatically, or edit the replicas field in the manifest and reapply it.",
                  hint: "Both hands-on and automatic approaches are valid.",
                  multiSelectOptions: [
                    { text: "kubectl scale deploy web --replicas=5", isCorrect: true },
                    { text: "Editing replicas in the manifest and reapplying", isCorrect: true },
                    { text: "HorizontalPodAutoscaler adjusting replicas from metrics", isCorrect: true },
                    { text: "kubectl reboot the cluster", isCorrect: false },
                  ],
                },
                {
                  type: "word_scramble",
                  difficulty: "intermediate",
                  question: "Unscramble the name of the controller that automatically adjusts replica counts based on metrics like CPU utilization.",
                  explanation: "The HorizontalPodAutoscaler measures metrics and changes the replica count to keep utilization in range.",
                  hint: "It scales pods across many nodes, not vertically.",
                  scrambledWord: "horizontalpodautoscaler",
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists all services?",
                  options: ["kubectl get pods","kubectl get services","kubectl list services","kubectl describe svc web"],
                  correctAnswer: "kubectl get services",
                  explanation: "kubectl get services shows all Services with type and ports.",
                },
{
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A Service uses label selectors to find pods.",
                  correctAnswer: "true",
                  explanation: "The selector matches pod labels for traffic routing.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "A Service provides a stable __() address inside the cluster for a set of pods.",
                  explanation: "The ClusterIP is a stable virtual address; pod IPs are ephemeral and change as pods restart.",
                  hint: "It starts with 'Cluster'.",
                  fillBlanks: [
                    { answer: "ClusterIP", hint: "Also acceptable: cluster IP" },
                  ],
                },
                {
                  type: "multi_select",
                  difficulty: "beginner",
                  question: "Which are true about how a Service routes traffic?",
                  explanation: "A Service matches pods by label selector, load-balances across matching endpoints, and exposes a stable DNS name.",
                  hint: "Think about how it picks which pods receive traffic.",
                  multiSelectOptions: [
                    { text: "It selects pods using label selectors", isCorrect: true },
                    { text: "It load-balances across matching pods", isCorrect: true },
                    { text: "It depends on an exact pod IP to route", isCorrect: false },
                    { text: "It exposes a stable DNS name", isCorrect: true },
                  ],
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command describes service web?",
                  options: ["kubectl get svc web","kubectl describe svc web","kubectl port-forward svc/web","kubectl edit svc web"],
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
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each way of exposing a Service to its reachability.",
                  explanation: "ClusterIP is internal only, NodePort opens a high port on every node, LoadBalancer provisions an external cloud IP, and Ingress routes HTTP by hostname and path.",
                  hint: "Match how far the traffic can reach.",
                  matchPairs: [
                    { left: "ClusterIP", right: "Internal-to-cluster only" },
                    { left: "NodePort", right: "High port open on every node" },
                    { left: "LoadBalancer", right: "External IP from cloud provider" },
                    { left: "Ingress", right: "HTTP routing by hostname and path" },
                  ],
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question: "Order the flow of an external HTTP request routing to a pod via an Ingress and a NodePort-backed Service.",
                  explanation: "External traffic hits an Ingress, which routes by hostname/path to a Service; the Service forwards to a matching backend pod using a Service type such as NodePort.",
                  hint: "Traffic flows from the outside edge in toward the pod.",
                  sequenceItems: [
                    { id: "pod", text: "The Service forwards the request to a matching backend pod" },
                    { id: "ingress", text: "An Ingress matches the HTTP hostname and path" },
                    { id: "external", text: "A client sends an HTTP request from outside the cluster" },
                    { id: "service", text: "The Ingress forwards to a Service exposing the workload" },
                  ],
                  sequenceCorrectOrder: ["external", "ingress", "service", "pod"],
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
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command creates ConfigMap app-config?",
                  options: ["kubectl create cm app-config --from-literal=LOG_LEVEL=info","kubectl add configmap app-config --literal=LOG_LEVEL=info","kubectl new cm app-config --from-env=LOG_LEVEL=info","kubectl set configmap app-config LOG_LEVEL=info"],
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
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "A ConfigMap holds non-sensitive key/value data that you can mount into a pod as environment variables or a __().",
                  explanation: "ConfigMaps can be mounted as volumes so pods read live configuration without rebuilding the image.",
                  hint: "Files on disk that get attached to a container.",
                  fillBlanks: [
                    { answer: "volume", hint: "Also acceptable: filesystem" },
                  ],
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the resource Kubernetes uses to store non-sensitive configuration separate from the container image.",
                  explanation: "A ConfigMap decouples configuration from images so you can change settings without rebuilding.",
                  hint: "Two words back-to-back: config plus a container for data.",
                  scrambledWord: "configmap",
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
                  type: "mcq",
                  difficulty: "intermediate",
                  question: "Which command creates secret db-creds?",
                  options: ["kubectl create secret generic db-creds --from-literal=password=mysecret","kubectl create secret registry db-creds --password=mysecret","kubectl encrypt secret db-creds --literal=password=mysecret","kubectl create configmap db-creds --from-secret=password=mysecret"],
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
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which statements about Kubernetes Secrets are true?",
                  explanation: "Secrets are base64-encoded, not encrypted by default, so protecting them needs RBAC, encryption at rest via KMS, and often external secret operators.",
                  hint: "Base64 is obfuscation, not strong protection.",
                  multiSelectOptions: [
                    { text: "Values are base64-encoded, not encrypted", isCorrect: true },
                    { text: "RBAC restricts who can read them", isCorrect: true },
                    { text: "Values are fully protected with no extra setup", isCorrect: false },
                    { text: "Encryption at rest via KMS is possible", isCorrect: true },
                  ],
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question: "Secret values are stored using __() encoding, which obfuscates but does not encrypt them.",
                  explanation: "Base64 merely encodes bytes; anyone who can read the Secret can decode it, so it must be paired with RBAC and encryption at rest.",
                  hint: "A common text-to-bytes encoding scheme.",
                  fillBlanks: [
                    { answer: "base64", hint: "Also acceptable: base 64" },
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