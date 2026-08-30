import type { SeedPath } from "@/lib/curriculum/seed";

export const systemDesignLldPath: SeedPath = {
  title: "Low-Level Design",
  description:
    "Object modeling, SOLID, design patterns, and UML — the building blocks of clean, testable systems.",
  slug: "system-design-lld",
  modules: [
    {
      title: "Object Modeling",
      description: "Modeling the real world in classes.",
      slug: "object-modeling",
      icon: "Braces",
      units: [
        {
          title: "Classes & Interfaces",
          description: "The vocabulary of object design.",
          slug: "classes-interfaces",
          lessons: [
            {
              title: "Classes and Interfaces",
              description: "Contracts and implementations.",
              slug: "classes-interfaces",
              estimatedMinutes: 6,
              learningObjectives: [
                "Distinguish classes from interfaces",
                "Design with contracts, not implementations",
                "Explain encapsulation",
              ],
              skills: [
                { name: "classes-interfaces", description: "Design classes and interfaces" },
              ],
              activities: [
                {
                  title: "Contracts First",
                  body: "An **interface** declares behavior a caller can rely on — a contract. A **class** implements that contract plus its internal state. Consumers depend on the interface, so the implementation can change without breaking callers (**dependency inversion**). **Encapsulation** hides the internals: fields are private, behavior goes through methods.",
                },
                {
                  title: "Example",
                  body: "`interface PaymentGateway { authorize(...): Result }` — Stripe and PayPal each implement it. Checkout code never knows which is wired in.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does an interface define?",
                  options: [
                    "A contract of behavior without implementation",
                    "A concrete set of private fields",
                    "A database table",
                    "A UI layout",
                  ],
                  correctAnswer: "A contract of behavior without implementation",
                  explanation:
                    "Interfaces declare methods a caller can rely on; the how is left to implementing classes.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Depending on an interface instead of a concrete class makes implementations swappable.",
                  correctAnswer: "true",
                  explanation:
                    "Callers referencing the contract stay unchanged when you swap the implementation behind it.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question: "Hiding internal state behind methods is called ___.",
                  fillBlanks: [{ answer: "encapsulation" }],
                  explanation:
                    "Encapsulation keeps fields private and exposes behavior through methods.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are signs of a well-designed class?",
                  multiSelectOptions: [
                    { text: "Private fields with controlled access", isCorrect: true },
                    { text: "One clear responsibility", isCorrect: true },
                    { text: "Public mutable fields everywhere", isCorrect: false },
                    { text: "Stable interface, swappable implementation", isCorrect: true },
                  ],
                  explanation:
                    "Encapsulation, single responsibility, and a stable contract define good design; public mutable state invites bugs.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the term to its meaning.",
                  matchPairs: [
                    { left: "Interface", right: "Behavior contract" },
                    { left: "Class", right: "Contract + state" },
                    { left: "Encapsulation", right: "Hidden internals" },
                    { left: "Composition", right: "Behavior via contained objects" },
                  ],
                  explanation:
                    "Interfaces declare, classes implement, encapsulation hides, composition assembles.",
                },
              ],
            },
            {
              title: "Composition over Inheritance",
              description: "Assembling behavior from parts.",
              slug: "composition",
              estimatedMinutes: 6,
              learningObjectives: [
                "Contrast inheritance and composition",
                "Refactor deep hierarchies into composed parts",
                "Choose composition by default",
              ],
              skills: [
                { name: "composition", description: "Prefer composition over inheritance" },
              ],
              activities: [
                {
                  title: "Has-a Beats Is-a",
                  body: "**Inheritance** (is-a) shares behavior up a class tree but couples children to parents and creates brittle, deep hierarchies. **Composition** (has-a) assembles behavior from small objects — flexible, swappable, and easy to test. Prefer composition by default; use inheritance only for true specialization.",
                },
                {
                  title: "Example",
                  body: "Instead of `class Duck extends FlyingBird`, compose: `class Duck { flyer: FlyBehavior; quak(): QuackBehavior }`. Swap behaviors at runtime without class explosions.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is composition?",
                  options: [
                    "Assembling behavior from contained objects",
                    "Copy-pasting code between classes",
                    "One class inheriting every method of another",
                    "Merging two databases",
                  ],
                  correctAnswer: "Assembling behavior from contained objects",
                  explanation:
                    "Composition gives a class behavior by holding objects that provide it — no parent coupling.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Deep inheritance trees are brittle because changing a parent ripples through all children.",
                  correctAnswer: "true",
                  explanation:
                    "A parent tweak affects every subclass — the classic fragile base-class problem.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Composition is a '___-a' relationship; inheritance is an 'is-a' relationship.",
                  fillBlanks: [{ answer: "has" }],
                  explanation:
                    "Composition means the object has parts that supply behavior, rather than being a descendant.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When does inheritance still make sense?",
                  multiSelectOptions: [
                    { text: "A genuine specialization that never changes shape", isCorrect: true },
                    { text: "Sharing implementation across unrelated classes", isCorrect: false },
                    { text: "Framework callbacks designed for extension", isCorrect: true },
                    { text: "Reusing exactly one method from a far cousin", isCorrect: false },
                  ],
                  explanation:
                    "True specialized subtypes and framework-extension points justify inheritance; casual method reuse points to composition.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the refactor from inheritance to composition.",
                  sequenceItems: [
                    { id: "find", text: "Find the brittle hierarchy" },
                    { id: "extract", text: "Extract varying behavior into interfaces" },
                    { id: "build", text: "Build small behavior classes" },
                    { id: "compose", text: "Compose them into the main class" },
                    { id: "swap", text: "Swap behaviors freely at runtime" },
                  ],
                  sequenceCorrectOrder: ["find", "extract", "build", "compose", "swap"],
                  explanation:
                    "Find the variation → extract contracts → build implementations → compose → swap freely.",
                },
              ],
            },
            {
              title: "SOLID Principles",
              description: "Five rules for maintainable design.",
              slug: "solid",
              estimatedMinutes: 7,
              learningObjectives: [
                "Name all five SOLID principles",
                "Apply single responsibility",
                "Detect violations in code",
              ],
              skills: [
                { name: "solid", description: "Apply SOLID to designs" },
              ],
              activities: [
                {
                  title: "The Five Rules",
                  body: "**S**ingle Responsibility — one reason to change. **O**pen/Closed — open for extension, closed for modification. **L**iskov Substitution — subtypes stay substitutable. **I**nterface Segregation — small, focused interfaces. **D**ependency Inversion — depend on abstractions, not concretions. Violations read as tangles: god classes, `if/else` on type, fat interfaces, hard-to-swap collaborators.",
                },
                {
                  title: "Example",
                  body: "A `Report` class that formats, saves, AND emails is a single-responsibility violation → split into `ReportBuilder`, `ReportRepository`, `Mailer`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does Single Responsibility require?",
                  options: [
                    "A class has exactly one reason to change",
                    "A class can do everything",
                    "One file per repo",
                    "One method per class",
                  ],
                  correctAnswer: "A class has exactly one reason to change",
                  explanation:
                    "SRP: one axis of change. If two features change the same class for different reasons, split it.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Open/Closed means adding a new feature should extend behavior instead of editing existing logic.",
                  correctAnswer: "true",
                  explanation:
                    "Design for extension (strategy, plugin) so new behavior slots in without modifying stable code.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each SOLID letter to its idea.",
                  matchPairs: [
                    { left: "S", right: "One reason to change" },
                    { left: "O", right: "Extend, don't modify" },
                    { left: "L", right: "Subtypes stay substitutable" },
                    { left: "I", right: "Small focused interfaces" },
                    { left: "D", right: "Depend on abstractions" },
                  ],
                  explanation:
                    "S: single job; O: extension; L: substitution; I: segregation; D: inversion.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Liskov Substitution says subtypes must remain drop-in ___ of their parent type.",
                  fillBlanks: [{ answer: "replacements" }],
                  explanation:
                    "If a subclass breaks the parent's contract, callers break — the L in SOLID guards this.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which code smells flag SOLID violations?",
                  multiSelectOptions: [
                    { text: "A god class doing persistence, format, and email", isCorrect: true },
                    { text: "if/else branching on a type field", isCorrect: true },
                    { text: "Fat interfaces forced on small clients", isCorrect: true },
                    { text: "Short immutable value objects", isCorrect: false },
                  ],
                  explanation:
                    "God classes, type-switching, and fat interfaces are classic violations; small value objects are fine.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Patterns & Components",
      description: "Proven blueprints for structure.",
      slug: "patterns",
      icon: "Blocks",
      units: [
        {
          title: "Design Patterns",
          description: "Catalog of reusable solutions.",
          slug: "patterns-catalog",
          lessons: [
            {
              title: "Creational Patterns",
              description: "Object creation made sane.",
              slug: "creational",
              estimatedMinutes: 6,
              learningObjectives: [
                "Name common creational patterns",
                "Apply factory and builder",
                "Recognize overuse",
              ],
              skills: [
                { name: "creational", description: "Apply creational design patterns" },
              ],
              activities: [
                {
                  title: "Creating Objects Without Pain",
                  body: "**Factory** centralizes object creation behind one method — callers stop knowing constructors. **Factory Method** delegates creation to subclasses. **Builder** assembles complex objects step by step, keeping construction readable. **Singleton** guarantees one instance — useful rarely (config), harmful when misused (global mutable state).",
                },
                {
                  title: "Example",
                  body: "A `PaymentProcessorFactory.create(\"stripe\")` returns the right client from config; a `ReportBuilder` assembles a report from optional sections.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does the Factory pattern centralize?",
                  options: [
                    "Object construction in one place",
                    "All business logic",
                    "Database migrations",
                    "Routing tables",
                  ],
                  correctAnswer: "Object construction in one place",
                  explanation:
                    "Factories own construction decisions so callers ask for behavior, not constructors.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A Singleton guarantees a single instance, which is useful for truly global resources.",
                  correctAnswer: "true",
                  explanation:
                    "One instance fits shared resources, but hidden global state makes testing hard — use sparingly.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The pattern that builds complex objects step by step is the ___.",
                  fillBlanks: [{ answer: "builder" }],
                  explanation:
                    "Builder chains labeled steps so complex construction stays readable.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the pattern to its use.",
                  matchPairs: [
                    { left: "Factory", right: "One creation entry point" },
                    { left: "Factory Method", right: "Subclasses decide the type" },
                    { left: "Builder", right: "Step-by-step assembly" },
                    { left: "Singleton", right: "Exactly one instance" },
                  ],
                  explanation:
                    "Factory centralizes, factory-method varies by subclass, builder assembles, singleton limits to one.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When is a Singleton more trouble than help?",
                  multiSelectOptions: [
                    { text: "It hides dependencies from callers", isCorrect: true },
                    { text: "It makes tests share mutable state", isCorrect: true },
                    { text: "It is difficult to swap implementations", isCorrect: true },
                    { text: "It is always the wrong answer", isCorrect: false },
                  ],
                  explanation:
                    "Hidden deps, shared test state, and no swapping are the real costs — it still fits rare global resources.",
                },
              ],
            },
            {
              title: "Structural & Behavioral",
              description: "Shaping objects and their interactions.",
              slug: "structural-behavioral",
              estimatedMinutes: 6,
              learningObjectives: [
                "Describe strategy and observers",
                "Explain decorator and adapter",
                "Match patterns to problems",
              ],
              skills: [
                { name: "structural-behavioral", description: "Apply structural and behavioral patterns" },
              ],
              activities: [
                {
                  title: "Shape and Conversation",
                  body: "**Adapter** makes a foreign interface compatible. **Decorator** adds behavior by wrapping, layer by layer. **Observer** lets many objects react to one change — the publish/subscribe backbone of UIs and events. **Strategy** selects interchangeable algorithms at runtime.",
                },
                {
                  title: "Example",
                  body: "Adapter: a legacy billing API wrapped to `PaymentGateway`. Decorator: logging + metrics wrapped around an HTTP client. Observer: a store notifies panels and badges on change.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does an Adapter do?",
                  options: [
                    "Makes an incompatible interface fit a caller's expectation",
                    "Deletes old code",
                    "Adds caching to a database",
                    "Turns JSON into CSS",
                  ],
                  correctAnswer: "Makes an incompatible interface fit a caller's expectation",
                  explanation:
                    "The adapter translates one interface into another so existing callers succeed at no cost.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "The Observer pattern notifies many dependents when a subject changes, without the subject knowing them.",
                  correctAnswer: "true",
                  explanation:
                    "Subjects publish to observers — decoupled one-to-many notification.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match the pattern to its job.",
                  matchPairs: [
                    { left: "Adapter", right: "Interface translation" },
                    { left: "Decorator", right: "Layered wrapping" },
                    { left: "Observer", right: "Notify on change" },
                    { left: "Strategy", right: "Swappable algorithm" },
                  ],
                  explanation:
                    "Adapter translates, decorator wraps, observer notifies, strategy swaps algorithms.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the layers applied by a decorator stack.",
                  sequenceItems: [
                    { id: "client", text: "Caller invokes the outer wrapper" },
                    { id: "metric", text: "Metrics decorator times the call" },
                    { id: "log", text: "Logging decorator records it" },
                    { id: "retry", text: "Retry decorator handles failures" },
                    { id: "http", text: "Real HTTP client executes" },
                  ],
                  sequenceCorrectOrder: ["client", "metric", "log", "retry", "http"],
                  explanation:
                    "Decorators compose outside-in: metrics → log → retry, unwrapping to the real client.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which situations suit the Strategy pattern?",
                  multiSelectOptions: [
                    { text: "Switching sort algorithms by dataset size", isCorrect: true },
                    { text: "Pluggable payment providers", isCorrect: true },
                    { text: "Many if/else branches choosing an algorithm", isCorrect: false },
                    { text: "Encoding variants that differ per tenant", isCorrect: true },
                  ],
                  explanation:
                    "Variability in behavior with a stable interface is strategy territory; staying more code than branches is a smell.",
                },
              ],
            },
            {
              title: "UML & Component Design",
              description: "Drawing the design before building.",
              slug: "uml-components",
              estimatedMinutes: 6,
              learningObjectives: [
                "Read class diagrams and sequence diagrams",
                "Sketch system components and interfaces",
                "Keep diagrams as living documentation",
              ],
              skills: [
                { name: "uml", description: "Model designs with UML" },
              ],
              activities: [
                {
                  title: "Pictures of the Design",
                  body: "A **class diagram** shows classes, attributes, and relationships (association, composition, inheritance). A **sequence diagram** shows message flow over time between objects. A **component diagram** maps larger pieces and their interfaces. Diagrams capture the why as cheaply as possible — the goal is shared understanding, maybe a notation and interface file.",
                },
                {
                  title: "Example",
                  body: "Checkout: sequence diagram shows `Cart → CheckoutService → PaymentGateway.authorize() → OrderRepository.save()`. Component diagram shows `WebApp → API → OrdersService / BillingService`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which UML diagram shows message exchange over time?",
                  options: [
                    "Sequence diagram",
                    "Class diagram",
                    "Pie chart",
                    "ER diagram",
                  ],
                  correctAnswer: "Sequence diagram",
                  explanation:
                    "Sequence diagrams lay messages along a timeline between participants.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A component diagram depicts large pieces of the system and their exposed interfaces.",
                  correctAnswer: "true",
                  explanation:
                    "Components group classes/services and show how they integrate at a coarse grain.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A solid line with a hollow diamond marks ___ between a whole and its parts.",
                  fillBlanks: [{ answer: "composition" }],
                  explanation:
                    "Filled diamond = composition (parts die with the whole); hollow = aggregation.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which habits keep designs useful?",
                  multiSelectOptions: [
                    { text: "Diagrams stored next to the code they describe", isCorrect: true },
                    { text: "Reviewing them in design review", isCorrect: true },
                    { text: "Diagramming every trivial detail forever", isCorrect: false },
                    { text: "Treating either a code contract output", isCorrect: true },
                  ],
                  explanation:
                    "Living artifacts near the code, reviewed and cheap, beat exhaustive wallpaper.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order an end-to-end LLD workflow.",
                  sequenceItems: [
                    { id: "reqs", text: "Capture requirements and constraints" },
                    { id: "classes", text: "Sketch class/object model" },
                    { id: "flows", text: "Draw sequence for key flows" },
                    { id: "components", text: "Map components and interfaces" },
                    { id: "review", text: "Review, refine, and implement" },
                  ],
                  sequenceCorrectOrder: ["reqs", "classes", "flows", "components", "review"],
                  explanation:
                    "Requirements → object model → sequence flows → components → review and build.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};