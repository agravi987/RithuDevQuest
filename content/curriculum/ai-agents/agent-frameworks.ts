import type { SeedPath } from "@/lib/curriculum/seed";

export const agentFrameworksPath: SeedPath = {
  title: "Agent Frameworks & Tools",
  description:
    "The ReAct pattern, tool schemas, Model Context Protocol, rate limits, and putting a complete agent together end to end.",
  slug: "agent-frameworks-tools",
  modules: [
    {
      title: "Frameworks",
      description: "The building blocks agents are made of.",
      slug: "frameworks",
      icon: "Blocks",
      units: [
        {
          title: "Reasoning Patterns",
          description: "ReAct and structured planning.",
          slug: "reasoning-patterns",
          lessons: [
            {
              title: "ReAct",
              description: "Reasoning and acting in one loop.",
              slug: "react",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the ReAct pattern",
                "Describe reasoning → action → observation turns",
                "Identify when to use ReAct-style loops",
              ],
              skills: [
                { name: "react", description: "Build reasoning-and-acting agent loops" },
              ],
              activities: [
                {
                  title: "Think, Do, Watch",
                  body: "**ReAct** (Reasoning + Acting) interleaves *thought* (why the agent is doing this), *action* (a tool or answer), and *observation* (what the tool returned) across turns. The pattern is explicit in the prompt: 'Thought: … Action: … Observation: …'. It gives the model a scratchpad, and the observed results update the next thought — which is exactly right for multi-step, tool-driven tasks like planning travel or debugging an outage.",
                },
                {
                  title: "Example",
                  body: "Thought: I need the user's order id. Action: ask_for_order_id. Observation: AH-7721. Thought: Now fetch it. Action: lookup_order({\"id\":\"AH-7721\"}). Observation: shipped Tuesday. …",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does the 'Re' in ReAct stand for?",
                  options: ["Reasoning", "Redirect", "Regression", "Replay"],
                  correctAnswer: "Reasoning",
                  explanation:
                    "ReAct = Reasoning + Acting — thoughts steer actions and observations steer the next thoughts.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order a ReAct turn.",
                  sequenceItems: [
                    { id: "thought", text: "Model explains its plan" },
                    { id: "action", text: "Model names a tool and arguments" },
                    { id: "execute", text: "Application runs the tool" },
                    { id: "observation", text: "Result comes back as an observation" },
                    { id: "next", text: "Next thought builds on it" },
                  ],
                  sequenceCorrectOrder: ["thought", "action", "execute", "observation", "next"],
                  explanation:
                    "Thought → action → execute → observation → next thought. Each loop grounds the next decision.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "ReAct-style loops are a good fit for multi-step tasks requiring tool results to proceed.",
                  correctAnswer: "true",
                  explanation:
                    "Multi-step, tool-dependent tasks are exactly where interleaved reasoning and acting shines.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each ReAct element to its role.",
                  matchPairs: [
                    { left: "Thought", right: "Internal reasoning step" },
                    { left: "Action", right: "Tool invocation request" },
                    { left: "Observation", right: "Result fed back to the model" },
                    { left: "Answer", right: "Final response when done" },
                  ],
                  explanation:
                    "Thoughts drive actions, observations update thoughts, and the answer closes the loop.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Interleaving reasoning and acting in one loop is the ___ pattern.",
                  fillBlanks: [{ answer: "ReAct" }],
                  explanation:
                    "ReAct alternates reasoning, acting, and observing across multiple turns.",
                },
              ],
            },
            {
              title: "Orchestration",
              description: "Frameworks vs hand-rolled loops.",
              slug: "orchestration-frameworks",
              estimatedMinutes: 6,
              learningObjectives: [
                "Compare agent frameworks to custom code",
                "Explain when frameworks help",
                "List the pieces a framework should manage",
              ],
              skills: [
                { name: "orchestration", description: "Choose and use agent orchestration" },
              ],
              activities: [
                {
                  title: "Batteries vs Control",
                  body: "**Agent frameworks** (LangGraph, CrewAI, OpenAI Swarm-style, and others) package the loop: tool dispatch, memory, multi-agent orchestration, checkpoints. They speed you up when assembling many moving parts, but add **abstraction and version churn** — the model calls, schemas, and observability are theirs to define. For one or two tools, a hand-rolled loop is clearer and easier to debug. The deciding factor is how much of the complexity you own either way.",
                },
                {
                  title: "Example",
                  body: "A single-function bot barely needs a framework; a support team with 20 tools, handoffs, and persisted memory usually benefits from one.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which is a benefit an agent framework provides?",
                  options: [
                    "Packaged tool dispatch and memory",
                    "Free GPU access",
                    "Automatic security patches",
                    "Zero dependency on the model API",
                  ],
                  correctAnswer: "Packaged tool dispatch and memory",
                  explanation:
                    "Frameworks bundle the loop machinery — tool dispatch, memory, orchestration — as reusable pieces.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A framework's abstraction and version churn can become a cost of its own.",
                  correctAnswer: "true",
                  explanation:
                    "Frameworks trade control for speed; upgrades and opaque internals are real maintenance costs.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When does a framework earn its complexity?",
                  multiSelectOptions: [
                    { text: "Many tools and handoffs between agents", isCorrect: true },
                    { text: "Persisted multi-session memory", isCorrect: true },
                    { text: "A single function call from one prompt", isCorrect: false },
                    { text: "Need for checkpoints and resumability", isCorrect: true },
                  ],
                  explanation:
                    "Frameworks shine with many tools, memory, orchestration, and checkpoints; a one-call bot wants to stay simple.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each orchestration concept to its job.",
                  matchPairs: [
                    { left: "Tool dispatch", right: "Route calls to the right handler" },
                    { left: "Memory", right: "Persist context across turns" },
                    { left: "Checkpoint", right: "Resume a paused run" },
                    { left: "Handoff", right: "Pass control to another agent" },
                  ],
                  explanation:
                    "Dispatch routes calls, memory persists, checkpoints resume, and handoffs move work between agents.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A framework that runs agents, tools, and memory for you is an ___ framework.",
                  fillBlanks: [{ answer: "agent" }],
                  explanation:
                    "Agent frameworks orchestrate models, tools, and memory so you assemble rather than rebuild.",
                },
              ],
            },
          ],
        },
        {
          title: "Tooling",
          description: "Schemas, MCP, and rate limits.",
          slug: "tooling",
          lessons: [
            {
              title: "MCP",
              description: "The Model Context Protocol.",
              slug: "mcp",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the Model Context Protocol",
                "Describe servers, clients, and tool mounting",
                "Evaluate when to standardize on MCP",
              ],
              skills: [
                { name: "mcp", description: "Expose tools over the Model Context Protocol" },
              ],
              activities: [
                {
                  title: "A Standard Socket for Tools",
                  body: "**MCP (Model Context Protocol)** is an open standard that lets an assistant connect to external tools, data, and resources through a uniform interface. An **MCP server** exposes tools/resources; an **MCP client** (the agent or IDE) mounts them. Instead of writing a bespoke integration per tool, you declare a server and the tools become available. It is still evolving — treat schema stability and version pinning as first-class concerns.",
                },
                {
                  title: "Example",
                  body: "Your editor opens an MCP server for the codebase; the agent in the editor can search symbols, read files, and run tests through protocol-defined tool calls — no per-tool glue code.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does MCP standardize?",
                  options: [
                    "How assistants connect to tools and data",
                    "The size of every LLM",
                    "The price of GPU minutes",
                    "Error codes in the Python runtime",
                  ],
                  correctAnswer: "How assistants connect to tools and data",
                  explanation:
                    "The Model Context Protocol defines a uniform interface for tools, resources, and prompts.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each MCP role to its job.",
                  matchPairs: [
                    { left: "MCP server", right: "Exposes tools and resources" },
                    { left: "MCP client", right: "Connects assistants to servers" },
                    { left: "Tool", right: "Callable capability" },
                    { left: "Resource", right: "Data the agent can read" },
                  ],
                  explanation:
                    "Servers expose capabilities, clients consume them, tools are callable, and resources are readable data.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "MCP removes the need to hand-write a custom integration for every tool an agent uses.",
                  correctAnswer: "true",
                  explanation:
                    "A single protocol-defined server integration replaces per-tool custom glue.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which concerns should you watch on a new MCP server?",
                  multiSelectOptions: [
                    { text: "Tool schema changes over time", isCorrect: true },
                    { text: "The server's access permissions", isCorrect: true },
                    { text: "Prompt injection via tool descriptions", isCorrect: true },
                    { text: "Assuming the standard never changes", isCorrect: false },
                  ],
                  explanation:
                    "MCP evolves — pin versions, verify permissions, and treat tool descriptions as attack surface.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "MCP stands for Model ___ Protocol.",
                  fillBlanks: [{ answer: "Context" }],
                  explanation:
                    "Model Context Protocol — a standard for exposing tools and data to AI assistants.",
                },
              ],
            },
            {
              title: "Tool Schemas & Limits",
              description: "Designing callable, safe tools.",
              slug: "tool-schemas-limits",
              estimatedMinutes: 7,
              learningObjectives: [
                "Write clear tool descriptions",
                "Enforce rate limits and budgets",
                "Handle tool failures gracefully",
              ],
              skills: [
                { name: "tool-design", description: "Design callable, rate-limited tool surfaces" },
              ],
              activities: [
                {
                  title: "Design for a Computer, Not a Human",
                  body: "Good tool schemas read like API contracts: a **name**, a precise **description** (which shapes when the model chooses it), typed **parameters**, and a stable **result shape**. Because models call tools at machine speed, add **rate limits and budgets** on the tool side — a runaway loop must not hammer an external API. Handle failed tools by returning a structured error, not by crashing, so the agent can recover.",
                },
                {
                  title: "Example",
                  body: "`lookup_order(id: string)` with description 'Fetches a customer order by its ID. Use whenever the user references an order.' returns `{status, items}` or `{error: 'not_found'}` — never throws.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why does a tool description matter?",
                  options: [
                    "It guides when the model chooses the tool",
                    "It sets the GPU clock",
                    "It determines tokenizer tokens",
                    "It is never seen by the model",
                  ],
                  correctAnswer: "It guides when the model chooses the tool",
                  explanation:
                    "The model reads descriptions to decide which tool fits the task — vague descriptions mean wrong or missed selections.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Rate limits belong on the tool boundary, since models call tools far faster than humans do.",
                  correctAnswer: "true",
                  explanation:
                    "Machine-speed calling makes per-tool rate limits and budgets a hard requirement.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order what happens when a tool call fails in a well-built agent.",
                  sequenceItems: [
                    { id: "call", text: "Model invokes the tool" },
                    { id: "error", text: "Tool returns a structured error" },
                    { id: "observe", text: "Agent reads the error observation" },
                    { id: "recover", text: "Agent changes course or asks the user" },
                    { id: "retry", text: "Retry only if bounded" },
                  ],
                  sequenceCorrectOrder: ["call", "error", "observe", "recover", "retry"],
                  explanation:
                    "Call → structured error → observe → recover → bounded retry. Errors are data, not exceptions.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which make a tool schema production-ready?",
                  multiSelectOptions: [
                    { text: "Typed parameters with descriptions", isCorrect: true },
                    { text: "A stable result shape", isCorrect: true },
                    { text: "Structured error returns", isCorrect: true },
                    { text: "No validation, trust the model", isCorrect: false },
                  ],
                  explanation:
                    "Types, describable params, stable results, and structured errors are the basics; never skip validation.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the term for machine-speed limits on tool usage:",
                  scrambledWord: "throttle",
                  explanation:
                    "Throttling/rate limiting caps how fast a tool can be called by the agent loop.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Building an Agent",
      description: "Assembling the pieces end to end.",
      slug: "build",
      icon: "Hammer",
      units: [
        {
          title: "End to End",
          description: "From requirements to a working agent.",
          slug: "end-to-end",
          lessons: [
            {
              title: "Designing an Agent",
              description: "Scope, tools, and guardrails first.",
              slug: "designing-an-agent",
              estimatedMinutes: 7,
              learningObjectives: [
                "Scope an agent to a narrow task",
                "Pick tools deliberately",
                "Define success metrics and failure modes",
              ],
              skills: [
                { name: "agent-design", description: "Scope and design production agents" },
              ],
              activities: [
                {
                  title: "Narrow Beats Wide",
                  body: "A great agent has a **narrow scope**, a **short tool list**, and **explicit success criteria**. Start from the user's job: which questions, which tools, what counts as done. Sketch the agent loop, the memory, the tool schemas, and the guardrails before writing code. Decide how you will **evaluate** it (golden scenarios) and what happens on failure — an agent that says 'I could not find it' beats one that invents an answer.",
                },
                {
                  title: "Example",
                  body: "An expense-categorization agent needs exactly two tools (search transactions, list categories) and one rule: if a transaction is ambiguous, ask — never guess.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Compared to a broad assistant, a scoped agent tends to be:",
                  options: [
                    "More reliable within its narrow job",
                    "Guaranteed never to fail",
                    "Impossible to test",
                    "Always faster to build carelessly",
                  ],
                  correctAnswer: "More reliable within its narrow job",
                  explanation:
                    "Narrow scope means fewer tools, clearer guardrails, and measurable success — reliability by construction.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Success metrics and failure behavior should be decided during design, not after launch.",
                  correctAnswer: "true",
                  explanation:
                    "Deciding 'what counts as done' and 'what happens on failure' upfront shapes the whole build.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the design steps for a new agent.",
                  sequenceItems: [
                    { id: "scope", text: "Define the narrow task and user job" },
                    { id: "tools", text: "List the minimal tool set" },
                    { id: "loop", text: "Sketch the perceive/act/reflect loop" },
                    { id: "guard", text: "Add guardrails and approval gates" },
                    { id: "eval", text: "Define golden scenarios and metrics" },
                  ],
                  sequenceCorrectOrder: ["scope", "tools", "loop", "guard", "eval"],
                  explanation:
                    "Scope → tools → loop → guardrails → evaluation. Design before code, as with any system.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Before coding, an agent spec should decide what counts as ___ (the success criteria).",
                  fillBlanks: [{ answer: "done" }],
                  explanation:
                    "Explicit success criteria make an agent testable and prevent 'good enough' drift.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which scoping decisions reduce agent failure?",
                  multiSelectOptions: [
                    { text: "Fewer, focused tools", isCorrect: true },
                    { text: "Prompt that names the fallback behavior", isCorrect: true },
                    { text: "Unlimited tool retries", isCorrect: false },
                    { text: "Golden-set evaluation before launch", isCorrect: true },
                  ],
                  explanation:
                    "Focused tools, explicit fallbacks, and evaluation all harden the agent; infinite retries invite runaway loops.",
                },
              ],
            },
            {
              title: "Building & Shipping",
              description: "From prototype to production loop.",
              slug: "building-and-shipping",
              estimatedMinutes: 7,
              learningObjectives: [
                "Prototype with a single path first",
                "Add observability from day one",
                "Ship with logs, limits, and a kill switch",
              ],
              skills: [
                { name: "agent-production", description: "Take an agent prototype to production" },
              ],
              activities: [
                {
                  title: "Walk Before You Run",
                  body: "Prototype the **happy path** with one tool and hard-coded data, then add branching. From day one, emit **structured logs**: every model call, tool call, token count, and latency — the replay trail that makes debugging possible. Before shipping, verify **limits** (max steps, cost budget), a **kill switch**, and **error paths**. Then iterate on the golden set, exactly as you would any service.",
                },
                {
                  title: "Example",
                  body: "V1 supports three intents with two tools and logs every step as JSON. Two weeks later, V2 adds a third tool and reranks retrieval — the logs prove nothing regressed.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What should a production agent log for every loop iteration?",
                  options: [
                    "Model calls, tool calls, tokens, latency",
                    "Only final answers",
                    "Nothing — logs are private",
                    "Random sampling only",
                  ],
                  correctAnswer: "Model calls, tool calls, tokens, latency",
                  explanation:
                    "Structured per-step logs are the replay trail for debugging any behavior or cost issue.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A kill switch that stops the agent loop immediately is a useful production safety feature.",
                  correctAnswer: "true",
                  explanation:
                    "When a bad loop is burning tokens or money, an instant stop beats watching it finish.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which belong in a shipping checklist for an agent?",
                  multiSelectOptions: [
                    { text: "Maximum iteration and cost limits", isCorrect: true },
                    { text: "Per-step structured logging", isCorrect: true },
                    { text: "A manual kill switch", isCorrect: true },
                    { text: "No error handling, ship the happy path only", isCorrect: false },
                  ],
                  explanation:
                    "Limits, logs, and a kill switch are the baseline; skipping error paths is how outages start.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the build-and-ship flow.",
                  sequenceItems: [
                    { id: "proto", text: "Prototype the single happy path" },
                    { id: "branch", text: "Add branching and failure paths" },
                    { id: "observe", text: "Instrument structured logging" },
                    { id: "limits", text: "Add step/cost caps and kill switch" },
                    { id: "ship", text: "Deploy behind evaluation and rollback" },
                  ],
                  sequenceCorrectOrder: ["proto", "branch", "observe", "limits", "ship"],
                  explanation:
                    "Prototype → branch → observe → limit → ship. Observability comes before the run, not after the crash.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each production concern to what it prevents.",
                  matchPairs: [
                    { left: "Step/cost caps", right: "Runaway loop spend" },
                    { left: "Structured logs", right: "Un-debuggable behavior" },
                    { left: "Kill switch", right: "Slow bad-loop bleeding" },
                    { left: "Golden-set eval", right: "Unchecked regressions" },
                  ],
                  explanation:
                    "Caps stop spend, logs enable debugging, the kill switch halts messes, and eval catches regressions.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A mechanism to immediately halt a misbehaving agent loop is a ___ switch.",
                  fillBlanks: [{ answer: "kill" }],
                  explanation:
                    "A kill switch hard-stops the loop — essential cheap insurance for autonomous systems.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};