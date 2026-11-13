import type { SeedPath } from "@/lib/curriculum/seed";

export const promptEngineeringPath: SeedPath = {
  title: "Prompt Engineering",
  description:
    "Zero- and few-shot prompting, role and instruction prompts, structured output with JSON and function calling, and measuring prompt quality.",
  slug: "prompt-engineering",
  modules: [
    {
      title: "Prompting Principles",
      description: "Zero-shot, few-shot, and role prompts.",
      slug: "principles",
      icon: "Wand2",
      units: [
        {
          title: "Fundamentals",
          description: "How to talk to a model productively.",
          slug: "fundamentals",
          lessons: [
            {
              title: "Zero-Shot Prompts",
              description: "Getting good answers on the first try.",
              slug: "zero-shot",
              estimatedMinutes: 6,
              learningObjectives: [
                "Write clear task-oriented prompts",
                "Separate instructions from content",
                "Use delimiters to avoid ambiguity",
              ],
              skills: [
                { name: "zero-shot", description: "Write effective single-shot prompts" },
              ],
              activities: [
                {
                  title: "Clarity Wins",
                  body: "A **zero-shot** prompt gives a task with no examples. Clarity beats cleverness: state the **task**, the **format**, the **input**, and any **constraints**, in that order. Use **delimiters** (triple quotes, tags, XML) to fence data so it is not confused with instructions. One task per message; vague prompts return vague answers.",
                },
                {
                  title: "Example",
                  body: "Poor: 'Summarize this text.' Better: 'Summarize the following article in at most 3 bullet points. Do not include opinions. Article: <<< ... >>>'.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a zero-shot prompt?",
                  options: [
                    "A task given without any examples",
                    "A prompt with ten examples",
                    "A prompt with zero output",
                    "A hidden system prompt",
                  ],
                  correctAnswer: "A task given without any examples",
                  explanation:
                    "Zero-shot means no examples — just a clear instruction. Few-shot adds examples.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Delimiters between instructions and data reduce ambiguous model behavior.",
                  correctAnswer: "true",
                  explanation:
                    "Fencing the data (with delimiters) stops the model from treating content as instructions.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the parts of a strong zero-shot prompt.",
                  sequenceItems: [
                    { id: "role", text: "Optional role context" },
                    { id: "task", text: "What the model should do" },
                    { id: "data", text: "The input/content to transform" },
                    { id: "format", text: "The output shape requested" },
                    { id: "constraint", text: "Rules and limits to obey" },
                  ],
                  sequenceCorrectOrder: ["role", "task", "data", "format", "constraint"],
                  explanation:
                    "Role, then task, then data, then requested format, then constraints — the canonical template.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A prompt that gives the model a task but no examples is called ___ -shot.",
                  fillBlanks: [{ answer: "zero" }],
                  explanation:
                    "Zero-shot = zero examples. The model relies on instruction clarity alone.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which practices improve a zero-shot prompt?",
                  multiSelectOptions: [
                    { text: "Stating the desired output format", isCorrect: true },
                    { text: "Fencing the input data with delimiters", isCorrect: true },
                    { text: "Combining several unrelated tasks", isCorrect: false },
                    { text: "Specifying constraints up front", isCorrect: true },
                  ],
                  explanation:
                    "Format, delimiters, and constraints sharpen results; task-stacking muddies them.",
                },
              ],
            },
            {
              title: "Few-Shot Prompts",
              description: "Teaching with examples.",
              slug: "few-shot",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain why examples help",
                "Write good example pairs",
                "Choose diverse, representative examples",
              ],
              skills: [
                { name: "few-shot", description: "Teach models with example pairs" },
              ],
              activities: [
                {
                  title: "Show, Don't Just Tell",
                  body: "**Few-shot** prompting includes example input→output pairs. Examples anchor the **format, tone, and reasoning pattern**, especially for classification or data extraction. Pick examples that cover **edge cases** — a 'no' example matters as much as a 'yes' example. Too many or repetitive examples add tokens without accuracy; 2–6 curated examples usually beat 50 random ones.",
                },
                {
                  title: "Example",
                  body: "Classify support tickets: 'Refund for order #88' → refund; 'Order is late' → shipping; 'I was charged twice' → billing. Three examples teach the taxonomy better than a paragraph of text.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What anchors model behavior in few-shot prompting?",
                  options: [
                    "Curated example input/output pairs",
                    "Longer instructions",
                    "A bigger context window",
                    "Random whitespace",
                  ],
                  correctAnswer: "Curated example input/output pairs",
                  explanation:
                    "Examples teach format, tone, and reasoning better than instruction text alone.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Including representative negative examples improves classifier few-shot prompts.",
                  correctAnswer: "true",
                  explanation:
                    "A 'no' example teaches the boundary as effectively as a 'yes' example.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which few-shot examples are most valuable?",
                  multiSelectOptions: [
                    { text: "Coverage of edge cases", isCorrect: true },
                    { text: "A mix of positive and negative labels", isCorrect: true },
                    { text: "Hundreds of near-identical examples", isCorrect: false },
                    { text: "Examples showing the exact output format", isCorrect: true },
                  ],
                  explanation:
                    "Edge cases, mixed labels, and format-consistent examples teach most; volume without variety just costs tokens.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each prompt technique to its demand on the model.",
                  matchPairs: [
                    { left: "Zero-shot", right: "Understand from instruction only" },
                    { left: "Few-shot", right: "Generalize from examples" },
                    { left: "Chain-of-thought", right: "Reason step by step" },
                    { left: "Role prompt", right: "Adopt a perspective" },
                  ],
                  explanation:
                    "Zero-shot relies on instruction, few-shot on examples, CoT on reasoning, and roles on perspective.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Providing the model with a small number of examples is called ___ -shot prompting.",
                  fillBlanks: [{ answer: "few" }],
                  explanation:
                    "Few-shot = include several representative examples alongside the task.",
                },
              ],
            },
            {
              title: "Role Prompts",
              description: "Instructing with persona and framing.",
              slug: "role-prompts",
              estimatedMinutes: 5,
              learningObjectives: [
                "Explain the persona technique",
                "Frame tone and expertise with roles",
                "Combine roles with concrete tasks",
              ],
              skills: [
                { name: "role-prompts", description: "Use persona framing to shape output" },
              ],
              activities: [
                {
                  title: "Adopt a Persona",
                  body: "A **role prompt** asks the model to adopt a perspective — 'You are a senior database reviewer.' The role primes **tone, vocabulary, and priorities**, but it is not magic: the task still needs to be concrete. Roles are most useful when the output must match a professional framing, like code review, security audit, or support response.",
                },
                {
                  title: "Example",
                  body: "Reviewing SQL: 'You are a performance-focused DBA. Point out missing indexes and cost-heavy scans. Then suggest a rewrite.'",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does a role prompt primarily shape?",
                  options: [
                    "Tone, vocabulary, and priorities",
                    "The GPU clock speed",
                    "The tokenizer rules",
                    "The database schema",
                  ],
                  correctAnswer: "Tone, vocabulary, and priorities",
                  explanation:
                    "A persona frames how the model sees the task — its vocabulary, tone, and where it focuses.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A role prompt substitutes for a precise task description.",
                  correctAnswer: "false",
                  explanation:
                    "Roles frame, but the concrete task, format, and constraints still carry the requirements.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Asking a model to respond 'as a senior platform engineer' is a ___ prompt.",
                  fillBlanks: [{ answer: "role" }],
                  explanation:
                    "Role/persona prompts adopt a perspective to influence tone and priorities.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are good uses of role prompting?",
                  multiSelectOptions: [
                    { text: "Framing security-sensitive code review", isCorrect: true },
                    { text: "Setting the tone of a support bot", isCorrect: true },
                    { text: "Replacing all task detail", isCorrect: false },
                    { text: "Jailbreaking system instructions", isCorrect: false },
                  ],
                  explanation:
                    "Roles frame professional tasks and tone; they never replace task detail, and bypassing system instructions is abuse, not prompting.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each persona role to the framing it is best used for.",
                  matchPairs: [
                    { left: "Code reviewer", right: "Find logic bugs and style issues" },
                    { left: "Security auditor", right: "Surface threats and mitigations" },
                    { left: "Support agent", right: "Set a helpful, empathetic tone" },
                    { left: "Performance-focused DBA", right: "Flag missing indexes and cost-heavy scans" },
                  ],
                  explanation:
                    "Each role primes different vocabulary and priorities — reviewers hunt flaws, auditors hunt threats, support softens tone, and a DBA hunts slow queries.",
                },
              ],
            },
          ],
        },
        {
          title: "Structured Output",
          description: "JSON, schemas, and function calling.",
          slug: "structured-output",
          lessons: [
            {
              title: "Getting Valid JSON",
              description: "Reliable structured responses.",
              slug: "json-output",
              estimatedMinutes: 7,
              learningObjectives: [
                "Ask for JSON output reliably",
                "Use constrained decoding where available",
                "Validate before use",
              ],
              skills: [
                { name: "json-output", description: "Get schema-valid JSON from models" },
              ],
              activities: [
                {
                  title: "Parse, Don't Pray",
                  body: "Asking 'return JSON' is often enough, but for production use either **structured outputs** (providers that constrain decoding to a schema) or **function-calling** mode and then **validate** the result with a schema library. Always treat the model's output as untrusted data: parse it, validate it, and fail loudly rather than trusting it.",
                },
                {
                  title: "Example",
                  body: "A request for `{\"name\": string, \"risk\": \"low\"|\"high\"}` in model-mode returns valid JSON; in function-calling mode the same schema is enforced by the provider.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the safest way to enforce an output schema?",
                  options: [
                    "Constrained decoding / structured outputs",
                    "Post-processing free text with regex",
                    "Asking politely twice",
                    "Using a bigger temperature",
                  ],
                  correctAnswer: "Constrained decoding / structured outputs",
                  explanation:
                    "Provider-side schema enforcement guarantees shape; validating parsed output adds a second fence.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Model output should be treated as untrusted data and validated before use.",
                  correctAnswer: "true",
                  explanation:
                    "Models can emit bad or malicious JSON — parse, validate, and fail loudly.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the safe-JSON pipeline.",
                  sequenceItems: [
                    { id: "schema", text: "Define a strict JSON schema" },
                    { id: "prompt", text: "Ask the model for structured output" },
                    { id: "parse", text: "Parse the response" },
                    { id: "validate", text: "Validate against the schema" },
                    { id: "reject", text: "Reject and retry on mismatch" },
                  ],
                  sequenceCorrectOrder: ["schema", "prompt", "parse", "validate", "reject"],
                  explanation:
                    "Schema → prompt → parse → validate → reject. Validation failures cost nothing compared to trusting bad data.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the format name for key-value structured data:",
                  scrambledWord: "json",
                  explanation:
                    "JSON — JavaScript Object Notation, the standard structured-output format.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "When should you choose function calling over free-form JSON?",
                  multiSelectOptions: [
                    { text: "When an action follows the parse", isCorrect: true },
                    { text: "When the provider guarantees schema compliance", isCorrect: true },
                    { text: "When you never validate output anyway", isCorrect: false },
                    { text: "When outputs feed a typed API", isCorrect: true },
                  ],
                  explanation:
                    "Function calling pairs structured output with a typed action and provider-side guarantees — but you still validate.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Mode where the provider only generates text matching a JSON Schema is called a ___ output.",
                  fillBlanks: [{ answer: "structured" }],
                  explanation:
                    "Structured outputs constrain decoding so responses always conform to the schema.",
                },
              ],
            },
          ],
        },
        {
          title: "Evaluation",
          description: "Measuring prompt quality.",
          slug: "evaluation",
          lessons: [
            {
              title: "Evaluating Prompts",
              description: "Score, compare, iterate.",
              slug: "evaluating-prompts",
              estimatedMinutes: 7,
              learningObjectives: [
                "Define a golden test set",
                "Compare prompt versions with A/B runs",
                "Track metrics like accuracy and format compliance",
              ],
              skills: [
                { name: "eval", description: "Measure and iterate on prompt quality" },
              ],
              activities: [
                {
                  title: "Prompts Are Code",
                  body: "Treat prompt changes like code changes: version them and test them. Build a **golden set** of representative inputs with expected behaviors, run every prompt version against it, and compare **metrics** — accuracy, format compliance, refusal rate, latency-adjacent token usage. Change one variable at a time; a prompt that improves on a golden set, then holds on a held-out set, is a keeper.",
                },
                {
                  title: "Example",
                  body: "V2 of your extraction prompt hits 92% on the golden set vs 88% for V1 — but adds 30% more tokens. The decision depends on cost and accuracy targets, not the score alone.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is a golden test set for prompt evaluation?",
                  options: [
                    "Representative inputs with known expected behavior",
                    "Random internet sentences",
                    "The training prompts of the model",
                    "System log lines",
                  ],
                  correctAnswer: "Representative inputs with known expected behavior",
                  explanation:
                    "A golden set is labeled input/output pairs used to score prompt versions consistently.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Correctly evaluating a prompt change requires changing only one variable at a time.",
                  correctAnswer: "true",
                  explanation:
                    "Multiple simultaneous edits make it impossible to attribute an accuracy change to one cause.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which metrics matter when comparing prompt versions?",
                  multiSelectOptions: [
                    { text: "Accuracy on the golden set", isCorrect: true },
                    { text: "Format/schema compliance rate", isCorrect: true },
                    { text: "Total tokens (cost) per call", isCorrect: true },
                    { text: "Nothing, only vibe", isCorrect: false },
                  ],
                  explanation:
                    "Accuracy, compliance, and cost are the core trade-offs — 'vibe' is how you mislead stakeholders.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a prompt-iteration loop.",
                  sequenceItems: [
                    { id: "baseline", text: "Capture the current version's metrics" },
                    { id: "edit", text: "Change one component of the prompt" },
                    { id: "score", text: "Run the golden set" },
                    { id: "compare", text: "Compare metrics to baseline" },
                    { id: "ship", text: "Adopt if it wins, revert if not" },
                  ],
                  sequenceCorrectOrder: ["baseline", "edit", "score", "compare", "ship"],
                  explanation:
                    "Baseline → single-edit → score → compare → ship or revert. Small, measurable steps.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Running a fixed, labeled set of inputs to score a prompt is called evaluating on a ___ set.",
                  fillBlanks: [{ answer: "golden" }],
                  explanation:
                    "A golden set is the standard, fixed benchmark for comparing prompt versions.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};