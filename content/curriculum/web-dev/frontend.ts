import type { SeedPath } from "@/lib/curriculum/seed";

export const htmlCssJsPath: SeedPath = {
  title: "HTML, CSS & JavaScript",
  description:
    "The three pillars of the web: semantic HTML, modern CSS layout, and JavaScript that powers interactivity.",
  slug: "html-css-js",
  modules: [
    {
      title: "HTML",
      description: "Markup, forms, and semantics.",
      slug: "html",
      icon: "Code2",
      units: [
        {
          title: "Markup Basics",
          description: "Elements, attributes, and semantics.",
          slug: "markup-basics",
          lessons: [
            {
              title: "HTML Elements",
              description: "The building blocks of a page.",
              slug: "html-elements",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the structure of an HTML document",
                "Use headings, paragraphs, and semantic tags",
                "Describe void elements and attributes",
              ],
              skills: [
                { name: "html-elements", description: "Write structured HTML documents" },
              ],
              activities: [
                {
                  title: "Markup with Meaning",
                  body: "HTML is **markup**, not styling. A document shells up as `<!DOCTYPE html>`, `<html>`, `<head>` (metadata) and `<body>` (content). Semantic tags — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` — describe *what* content is, which helps accessibility and SEO. Some elements are **void** (no closing tag): `<img>`, `<br>`, `<input>`. Attributes like `id`, `class`, `href`, and `lang` carry the data browsers and CSS need.",
                },
                {
                  title: "Example",
                  body: "A blog post: `<article><h1>Title</h1><p>...</p></article>`. The h1 is the heading, p a paragraph, article the self-contained unit.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which tag creates the document's visible content container?",
                  options: ["body", "head", "meta", "script"],
                  correctAnswer: "body",
                  explanation:
                    "The body holds everything visible; head holds metadata like title and stylesheets.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Semantic tags like <article> and <nav> describe meaning rather than appearance.",
                  correctAnswer: "true",
                  explanation:
                    "Semantic HTML describes what content is, improving accessibility and machine readability.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each tag to its typical use.",
                  matchPairs: [
                    { left: "h1", right: "Main page heading" },
                    { left: "nav", right: "Navigation links" },
                    { left: "article", right: "Self-contained content" },
                    { left: "footer", right: "Page bottom info" },
                  ],
                  explanation:
                    "h1 heads the page, nav holds links, article wraps standalone content, footer closes the page.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "An element like <img> that never has a closing tag is called a ___ element.",
                  fillBlanks: [{ answer: "void" }],
                  explanation:
                    "Void elements (img, br, input) have no children and no closing tag.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which of these are valid parts of an HTML document?",
                  multiSelectOptions: [
                    { text: "A single <h1> per main page region", isCorrect: true },
                    { text: "Nested tags that stay closed properly", isCorrect: true },
                    { text: "Attributes that always need a value", isCorrect: false },
                    { text: "A <main> wrapping the primary content", isCorrect: true },
                  ],
                  explanation:
                    "Clear hierarchy, proper nesting, and <main> are good; boolean attributes like <input disabled> need no value.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the outer structure of an HTML5 document.",
                  sequenceItems: [
                    { id: "doctype", text: "<!DOCTYPE html>" },
                    { id: "root", text: "<html> opens" },
                    { id: "head", text: "Metadata goes in <head>" },
                    { id: "body", text: "Content goes in <body>" },
                  ],
                  sequenceCorrectOrder: ["doctype", "root", "head", "body"],
                  explanation:
                    "DOCTYPE first, then html, then head (metadata) before body (content).",
                },
              ],
            },
            {
              title: "HTML Forms",
              description: "Collecting and validating user input.",
              slug: "html-forms",
              estimatedMinutes: 6,
              learningObjectives: [
                "Build forms with labels and inputs",
                "Use input types for better UX",
                "Explain form submission flow",
              ],
              skills: [
                { name: "html-forms", description: "Build accessible HTML forms" },
              ],
              activities: [
                {
                  title: "Inputs for People",
                  body: "A **form** wraps fields and a submit button. Each field gets a `<label>` linked by `for`/`id` — accessible and clickable. Input **types** (email, number, password, date) trigger the right mobile keyboard and basic browser validation. `required` marks mandatory fields; the **name** attribute is what actually gets sent when the form submits with `method` and `action`.",
                },
                {
                  title: "Example",
                  body: "`<form action=\"/register\" method=\"post\"><label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" required><button type=\"submit\">Join</button></form>`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which attribute carries the data key sent on form submission?",
                  options: ["name", "id", "class", "style"],
                  correctAnswer: "name",
                  explanation:
                    "The name attribute is the key; id is for labels/CSS and class for styling.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Linking a label to its input with for/id makes the label clickable and improves accessibility.",
                  correctAnswer: "true",
                  explanation:
                    "A tied label activates the field, enlarges the click target, and is read by screen readers.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order what happens when a user submits a classic HTML form.",
                  sequenceItems: [
                    { id: "fill", text: "User fills fields and clicks submit" },
                    { id: "validate", text: "Browser checks types and required" },
                    { id: "serialize", text: "Name/value pairs are encoded" },
                    { id: "request", text: "Browser sends the request per method/action" },
                    { id: "render", text: "Server response is rendered" },
                  ],
                  sequenceCorrectOrder: ["fill", "validate", "serialize", "request", "render"],
                  explanation:
                    "Fill → browser validation → encode pairs → send request → render response.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The type=\"email\" input tells the browser to validate the value as an ___ address.",
                  fillBlanks: [{ answer: "email" }],
                  explanation:
                    "The email input type triggers format validation and the right keyboard.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are best practices for HTML forms?",
                  multiSelectOptions: [
                    { text: "Label every field", isCorrect: true },
                    { text: "Mark required fields with the required attribute", isCorrect: true },
                    { text: "Use generic <div>s instead of labels", isCorrect: false },
                    { text: "Choose input types matching the data", isCorrect: true },
                  ],
                  explanation:
                    "Labels, required flags, and correct input types make forms usable and accessible.",
                },
              ],
            },
          ],
        },
        {
          title: "Media & Semantics",
          description: "Images, links, and page structure.",
          slug: "media-semantics",
          lessons: [
            {
              title: "Links & Images",
              description: "The web's connective tissue.",
              slug: "links-images",
              estimatedMinutes: 5,
              learningObjectives: [
                "Create links with absolute and relative URLs",
                "Embed images with alt text",
                "Explain when to lazy-load",
              ],
              skills: [
                { name: "links-images", description: "Link and embed media correctly" },
              ],
              activities: [
                {
                  title: "Anchor Everything",
                  body: "Links (`<a href>`) and images (`<img src>`) are how the web is stitched together. `href` can be absolute (`https://example.com/a`) or relative (`../guide.html`); `target=\"_blank\"` opens new tabs. Every `<img>` needs descriptive **alt text** for screen readers and broken-image fallbacks. Loading=\"lazy\" defers offscreen images; few hundred images above the fold is a smell.",
                },
                {
                  title: "Example",
                  body: "`<a href=\"/docs/install\" aria-label=\"Installation guide\">Install</a>` and `<img src=\"/diagram.webp\" alt=\"Flow diagram of the deploy process\" loading=\"lazy\">`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does the alt attribute on an <img> provide?",
                  options: [
                    "A text fallback for accessibility and broken images",
                    "The image's CSS class",
                    "The image dimensions",
                    "The image file size",
                  ],
                  correctAnswer: "A text fallback for accessibility and broken images",
                  explanation:
                    "Alt text describes the image for screen readers and appears when the image fails to load.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A relative URL like ../guide.html resolves against the current page's location.",
                  correctAnswer: "true",
                  explanation:
                    "Relative URLs are resolved against the current URL; absolute URLs carry the full scheme and host.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The ___ attribute defers offscreen image loading until the user approaches them.",
                  fillBlanks: [{ answer: "loading" }],
                  explanation:
                    "loading=\"lazy\" defers offscreen media; loading=\"eager\" (default) loads right away.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each URL form to its kind.",
                  matchPairs: [
                    { left: "https://example.com/help", right: "Absolute URL" },
                    { left: "/help", right: "Root-relative URL" },
                    { left: "../help", right: "Parent-relative URL" },
                    { left: "#section", right: "In-page anchor" },
                  ],
                  explanation:
                    "Absolute includes scheme+host; / starts at the root; ../ steps up one folder; # targets an id.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "CSS",
      description: "Selectors, layout, and the box model.",
      slug: "css",
      icon: "Palette",
      units: [
        {
          title: "Styling Fundamentals",
          description: "Selectors, box model, flexbox.",
          slug: "styling-fundamentals",
          lessons: [
            {
              title: "Selectors & Box Model",
              description: "How CSS targets and shapes elements.",
              slug: "selectors-box-model",
              estimatedMinutes: 7,
              learningObjectives: [
                "Use type, class, and id selectors",
                "Explain the box model",
                "Resolve specificity and inheritance",
              ],
              skills: [
                { name: "css-selectors", description: "Style elements with precise selectors" },
              ],
              activities: [
                {
                  title: "Boxes Inside Boxes",
                  body: "Every element is a **box**: content, then `padding`, `border`, `margin` around it. **Selectors** pick elements: `p` (type), `.card` (class), `#header` (id). **Specificity** decides which rule wins when they conflict — id > class > type. The `box-sizing: border-box` convention makes width include padding/border, which tames layout math.",
                },
                {
                  title: "Example",
                  body: "`.card { padding: 1rem; border: 1px solid #ddd; margin: 1rem; box-sizing: border-box; }` gives equal, predictable cards.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which selector has the highest specificity?",
                  options: ["#header", ".header", "header", "*"],
                  correctAnswer: "#header",
                  explanation:
                    "ID selectors beat class selectors, which beat type selectors: #id > .class > tag > *.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "With box-sizing: border-box, width includes padding and border.",
                  correctAnswer: "true",
                  explanation:
                    "border-box makes width include padding + border, making sizing predictable.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the box model from innermost out.",
                  sequenceItems: [
                    { id: "content", text: "The actual text or image" },
                    { id: "padding", text: "Space inside the border" },
                    { id: "border", text: "The visible edge" },
                    { id: "margin", text: "Space outside the border" },
                  ],
                  sequenceCorrectOrder: ["content", "padding", "border", "margin"],
                  explanation:
                    "Content → padding → border → margin. memorise as content, pad, border, margin.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The CSS rule that decides which conflicting declaration wins is called ___.",
                  fillBlanks: [{ answer: "specificity" }],
                  explanation:
                    "Specificity ranks selectors (id > class > type) to resolve cascade conflicts.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each selector to what it matches.",
                  matchPairs: [
                    { left: "button", right: "All buttons" },
                    { left: ".btn", right: "Elements with class btn" },
                    { left: "#submit", right: "The element with id submit" },
                    { left: "input[disabled]", right: "Disabled inputs" },
                  ],
                  explanation:
                    "Type, class, id, and attribute selectors each target a distinct set.",
                },
              ],
            },
            {
              title: "Flexbox",
              description: "One-dimensional layout.",
              slug: "flexbox",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the flex container/items model",
                "Control direction, alignment, and wrapping",
                "Use grow, shrink, and basis sensibly",
              ],
              skills: [
                { name: "flexbox", description: "Lay out elements along one axis" },
              ],
              activities: [
                {
                  title: "Layout with Flex",
                  body: "**Flexbox** lays out items along one axis. A container gets `display: flex`; its direct children become **flex items**. Key properties: `flex-direction` (row/column), `justify-content` (main-axis placement), `align-items` (cross-axis), `flex-wrap` (break to lines), and per-item `flex: grow shrink basis` for sizing. Perfect for nav bars, toolbars, and centering.",
                },
                {
                  title: "Example",
                  body: "A centered logo row: `nav { display: flex; align-items: center; justify-content: space-between; }` puts logo left and links right.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How many axes does flexbox lay items out along?",
                  options: ["One", "Two", "Three", "All axes"],
                  correctAnswer: "One",
                  explanation:
                    "Flexbox is one-dimensional — a row or a column. Two-dimensional grids need CSS Grid.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "justify-content aligns items along the main axis, align-items along the cross axis.",
                  correctAnswer: "true",
                  explanation:
                    "Main axis is the flex-direction; justify-content deals there, cross axis is align-items' job.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each flex property to its job.",
                  matchPairs: [
                    { left: "flex-direction", right: "Row or column" },
                    { left: "justify-content", right: "Main-axis spacing" },
                    { left: "align-items", right: "Cross-axis alignment" },
                    { left: "flex-wrap", right: "Allow items to wrap" },
                  ],
                  explanation:
                    "Direction sets the axis, justify spaces the main axis, align handles the cross axis, wrap lets lines break.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The flex ___ property allows items to shrink when space runs out.",
                  fillBlanks: [{ answer: "shrink" }],
                  explanation:
                    "flex-shrink permits shrinking; flex-grow permits growing; flex-basis sets the starting size.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which layouts are natural flexbox jobs?",
                  multiSelectOptions: [
                    { text: "A horizontal nav bar", isCorrect: true },
                    { text: "Centering a logo vertically", isCorrect: true },
                    { text: "A full page grid with rows and columns", isCorrect: false },
                    { text: "Evenly spacing buttons in a toolbar", isCorrect: true },
                  ],
                  explanation:
                    "Navs, centering, and toolbars are one-axis jobs for flex; complex page grids want CSS Grid.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "JavaScript",
      description: "Syntax, DOM, and async.",
      slug: "javascript",
      icon: "Braces",
      units: [
        {
          title: "Language Core",
          description: "Values, functions, and control flow.",
          slug: "language-core",
          lessons: [
            {
              title: "JS Basics",
              description: "Variables, types, and functions.",
              slug: "js-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Declare variables with let and const",
                "Work with primitives and objects",
                "Write and call functions",
              ],
              skills: [
                { name: "js-basics", description: "Write correct JavaScript fundamentals" },
              ],
              activities: [
                {
                  title: "Dynamic but Disciplined",
                  body: "JavaScript is dynamically typed but you still choose storage: `const` for never-reassigned values (default), `let` for changing ones, never bare `var`. Primitives (string, number, boolean, null, undefined, symbol) sit beside objects, arrays, and functions. Functions are values — stored, passed, and returned like any other. TypeScript adds the missing safety net on top.",
                },
                {
                  title: "Example",
                  body: "`const total = items.reduce((sum, i) => sum + i.price, 0);` — an arrow function passed into reduce, the classic map/filter/reduce flow.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which declaration should be the default for values you never reassign?",
                  options: ["const", "let", "var", "static"],
                  correctAnswer: "const",
                  explanation:
                    "const is the default: it signals immutability of binding and prevents accidental reassignment. let is for changing bindings.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "In JavaScript, functions can be assigned to variables and passed as arguments.",
                  correctAnswer: "true",
                  explanation:
                    "Functions are first-class values — they can live in variables, arrays, and arguments.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each primitive to an example value.",
                  matchPairs: [
                    { left: "string", right: "\"hello\"" },
                    { left: "number", right: "42" },
                    { left: "boolean", right: "false" },
                    { left: "null", right: "Explicitly empty" },
                  ],
                  explanation:
                    "Strings hold text, numbers hold values, booleans hold true/false, null is an explicit empty value.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "An arrow function's parameters go before the ___ symbol.",
                  fillBlanks: [{ answer: "=>" }],
                  explanation:
                    "Arrow functions use (args) => body — the arrow separates parameters from the body.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order how a JavaScript program becomes visible on a page.",
                  sequenceItems: [
                    { id: "script", text: "Script is loaded or parsed" },
                    { id: "run", text: "Top-level statements run" },
                    { id: "query", text: "Code queries the DOM" },
                    { id: "mutate", text: "DOM nodes are changed" },
                    { id: "paint", text: "Browser re-renders" },
                  ],
                  sequenceCorrectOrder: ["script", "run", "query", "mutate", "paint"],
                  explanation:
                    "Load → run → query DOM → mutate → repaint. scripts modify the page the browser then paints.",
                },
              ],
            },
            {
              title: "Async JavaScript",
              description: "Promises, async/await, and fetch.",
              slug: "async-js",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the event loop model",
                "Use promises and async/await",
                "Fetch data and handle errors",
              ],
              skills: [
                { name: "async-js", description: "Handle asynchronous work correctly" },
              ],
              activities: [
                {
                  title: "Don't Block the Thread",
                  body: "The browser runs JS on one thread. Long work must not block it, so heavy operations are **asynchronous**. A **Promise** represents a future result (pending → resolved/rejected). **async/await** reads like synchronous code while staying non-blocking. `fetch()` returns a promise for an HTTP response — check `res.ok`, parse the body, and **catch** errors. Never leave unhandled rejections.",
                },
                {
                  title: "Example",
                  body: "`const res = await fetch('/api/user'); if (!res.ok) throw new Error('fetch failed'); const user = await res.json();` inside an async function.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does fetch() return?",
                  options: [
                    "A promise of an HTTP response",
                    "The parsed JSON directly",
                    "A DOM node",
                    "A callback function",
                  ],
                  correctAnswer: "A promise of an HTTP response",
                  explanation:
                    "fetch returns a promise for a Response; you check res.ok, then call res.json().",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "await can only be used inside functions declared async.",
                  correctAnswer: "true",
                  explanation:
                    "await is valid inside async functions (and top-level module await) — not in plain functions.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the states a promise passes through.",
                  sequenceItems: [
                    { id: "pending", text: "Work is still running" },
                    { id: "fulfilled", text: "Work succeeded with a value" },
                    { id: "rejected", text: "Work failed with a reason" },
                    { id: "settled", text: "Either outcome reached" },
                  ],
                  sequenceCorrectOrder: ["pending", "fulfilled", "rejected", "settled"],
                  explanation:
                    "A promise is pending, then fulfills or rejects — finalized (settled) either way.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The code that runs when a promise fails belongs inside a ___ block.",
                  fillBlanks: [{ answer: "catch" }],
                  explanation:
                    "try/catch handles awaited failures; .catch() handles promise chains.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are correct async best practices?",
                  multiSelectOptions: [
                    { text: "Check res.ok before parsing", isCorrect: true },
                    { text: "Always handle promise rejection", isCorrect: true },
                    { text: "Use await inside a forEach for sequential HTTP calls", isCorrect: false },
                    { text: "Use Promise.all for independent requests", isCorrect: true },
                  ],
                  explanation:
                    "Check status, handle rejections, and parallelize independent calls; async forEach with await is a classic footgun.",
                },
              ],
            },
            {
              title: "DOM & Events",
              description: "Making pages interactive.",
              slug: "dom-events",
              estimatedMinutes: 6,
              learningObjectives: [
                "Query and modify the DOM",
                "Attach event listeners",
                "Explain bubbling and delegation",
              ],
              skills: [
                { name: "dom-events", description: "Build interactive browser behavior" },
              ],
              activities: [
                {
                  title: "Talk to the Page",
                  body: "The **DOM** is the browser's tree of page elements. `document.querySelector` finds nodes; `textContent`, `classList`, and `append` modify them. **Events** (click, input, submit) fire listeners you attach with `addEventListener`. Events **bubble** from the target up — so a single listener on a container can handle clicks on many children (**event delegation**).",
                },
                {
                  title: "Example",
                  body: "`document.querySelector('#submit')?.addEventListener('click', (e) => { e.preventDefault(); save(); })` — the optional chaining guards a missing node.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which method finds the first element matching a CSS selector?",
                  options: ["querySelector", "getElementsByName", "querySelectorAll", "findAll"],
                  correctAnswer: "querySelector",
                  explanation:
                    "document.querySelector returns the first match; querySelectorAll returns all matches as a NodeList.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Events bubble upward from the target element through its ancestors.",
                  correctAnswer: "true",
                  explanation:
                    "Bubbling lets ancestor listeners catch events from children — the basis of delegation.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each DOM API to what it does.",
                  matchPairs: [
                    { left: "textContent", right: "Set an element's text" },
                    { left: "classList.toggle", right: "Add/remove a class" },
                    { left: "addEventListener", right: "Hook an event" },
                    { left: "preventDefault", right: "Stop the default action" },
                  ],
                  explanation:
                    "textContent writes text, classList toggles classes, listeners hook events, preventDefault stops defaults.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Attaching one listener to a parent to handle many children's events is called event ___.",
                  fillBlanks: [{ answer: "delegation" }],
                  explanation:
                    "Delegation exploits bubbling to handle many elements with one listener.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order what happens when a user clicks a button.",
                  sequenceItems: [
                    { id: "dispatch", text: "Click event fires on the button" },
                    { id: "bubble", text: "Event bubbles to containers" },
                    { id: "handler", text: "A listener handler runs" },
                    { id: "prevent", text: "Default action may be prevented" },
                    { id: "effect", text: "DOM is updated and repaints" },
                  ],
                  sequenceCorrectOrder: ["dispatch", "bubble", "handler", "prevent", "effect"],
                  explanation:
                    "Dispatch → bubble → handler → optional preventDefault → side effect and repaint.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};