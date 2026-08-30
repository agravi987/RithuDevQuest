import type { SeedPath } from "@/lib/curriculum/seed";

export const reactPath: SeedPath = {
  title: "React",
  description:
    "Components, props, state, effects, and hooks — building interactive UIs with declarative React.",
  slug: "react",
  modules: [
    {
      title: "Components",
      description: "JSX, props, and rendering.",
      slug: "components",
      icon: "Component",
      units: [
        {
          title: "The Component Model",
          description: "Functions that return UI.",
          slug: "component-model",
          lessons: [
            {
              title: "Components & JSX",
              description: "Building blocks of a React UI.",
              slug: "components-jsx",
              estimatedMinutes: 7,
              learningObjectives: [
                "Write components as functions",
                "Use JSX to describe markup",
                "Compose and nest components",
              ],
              skills: [
                { name: "components-jsx", description: "Compose React components with JSX" },
              ],
              activities: [
                {
                  title: "UI as Functions",
                  body: "A **component** is a function returning markup-like **JSX** to describe the UI. Components are capitalized (`UserCard`, not `usercard`) so JSX knows they are components. They **compose**: a page is a tree of components. React re-renders a component when its props or state change — the function just re-runs and returns new JSX.",
                },
                {
                  title: "Example",
                  body: "`function Greeting({ name }) { return <h1>Hello {name}</h1>; }` — call it as `<Greeting name=\"Ada\" />` anywhere.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How is a React component defined?",
                  options: [
                    "As a function returning JSX",
                    "As an HTML file",
                    "As a raw template string",
                    "As a CSS class",
                  ],
                  correctAnswer: "As a function returning JSX",
                  explanation:
                    "Components are functions (or classes) that return JSX describing the rendered output.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Components must start with a capital letter so JSX treats them as components, not HTML tags.",
                  correctAnswer: "true",
                  explanation:
                    "Lowercase JSX is treated as a DOM tag; capitalization signals a component.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order what happens when a React component renders.",
                  sequenceItems: [
                    { id: "call", text: "Component function is called" },
                    { id: "props", text: "It reads its props" },
                    { id: "jsx", text: "It returns JSX" },
                    { id: "reconcile", text: "React diffs against the last render" },
                    { id: "commit", text: "Changes are committed to the DOM" },
                  ],
                  sequenceCorrectOrder: ["call", "props", "jsx", "reconcile", "commit"],
                  explanation:
                    "Call → read props → return JSX → reconcile with previous → commit DOM changes.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "JSX lets you embed JavaScript expressions inside curly ___.",
                  fillBlanks: [{ answer: "braces" }],
                  explanation:
                    "Curly braces `{expr}` embed JavaScript values into JSX markup.",
                },
                {
                  type: "multi_select",
                  difficulty: "beginner",
                  question: "Which are valid JSX usages?",
                  multiSelectOptions: [
                    { text: "Embedding a variable: <p>{name}</p>", isCorrect: true },
                    { text: "Rendering an array by mapping to components", isCorrect: true },
                    { text: "Putting a raw if statement inside JSX", isCorrect: false },
                    { text: "Nesting components inside each other", isCorrect: true },
                  ],
                  explanation:
                    "Expressions via braces, mapping arrays, and nesting are idiomatic; `if` statements belong outside JSX (ternaries and && work).",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the language that React's UI syntax is built on:",
                  scrambledWord: "jsx",
                  explanation:
                    "JSX — a JavaScript syntax extension for describing UI trees.",
                },
              ],
            },
            {
              title: "Props",
              description: "Data flowing down.",
              slug: "props",
              estimatedMinutes: 6,
              learningObjectives: [
                "Pass data through props",
                "Make composable components",
                "Handle default values",
              ],
              skills: [
                { name: "react-props", description: "Pass data between components" },
              ],
              activities: [
                {
                  title: "One-Way Data Flow",
                  body: "Props are read-only inputs passed from parent to child: `<UserCard user={user} showRole />`. Props flow **down**; children cannot mutate them. This one-way flow keeps data predictable. Set defaults with default parameter syntax, and treat props as configuration, not mutable state.",
                },
                {
                  title: "Example",
                  body: "`<UserCard user={alice} showRole={true} />` — the card component receives user and a showRole flag and renders accordingly.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "In which direction do props flow in React?",
                  options: ["Parent to child", "Child to parent", "Sideways between siblings", "Both ways"],
                  correctAnswer: "Parent to child",
                  explanation:
                    "Props travel down the tree one-way; children communicate up via callbacks instead.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A child component can mutate the props it receives.",
                  correctAnswer: "false",
                  explanation:
                    "Props are read-only — components treat them as immutable inputs and state for mutability.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each pattern to what it accomplishes.",
                  matchPairs: [
                    { left: "Prop default", right: "Value when not provided" },
                    { left: "Callback prop", right: "Child signals upward" },
                    { left: "Destructured props", right: "Named access in the body" },
                    { left: "Prop spreading", right: "Pass many props at once" },
                  ],
                  explanation:
                    "Defaults fill gaps, callbacks lift events up, destructuring names props, spreading passes a whole object.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A function a child calls so the parent knows something happened is a ___ prop.",
                  fillBlanks: [{ answer: "callback" }],
                  explanation:
                    "Callback props (like onDelete) let the child notify the parent while keeping one-way flow.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the life of a prop value.",
                  sequenceItems: [
                    { id: "state", text: "Parent holds the data in state" },
                    { id: "pass", text: "Parent passes it as a prop" },
                    { id: "child", text: "Child reads the prop" },
                    { id: "update", text: "Parent state updates" },
                    { id: "rerender", text: "Child re-renders with the new value" },
                  ],
                  sequenceCorrectOrder: ["state", "pass", "child", "update", "rerender"],
                  explanation:
                    "Owner state → pass down → child reads → owner updates → child re-renders. Data always owns its source of truth.",
                },
              ],
            },
          ],
        },
        {
          title: "State & Rendering",
          description: "useState and the render cycle.",
          slug: "state-rendering",
          lessons: [
            {
              title: "State",
              description: "Data that changes over time.",
              slug: "use-state",
              estimatedMinutes: 7,
              learningObjectives: [
                "Add state with useState",
                "Understand re-renders on state change",
                "Update state immutably",
              ],
              skills: [
                { name: "react-state", description: "Manage mutable component data" },
              ],
              activities: [
                {
                  title: "Memory That Re-renders",
                  body: "**useState** gives a component local memory: `const [count, setCount] = useState(0)`. Calling **setCount** schedules a re-render with the new value. Update **immutably** — copy objects and arrays, never mutate them in place — or React can miss changes. Multiple set calls in one event batch into one render.",
                },
                {
                  title: "Example",
                  body: "A counter: `setCount(c => c + 1)` (functional update, always fresh) versus `setCount(count + 1)` (reads the render's value).",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does useState return?",
                  options: [
                    "An array with the value and its setter",
                    "An object with two fields",
                    "A single mutated variable",
                    "The DOM node",
                  ],
                  correctAnswer: "An array with the value and its setter",
                  explanation:
                    "useState returns [value, setter] — destructure them: const [value, setValue] = useState(init).",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Calling the state setter triggers a re-render of the component.",
                  correctAnswer: "true",
                  explanation:
                    "setState schedules a re-render so the UI reflects the new state.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order what happens when a button's setCount runs.",
                  sequenceItems: [
                    { id: "click", text: "User clicks the button" },
                    { id: "setter", text: "Handler calls setCount" },
                    { id: "schedule", text: "React schedules a re-render" },
                    { id: "rerun", text: "Component function re-runs" },
                    { id: "paint", text: "New UI is committed to the DOM" },
                  ],
                  sequenceCorrectOrder: ["click", "setter", "schedule", "rerun", "paint"],
                  explanation:
                    "Click → setCount → schedule render → re-run component → commit. State drives UI change.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each state concern to its practice.",
                  matchPairs: [
                    { left: "Arrays", right: "Copy, then update" },
                    { left: "Objects", right: "Spread before changing" },
                    { left: "Derived values", right: "Compute, don't store" },
                    { left: "Functional update", right: "Always-fresh setter" },
                  ],
                  explanation:
                    "Copy-then-update for collections, compute derived values, and use functional updates where freshness matters.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Updating the setter with `c => c + 1` is a ___ update that always sees the latest value.",
                  fillBlanks: [{ answer: "functional" }],
                  explanation:
                    "Functional updates receive the current value, avoiding stale closures in batched events.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which statements about state are true?",
                  multiSelectOptions: [
                    { text: "State changes trigger re-renders", isCorrect: true },
                    { text: "Mutating an object in place reliably re-renders", isCorrect: false },
                    { text: "Don't store what you can compute", isCorrect: true },
                    { text: "Multiple setters can batch into one render", isCorrect: true },
                  ],
                  explanation:
                    "State is the re-render trigger, immutability matters, derived values are computed not stored, and batching is real.",
                },
              ],
            },
            {
              title: "Effects",
              description: "Side effects and synchronization.",
              slug: "use-effect",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain when useEffect is (not) needed",
                "Control effect runs with dependencies",
                "Clean up subscriptions",
              ],
              skills: [
                { name: "react-effects", description: "Synchronize with outside systems" },
              ],
              activities: [
                {
                  title: "Sync, Not a Timer",
                  body: "**useEffect** synchronizes a component with an outside system — the browser, an API, a subscription. `useEffect(() => { ... }, [deps])` runs after render; changing **deps** re-runs it; an empty array runs once; and a returned cleanup function undoes whatever the effect set up. Many fetch bugs come from effects that fire on every render because deps are missing or unstable.",
                },
                {
                  title: "Example",
                  body: "`useEffect(() => { const t = setInterval(tick, 1000); return () => clearInterval(t); }, [])` — an interval created once and cleaned up on unmount.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does the dependency array control?",
                  options: [
                    "Which values decide when the effect re-runs",
                    "The component's position in the tree",
                    "The CSS theme",
                    "Whether state is allowed",
                  ],
                  correctAnswer: "Which values decide when the effect re-runs",
                  explanation:
                    "The effect re-runs when any listed dependency changes; an empty array means run once (on mount).",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A cleanup function returned from an effect undoes whatever the effect set up.",
                  correctAnswer: "true",
                  explanation:
                    "Cleanup runs on re-run and unmount — clearing intervals, unsubscribing, aborting fetches.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the lifecycle of an effect with a cleanup.",
                  sequenceItems: [
                    { id: "mount", text: "Component mounts" },
                    { id: "run", text: "Effect runs" },
                    { id: "setup", text: "Subscription is created" },
                    { id: "cleanup", text: "On unmount/changes, cleanup runs" },
                    { id: "teardown", text: "Resource is released" },
                  ],
                  sequenceCorrectOrder: ["mount", "run", "setup", "cleanup", "teardown"],
                  explanation:
                    "Mount → run effect → set up → eventual cleanup → teardown. Cleanup mirrors every setup.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A dependency array that is left out runs the effect after ___ render.",
                  fillBlanks: [{ answer: "every" }],
                  explanation:
                    "No dependency array means the effect re-runs after every render — usually a bug, sometimes intended.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which describe good useEffect usage?",
                  multiSelectOptions: [
                    { text: "Subscriptions and intervals with cleanup", isCorrect: true },
                    { text: "Fetching inside effects with abort handling", isCorrect: true },
                    { text: "Deriving values that render computations", isCorrect: false },
                    { text: "Stable, minimal dependency arrays", isCorrect: true },
                  ],
                  explanation:
                    "Effects are for outside systems; derived values should be computed during render, not with effects.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Interactions & Patterns",
      description: "Events, forms, and custom hooks.",
      slug: "interactions-patterns",
      icon: "MousePointerClick",
      units: [
        {
          title: "User Input",
          description: "Events and controlled forms.",
          slug: "user-input",
          lessons: [
            {
              title: "Events & Forms",
              description: "Handling input the React way.",
              slug: "events-forms",
              estimatedMinutes: 6,
              learningObjectives: [
                "Attach handlers with onClick/onChange",
                "Build controlled inputs",
                "Submit forms without reloading",
              ],
              skills: [
                { name: "react-events", description: "Build event-and-form interactions" },
              ],
              activities: [
                {
                  title: "Controlled Inputs",
                  body: "React handlers attach declaratively: `onClick`, `onChange`, `onSubmit`. A **controlled input** stores its value in state and updates it in onChange: `value` + `onChange`. The form's `onSubmit` calls `e.preventDefault()` (stop the reload), reads state, and passes it up. Controlled inputs make validation and resetting trivial because the state is the truth.",
                },
                {
                  title: "Example",
                  body: "`<input value={email} onChange={(e) => setEmail(e.target.value)} />` — the input always mirrors state, and state always mirrors the input.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What must a controlled input's onChange do?",
                  options: [
                    "Update the state holding its value",
                    "Rebuild the whole component",
                    "Submit the form early",
                    "Navigate away",
                  ],
                  correctAnswer: "Update the state holding its value",
                  explanation:
                    "onChange writes the new value back into state so value (driven by state) stays in sync.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "In React, form submission requires calling e.preventDefault() to avoid a full page reload.",
                  correctAnswer: "true",
                  explanation:
                    "The default form action reloads; preventDefault keeps it in the SPA and lets React handle it.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each event to when it fires.",
                  matchPairs: [
                    { left: "onClick", right: "Element is clicked" },
                    { left: "onChange", right: "Input value changes" },
                    { left: "onSubmit", right: "Form is submitted" },
                    { left: "onFocus", right: "Field gains focus" },
                  ],
                  explanation:
                    "Click for interactions, change for inputs, submit for forms, focus for keyboard flows.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "An input whose value is stored in state and rewritten by onChange is **___**.",
                  fillBlanks: [{ answer: "controlled" }],
                  explanation:
                    "Controlled components make React state the single source of truth for the input's value.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a controlled form submission.",
                  sequenceItems: [
                    { id: "type", text: "User types into a field" },
                    { id: "sync", text: "onChange updates state" },
                    { id: "click", text: "User clicks Submit" },
                    { id: "prevent", text: "onSubmit prevents reload" },
                    { id: "process", text: "State is read and processed" },
                  ],
                  sequenceCorrectOrder: ["type", "sync", "click", "prevent", "process"],
                  explanation:
                    "Type → onChange syncs state → submit → preventDefault → process the state.",
                },
              ],
            },
            {
              title: "Custom Hooks",
              description: "Extracting reusable logic.",
              slug: "custom-hooks",
              estimatedMinutes: 7,
              learningObjectives: [
                "Extract logic into custom hooks",
                "Follow the use-prefix rule",
                "Compose hooks together",
              ],
              skills: [
                { name: "react-hooks", description: "Extract reusable React logic into hooks" },
              ],
              activities: [
                {
                  title: "Logic with a Name",
                  body: "A **custom hook** is a function, named `use…`, that calls other hooks and returns the state/helpers it needs. It lets components share logic without duplicating it: authentication, data fetching, debouncing, local storage. Rule: hooks can only be called at the top level of a component (or another hook), and refs/state inside them stay per-component.",
                },
                {
                  title: "Example",
                  body: "`function useWindowSize() { const [size, setSize] = useState([0,0]); useEffect(() => { const on = () => setSize([innerWidth, innerHeight]); addEventListener('resize', on); return () => removeEventListener('resize', on); }, []); return size; }`",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What identifies a custom hook?",
                  options: [
                    "A function whose name starts with use",
                    "A component with no JSX",
                    "A class extending Component",
                    "A function returning true",
                  ],
                  correctAnswer: "A function whose name starts with use",
                  explanation:
                    "The use-prefix tells React (and linters) a function follows the Rules of Hooks.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Custom hooks let components share stateful logic without duplicating it.",
                  correctAnswer: "true",
                  explanation:
                    "Hooks package top-level hook calls so many components get the same behavior in one place.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order how a use-* hook powers a component.",
                  sequenceItems: [
                    { id: "call", text: "Component calls the hook" },
                    { id: "state", text: "Hook holds internal state" },
                    { id: "effect", text: "Hook sets up effects" },
                    { id: "return", text: "Hook returns value/helpers" },
                    { id: "render", text: "Component renders with them" },
                  ],
                  sequenceCorrectOrder: ["call", "state", "effect", "return", "render"],
                  explanation:
                    "Call → internal state → effects → return values → render. The hook is a reusable slice of component logic.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each hook to its purpose.",
                  matchPairs: [
                    { left: "useState", right: "Local mutable data" },
                    { left: "useEffect", right: "Outside synchronization" },
                    { left: "useRef", right: "Mutable value that does not re-render" },
                    { left: "custom use*", right: "Reusable application logic" },
                  ],
                  explanation:
                    "State holds data, effects sync outside, refs escape re-renders, and custom hooks package behavior.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Hooks must be called at the ___ level of a component, not inside loops or conditions.",
                  fillBlanks: [{ answer: "top" }],
                  explanation:
                    "The Rules of Hooks: hook calls must be unconditional and top-level so order stays stable.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};