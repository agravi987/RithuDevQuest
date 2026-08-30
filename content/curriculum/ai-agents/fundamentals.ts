import type { SeedPath } from "@/lib/curriculum/seed";

export const aiAgentFundamentalsPath: SeedPath = {
  title: "AI Agent Fundamentals",
  description:
    "What AI agents are, how they reason and act in loops, and the constraints — latency, cost, hallucination, and safety — that shape every production agent.",
  slug: "ai-agent-fundamentals",
  modules: [
    {
      title: "What is an AI Agent",
      description: "LLMs, reasoning, and tool use.",
      slug: "what-is-agent",
      icon: "Cpu",
      units: [
        {
          title: "LLM Basics",
          description: "How language models work under the hood.",
          slug: "llm-basics",
          lessons: [
            {
              title: "How LLMs Work",
              description: "Tokens, probabilities, and next-token generation.",
              slug: "llm-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain what a token is",
                "Describe next-token prediction",
                "Distinguish context window from training data",
              ],
              skills: [
                { name: "llm-basics", description: "Reason about how language models work" },
              ],
              activities: [
                {
                  title: "Stateless Text Machines",
                  body: "A **large language model (LLM)** predicts the next token — the smallest unit of text (a word, part of a word, or symbol) — given the tokens before it. Generation is iterative: it writes one token, feeds everything back in, and writes the next. The **context window** is the amount of text the model can attend to in one go. That is different from **training data**: everything the model 'knows' from its original training, which has a cutoff date.",
                },
                {
                  title: "Example",
                  body: "Given 'The capital of France is', a model assigns probability to candidate next tokens and samples one — often 'Paris'. Sampled, not guaranteed: randomness is controlled by a temperature setting.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a token in LLM terms?",
                  options: [
                    "The smallest unit of text a model processes",
                    "A cryptographic session key",
                    "A database row",
                    "A chunk of 10 words",
                  ],
                  correctAnswer: "The smallest unit of text a model processes",
                  explanation:
                    "Tokens are the atomic text units (words, subwords, or symbols) a model reads and produces.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "The context window limits how much text the model can process in a single request, regardless of its training data.",
                  correctAnswer: "true",
                  explanation:
                    "The context window is a fixed working limit per request; training data is a separate, larger body.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "An LLM generates text one ___ at a time, feeding its own output back in.",
                  fillBlanks: [{ answer: "token" }],
                  explanation:
                    "Generation is autoregressive: predict a token, append it, predict the next.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each concept to its meaning.",
                  matchPairs: [
                    { left: "Context window", right: "Working text limit per request" },
                    { left: "Training data", right: "Corpus the model learned from" },
                    { left: "Temperature", right: "Controls output randomness" },
                    { left: "Token", right: "Smallest text unit" },
                  ],
                  explanation:
                    "The context window bounds each request; training data defines long-term knowledge; temperature tunes randomness; tokens are the atomic units.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are true about LLM generation?",
                  multiSelectOptions: [
                    { text: "Output is sampled, not deterministic", isCorrect: true },
                    { text: "Each token depends on prior tokens", isCorrect: true },
                    { text: "The model re-trains on every request", isCorrect: false },
                    { text: "Higher temperature increases randomness", isCorrect: true },
                  ],
                  explanation:
                    "LLMs sample the next token from a probability distribution — temperature controls how aggressively — and every token conditions on the previous ones.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question: "Order the steps of single-token generation.",
                  sequenceItems: [
                    { id: "encode", text: "Input is tokenized into IDs" },
                    { id: "forward", text: "IDs pass through the transformer layers" },
                    { id: "logits", text: "Network emits scores (logits) over the vocabulary" },
                    { id: "probs", text: "Logits become a probability distribution" },
                    { id: "sample", text: "One token is sampled and appended" },
                  ],
                  sequenceCorrectOrder: ["encode", "forward", "logits", "probs", "sample"],
                  explanation:
                    "Tokenize → run the model → logits → probabilities → sample. Repeat for each new token.",
                },
              ],
            },
            {
              title: "From Model to Assistant",
              description: "Instruct-tuned models and system prompts.",
              slug: "from-model-to-assistant",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain instruction tuning",
                "Describe the system/assistant/user message roles",
                "Understand why repetition and formatting matter",
              ],
              skills: [
                { name: "assistant-behavior", description: "Shape model behavior with roles and instructions" },
              ],
              activities: [
                {
                  title: "Teaching a Follow-er",
                  body: "A raw base model finishes text; an **instruction-tuned** model follows directions. Apps chat through explicit **message roles** — `system` (the standing instructions), `user` (the human input), and `assistant` (the model output). The system message is the agent's job description: tone, constraints, and behavior all live there. Keep instructions in the right role and out of the user message.",
                },
                {
                  title: "Example",
                  body: "A `system` prompt 'You are a helpful support agent. Never invent order numbers. If you are unsure, ask.' steers the assistant before any user text arrives.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which message role carries a model's standing instructions?",
                  options: ["system", "user", "tool", "stream"],
                  correctAnswer: "system",
                  explanation:
                    "The system message holds the persistent instructions describing the assistant's behavior.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Instruction-tuning on instruction/response pairs converts a completion-style model into a conversation assistant.",
                  correctAnswer: "true",
                  explanation:
                    "Supervised fine-tuning on instruction–response examples makes base models follow directions reliably.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the term for adapting a base model to follow instructions:",
                  scrambledWord: "tuning",
                  explanation:
                    "Instruction tuning — supervised fine-tuning on instruction/response pairs.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each message role to its purpose.",
                  matchPairs: [
                    { left: "system", right: "Standing instructions" },
                    { left: "user", right: "Human input" },
                    { left: "assistant", right: "Model output" },
                    { left: "tool", right: "Result of a tool call" },
                  ],
                  explanation:
                    "System sets behavior, user inputs, assistant responds, and tool messages feed tool results back in.",
                },
              ],
            },
          ],
        },
        {
          title: "Reasoning",
          description: "How agents plan and think.",
          slug: "reasoning",
          lessons: [
            {
              title: "Chain of Thought",
              description: "Getting a model to think step by step.",
              slug: "chain-of-thought",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain chain-of-thought prompting",
                "Apply step-by-step reasoning to reduce errors",
                "Separate visible reasoning from final answers",
              ],
              skills: [
                { name: "chain-of-thought", description: "Prompt step-by-step reasoning" },
              ],
              activities: [
                {
                  title: "Show Your Work",
                  body: "**Chain-of-thought (CoT)** prompting asks a model to reason step by step before answering. Because each step conditions the next, intermediate reasoning measurably improves multi-step arithmetic and planning accuracy. In production agents, **hidden reasoning** can be kept internal (the model thinks privately) while a separate, shorter answer is shown to users — think the reasoning/answer split found in modern assistants.",
                },
                {
                  title: "Example",
                  body: "'Solve this step by step' produces reliable arithmetic; the internal reasoning trace, when surfaced to users, is turned into a concise curated answer.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is chain-of-thought prompting?",
                  options: [
                    "Asking the model to reason step by step",
                    "Linking multiple models together",
                    "Chaining database queries",
                    "Repeating the prompt once",
                  ],
                  correctAnswer: "Asking the model to reason step by step",
                  explanation:
                    "CoT asks for intermediate reasoning steps, which improves accuracy on multi-step problems.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Showing every internal reasoning token to users is always required for correctness.",
                  correctAnswer: "false",
                  explanation:
                    "Models can reason internally while displaying only a curated answer — visible reasoning is a product choice, not a correctness requirement.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a chain-of-thought task.",
                  sequenceItems: [
                    { id: "prompt", text: "User asks a multi-step question" },
                    { id: "reason", text: "Model performs internal steps" },
                    { id: "trace", text: "Reasoning trace is produced" },
                    { id: "answer", text: "Final answer follows the trace" },
                    { id: "display", text: "Curated answer is shown to the user" },
                  ],
                  sequenceCorrectOrder: ["prompt", "reason", "trace", "answer", "display"],
                  explanation:
                    "Prompt → reason → trace → answer → display. The trace is the working memory of the response.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Chain-of-thought prompting asks the model to reason ___ by ___.",
                  fillBlanks: [{ answer: "step" }, { answer: "step" }],
                  explanation:
                    "Two blanks: 'step' and 'step'. Step-by-step reasoning improves multi-step accuracy.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which statements about chain-of-thought are true?",
                  multiSelectOptions: [
                    { text: "It improves multi-step reasoning accuracy", isCorrect: true },
                    { text: "It costs extra tokens for the reasoning trace", isCorrect: true },
                    { text: "It always eliminates hallucinations", isCorrect: false },
                    { text: "It can be kept private from users", isCorrect: true },
                  ],
                  explanation:
                    "CoT buys accuracy at the cost of trace tokens, does not guarantee factuality, and hidden reasoning can stay private.",
                },
              ],
            },
            {
              title: "Hallucinations",
              description: "Why models fabricate, and how to fight back.",
              slug: "hallucinations",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain why LLMs hallucinate",
                "Use grounding to reduce fabrication",
                "Add guardrails and confidence checks",
              ],
              skills: [
                { name: "hallucination-control", description: "Reduce fabricated model output" },
              ],
              activities: [
                {
                  title: "Confidently Wrong",
                  body: "An LLM **hallucinates** when it emits fluent text that is not true — citing a paper that does not exist, inventing config keys, or 'remembering' events. The cause is fundamental: the model predicts plausible tokens, not ground truth. Production defenses: **grounding** (give the model retrievable facts), **tool results over memory** (prefer API call outcomes), constrained output, and **explicit fallbacks** ('if a value is not in the provided data, say you do not know').",
                },
                {
                  title: "Example",
                  body: "An agent asked for a user's order status should never guess — it looks up the API response and says exactly what the response contains, or 'I could not find that order.'",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the root cause of hallucination?",
                  options: [
                    "The model predicts plausible tokens, not verified facts",
                    "The model is intentionally lying",
                    "The GPU makes random errors",
                    "The API charges per mistake",
                  ],
                  correctAnswer: "The model predicts plausible tokens, not verified facts",
                  explanation:
                    "Hallucination is a byproduct of next-token prediction — the model optimizes for plausible continuation, not factuality.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Grounding a model with retrieved facts reduces hallucination compared to free recall.",
                  correctAnswer: "true",
                  explanation:
                    "Grounding gives the model the exact data to answer from, shifting it from memory to provided context.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which techniques help reduce hallucination?",
                  multiSelectOptions: [
                    { text: "Grounded retrieval of real data", isCorrect: true },
                    { text: "Requiring answers to cite the provided context", isCorrect: true },
                    { text: "Higher temperature on every call", isCorrect: false },
                    { text: "Fallback wording when data is missing", isCorrect: true },
                  ],
                  explanation:
                    "Grounding, citing context, and explicit 'I do not know' fallbacks all suppress fabrication; temperature only increases randomness.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each anti-hallucination technique to what it does.",
                  matchPairs: [
                    { left: "Grounding", right: "Provide retrievable facts" },
                    { left: "Tool results", right: "Prefer API truth over memory" },
                    { left: "Fallbacks", right: "Safe 'I do not know' wording" },
                    { left: "Validation", right: "Reject outputs that fail schema" },
                  ],
                  explanation:
                    "Default to provided facts, API results, and explicit fallbacks, and validate constrained outputs.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A model producing fluent but untrue text is said to ___ (invent facts).",
                  fillBlanks: [{ answer: "hallucinate" }],
                  explanation:
                    "Hallucination = confident fabrication that is not backed by real data.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "The Agent Loop",
      description: "Perceive, plan, act, reflect.",
      slug: "agent-loop",
      icon: "RefreshCw",
      units: [
        {
          title: "Acting on the World",
          description: "Tools turn a model into an agent.",
          slug: "acting-on-the-world",
          lessons: [
            {
              title: "Tool Use",
              description: "Function calling turns text into actions.",
              slug: "tool-use",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain function calling",
                "Describe tool schemas and arguments",
                "Understand why tools must be validated",
              ],
              skills: [
                { name: "tool-use", description: "Wrap capabilities as model-callable tools" },
              ],
              activities: [
                {
                  title: "From Talk to Action",
                  body: "A model alone can only emit text. **Function calling** lets it emit a structured request — a tool name plus JSON arguments — which your code executes for real. The result is appended back to the conversation, and the model continues. This loop (request → execute → return result → continue) is what makes an LLM an **agent**. Every tool needs a clear **JSON schema**: name, description, and parameters.",
                },
                {
                  title: "Example",
                  body: "Ask 'what is the weather in Berlin?' — the model emits `get_weather({\"city\": \"Berlin\"})`; your code calls a weather API and feeds back the forecast text.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does an LLM emit during function calling?",
                  options: [
                    "A tool name and structured JSON arguments",
                    "A raw terminal command",
                    "A SQL query by itself",
                    "A binary executable",
                  ],
                  correctAnswer: "A tool name and structured JSON arguments",
                  explanation:
                    "The model outputs a structured request (tool + args); your code — never the model — executes the side effect.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "The model itself executes tool calls that mutate external systems.",
                  correctAnswer: "false",
                  explanation:
                    "The model only emits the request; application code runs the tool and returns the result.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a single tool-use interaction.",
                  sequenceItems: [
                    { id: "ask", text: "User asks for something needing a tool" },
                    { id: "emit", text: "Model emits tool name + arguments" },
                    { id: "execute", text: "Application runs the tool" },
                    { id: "result", text: "Tool result is appended as a message" },
                    { id: "continue", text: "Model continues with the result" },
                  ],
                  sequenceCorrectOrder: ["ask", "emit", "execute", "result", "continue"],
                  explanation:
                    "Ask → emit call → execute → feed back result → continue. The loop defines an agent.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each tool element to its role.",
                  matchPairs: [
                    { left: "Tool schema", right: "JSON spec for name and args" },
                    { left: "Arguments", right: "Model-supplied parameters" },
                    { left: "Tool result", right: "Output fed back into context" },
                    { left: "Side effect", right: "Real-world action your code runs" },
                  ],
                  explanation:
                    "Schemas describe the interface, the model supplies args, results re-enter context, and side effects happen only in your code.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Why must tool arguments be validated before execution?",
                  multiSelectOptions: [
                    { text: "Models can invent arguments that do not exist", isCorrect: true },
                    { text: "Lenient tools can enable prompt-injection abuse", isCorrect: true },
                    { text: "Validation cost is always zero", isCorrect: false },
                    { text: "Side effects need safe assumptions", isCorrect: true },
                  ],
                  explanation:
                    "Validate schemas and values before any side effect — models are optimistic and prompts can inject malicious instructions.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the term for letting a model call real capabilities:",
                  scrambledWord: "function",
                  explanation:
                    "Function calling — structured tool invocations emitted by the model and executed by your app.",
                },
              ],
            },
            {
              title: "The Agent Loop",
              description: "Perceive, plan, act, reflect.",
              slug: "perceive-plan-act-reflect",
              estimatedMinutes: 7,
              learningObjectives: [
                "Describe the perceive/plan/act/reflect cycle",
                "Explain max-iteration guards",
                "Understand why agents need reflection",
              ],
              skills: [
                { name: "agent-loop", description: "Structure agent execution as a loop" },
              ],
              activities: [
                {
                  title: "A Cycle, Not a Single Call",
                  body: "Most agents run a **loop**: *perceive* (read the latest state — user input, tool results, memory), *plan* (decide the next action), *act* (call a tool or emit text), *reflect* (check the outcome against the goal) — then repeat. Because loops can run away, add a **maximum iteration count** and a **stop condition** (goal reached, max steps hit, error). Reflection is the loop's feedback signal; without it the agent happily repeats mistakes.",
                },
                {
                  title: "Example",
                  body: "A support agent plans to find a user's order, calls `lookup_order`, sees 'not found', reflects, then asks the user for the correct ID instead of guessing.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the final phase of the agent loop?",
                  options: ["Reflect", "Act", "Perceive", "Burnout"],
                  correctAnswer: "Reflect",
                  explanation:
                    "Reflect evaluates the action's outcome and decides whether to continue or stop — the feedback that closes the loop.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "An agent loop should always run until the user interrupts it.",
                  correctAnswer: "false",
                  explanation:
                    "Production loops need a max-iteration cap, cost budget, and stop condition to guarantee termination.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order one full pass of the agent loop.",
                  sequenceItems: [
                    { id: "perceive", text: "Read the current state" },
                    { id: "plan", text: "Decide the next action" },
                    { id: "act", text: "Call the tool or respond" },
                    { id: "reflect", text: "Check the outcome against the goal" },
                    { id: "stop", text: "Loop or halt per the stop condition" },
                  ],
                  sequenceCorrectOrder: ["perceive", "plan", "act", "reflect", "stop"],
                  explanation:
                    "Perceive → plan → act → reflect → then loop or stop. This is the canonical cycle.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A ___ condition (goal hit, max steps, or error) determines when the loop halts.",
                  fillBlanks: [{ answer: "stop" }],
                  explanation:
                    "Stop conditions guarantee the agent terminates instead of looping forever.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which guards prevent runaway agent loops?",
                  multiSelectOptions: [
                    { text: "Maximum iteration count", isCorrect: true },
                    { text: "Per-run cost budget", isCorrect: true },
                    { text: "Unlimited retries on tool errors", isCorrect: false },
                    { text: "Explicit success criteria", isCorrect: true },
                  ],
                  explanation:
                    "Iteration caps, cost budgets, and defined success criteria bound the run; unlimited retries invite runaway spend.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each loop phase to what it does.",
                  matchPairs: [
                    { left: "Perceive", right: "Gather current state" },
                    { left: "Plan", right: "Choose the next action" },
                    { left: "Act", right: "Execute a tool or reply" },
                    { left: "Reflect", right: "Evaluate against the goal" },
                  ],
                  explanation:
                    "Perceive gathers, plan chooses, act executes, and reflect evaluates to steer the next iteration.",
                },
              ],
            },
          ],
        },
        {
          title: "Safety Rails",
          description: "Stopping bad loops before they start.",
          slug: "safety-rails",
          lessons: [
            {
              title: "Guardrails",
              description: "Hard limits for autonomous behavior.",
              slug: "guardrails",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain input and output guardrails",
                "Describe allowlists for dangerous tools",
                "List common agent failure modes",
              ],
              skills: [
                { name: "guardrails", description: "Bound agent behavior with hard limits" },
              ],
              activities: [
                {
                  title: "Bounding Autonomy",
                  body: "**Guardrails** are enforcement points around the model: **input guardrails** check prompts for injection or policy violations, **output guardrails** validate that responses match schemas or constraints, and **action guardrails** gate risky tools behind allowlists or human approval. Agents fail loudly when a tool errors, silently when they hallucinate a success, and expensively when loops churn — so every boundary needs limits.",
                },
                {
                  title: "Example",
                  body: "An agent with shell access is denied a `rm -rf`-style tool unless a human approves; a money-transfer tool requires two-person confirmation.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does an output guardrail check?",
                  options: [
                    "The model's response against constraints",
                    "The user's age",
                    "The GPU temperature",
                    "The tokenizer dictionary",
                  ],
                  correctAnswer: "The model's response against constraints",
                  explanation:
                    "Output guardrails validate generated text against schemas, tone, or policy before it reaches the user or a system.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A tool restricted to a set of pre-approved commands is on an ___ list.",
                  fillBlanks: [{ answer: "allow" }],
                  explanation:
                    "Allowlists name exactly which commands/actions are permitted; everything else is denied.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are common agent failure modes?",
                  multiSelectOptions: [
                    { text: "Silent hallucinated success", isCorrect: true },
                    { text: "Infinite retry loops", isCorrect: true },
                    { text: "Prompt injection via untrusted input", isCorrect: true },
                    { text: "Token budgets always sufficient", isCorrect: false },
                  ],
                  explanation:
                    "Silent fabrication, runaway loops, and injection are the classic production failures; token/cost budgets need explicit caps.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each guardrail type to what it guards.",
                  matchPairs: [
                    { left: "Input guardrail", right: "Prompts entering the model" },
                    { left: "Output guardrail", right: "Responses leaving the model" },
                    { left: "Action guardrail", right: "Side-effecting tool calls" },
                    { left: "Human approval", right: "High-risk actions" },
                  ],
                  explanation:
                    "Guard in, guard out, and guard side effects — escalating high-risk actions to human approval.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Prompt injection happens when untrusted content smuggles instructions into a prompt.",
                  correctAnswer: "true",
                  explanation:
                    "Injection splits the prompt with untrusted text that aims to override the agent's instructions.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the term for safety checkpoints around a model:",
                  scrambledWord: "rails",
                  explanation:
                    "Guardrails — the enforcement boundaries around inputs, outputs, and actions.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};