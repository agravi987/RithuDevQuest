import type { SeedPath } from "@/lib/curriculum/seed";

export const nextJsPath: SeedPath = {
  title: "Next.js",
  description:
    "The App Router, layouts, server components, data fetching, and full-stack patterns — building production web apps with Next.js.",
  slug: "nextjs",
  modules: [
    {
      title: "App Router",
      description: "Routing, layouts, and navigation.",
      slug: "app-router",
      icon: "LayoutPanelLeft",
      units: [
        {
          title: "Routing Basics",
          description: "Files map to URLs.",
          slug: "routing-basics",
          lessons: [
            {
              title: "File-Based Routing",
              description: "Pages from files.",
              slug: "file-routing",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the App Router file conventions",
                "Create nested routes",
                "Use dynamic segments",
              ],
              skills: [
                { name: "next-routing", description: "Build Next.js routes with files" },
              ],
              activities: [
                {
                  title: "Folders Are Routes",
                  body: "In the **App Router**, folders define routes. `app/page.tsx` serves `/`; `app/about/page.tsx` serves `/about`; a **dynamic segment** `app/users/[id]/page.tsx` serves `/users/123` with `params.id`. Special files do the work: `page`, `layout`, `loading`, `error`, `not-found`. Colocating components inside a route folder keeps all files together.",
                },
                {
                  title: "Example",
                  body: "`app/blog/[slug]/page.tsx` renders `/blog/hello-world`; the component receives `{ params: { slug: 'hello-world' } }`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which file makes app/page.tsx the home page?",
                  options: ["page.tsx", "index.tsx", "home.tsx", "route.ts"],
                  correctAnswer: "page.tsx",
                  explanation:
                    "page.tsx is the App Router page file; index.tsx was the pages-router convention.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A dynamic segment is declared with square brackets, like [id].",
                  correctAnswer: "true",
                  explanation:
                    "Square-bracket folders match any value and surface it through params.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each special file to its purpose.",
                  matchPairs: [
                    { left: "page.tsx", right: "The route's content" },
                    { left: "layout.tsx", right: "Shared chrome for children" },
                    { left: "loading.tsx", right: "Fallback while streaming" },
                    { left: "error.tsx", right: "Boundary on failures" },
                  ],
                  explanation:
                    "page renders the route, layout shares chrome, loading streams fallback, and error catches failures.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The special file that lets you render a fallback while a route or segment loads is ___.",
                  fillBlanks: [{ answer: "loading.tsx" }],
                  explanation:
                    "loading.tsx (and Next's streaming) show fallback UI while the page data resolves.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order how a request to /blog/my-post resolves.",
                  sequenceItems: [
                    { id: "url", text: "Browser requests /blog/my-post" },
                    { id: "folder", text: "Router matches app/blog/[slug]/" },
                    { id: "layout", text: "Nearest layouts wrap the page" },
                    { id: "page", text: "page.tsx is invoked with params" },
                    { id: "html", text: "HTML is streamed to the client" },
                  ],
                  sequenceCorrectOrder: ["url", "folder", "layout", "page", "html"],
                  explanation:
                    "URL → folder match → layouts → page with params → streamed HTML.",
                },
              ],
            },
            {
              title: "Links & Navigation",
              description: "Client-side navigation.",
              slug: "navigation",
              estimatedMinutes: 5,
              learningObjectives: [
                "Navigate with the Link component",
                "Use prefetching and caching",
                "Handle active states",
              ],
              skills: [
                { name: "next-navigation", description: "Navigate between routes smoothly" },
              ],
              activities: [
                {
                  title: "SPA feel, MPA URL",
                  body: "Use **`<Link href>`** instead of raw `<a>` for internal routes: Next prefetches and navigates client-side without a full reload. Programmatic moves use `router.push` from `next/navigation`. Dynamic paths build href strings or objects: `href={{ pathname: '/blog/[slug]', params: { slug: p.slug } }}`.",
                },
                {
                  title: "Example",
                  body: "`<Link href=\"/dashboard\" className=\"nav-link\">Dashboard</Link>` prefetches on hover and navigates instantly.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why prefer <Link> over <a> for internal navigation?",
                  options: [
                    "It navigates client-side with prefetching",
                    "It always causes a full reload",
                    "It is required for integrity hashes",
                    "It uploads the page",
                  ],
                  correctAnswer: "It navigates client-side with prefetching",
                  explanation:
                    "Link intercepts clicks, prefetches the target, and swaps views without a browser reload.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Prefetching lets Next load the next page's data before the user clicks.",
                  correctAnswer: "true",
                  explanation:
                    "Links prefetch nearby routes (in viewport) so navigation feels instant.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "For programmatic navigation after an action, use ___ from next/navigation.",
                  fillBlanks: [{ answer: "router.push" }],
                  explanation:
                    "useRouter().push('/path') navigates from code — submit handlers, effects, and so on.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which navigation practices are correct?",
                  multiSelectOptions: [
                    { text: "Link for internal routes", isCorrect: true },
                    { text: "router.push after async success", isCorrect: true },
                    { text: "Raw <a> for external sites", isCorrect: true },
                    { text: "raw <a href=\"#\"> with JS hijack for internal routes", isCorrect: false },
                  ],
                  explanation:
                    "Link internally, router.push programmatically, raw anchors externally — never hijack raw anchors for SPAs.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each navigation approach to its use.",
                  matchPairs: [
                    { left: "<Link href>", right: "Prefetches and navigates without a reload" },
                    { left: "router.push", right: "Navigates programmatically from code" },
                    { left: "href object with pathname and params", right: "Builds a dynamic route's URL" },
                    { left: "Raw <a>", right: "External links only" },
                  ],
                  explanation:
                    "Link handles internal client-side navigation, router.push works from code, href objects build dynamic paths, and raw anchors stay for external destinations.",
                },
              ],
            },
          ],
        },
        {
          title: "Server & Client Components",
          description: "Choosing where your code runs.",
          slug: "server-client-components",
          lessons: [
            {
              title: "RSC Bundaries",
              description: "Server components by default.",
              slug: "rsc",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain Server vs Client Components",
                "Move state to 'use client' leaves",
                "Reason about the data/data-over-wire split",
              ],
              skills: [
                { name: "rsc", description: "Decide server vs client components" },
              ],
              activities: [
                {
                  title: "Run Near the Data",
                  body: "**Server Components** run on the server: they can query databases and secrets directly, and their output ships as a serialized tree. **Client Components** ('use client') render with interactivity and state. The rule: server-first, and only add 'use client' at interactive leaves — buttons, forms, stateful widgets. A client component can import server components' output but not the other way around.",
                },
                {
                  title: "Example",
                  body: "A page fetches from the DB in a Server Component, then renders a <Counter /> (client) plus static content — no API needed for the data.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which directive opts a file into client rendering?",
                  options: ["use client", "use server", "client side", "dynamic"],
                  correctAnswer: "use client",
                  explanation:
                    "'use client' marks the component boundary where interactivity/state begin; the rest stays server-rendered.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Server Components can access databases and secrets without exposing them to the browser.",
                  correctAnswer: "true",
                  explanation:
                    "Server-rendered code runs server-side — the browser only receives the serialized output.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order how a Server Component's data reaches the browser.",
                  sequenceItems: [
                    { id: "fetch", text: "Server component queries the database" },
                    { id: "render", text: "Component renders on the server" },
                    { id: "serialize", text: "Rendered tree is serialized" },
                    { id: "send", text: "Serialized output ships over the wire" },
                    { id: "hydrate", text: "Interactive leaves hydrate" },
                  ],
                  sequenceCorrectOrder: ["fetch", "render", "serialize", "send", "hydrate"],
                  explanation:
                    "Fetch → render → serialize → send → hydrate. The server does the heavy lifting; small payloads go over the wire.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A component that renders on the server and contains no browsers state is a ___ Component.",
                  fillBlanks: [{ answer: "Server" }],
                  explanation:
                    "Server Components default in the App Router — no 'use client' needed for non-interactive UI.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which belong in Client Components?",
                  multiSelectOptions: [
                    { text: "useState and event handlers", isCorrect: true },
                    { text: "Browser-only APIs like localStorage", isCorrect: true },
                    { text: "Direct database queries", isCorrect: false },
                    { text: "Drag-and-drop styled interactions", isCorrect: true },
                  ],
                  explanation:
                    "State, events, and browser APIs need the client; data access belongs in Server Components or actions.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Data & Full-Stack",
      description: "Server actions, route handlers, auth.",
      slug: "fullstack",
      icon: "DatabaseZap",
      units: [
        {
          title: "Server Actions",
          description: "Mutations without APIs.",
          slug: "server-actions",
          lessons: [
            {
              title: "Server Actions",
              description: "Forms that talk to the server.",
              slug: "server-actions-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain Server Actions",
                "Mutate data with form actions",
                "Revalidate the router",
              ],
              skills: [
                { name: "server-actions", description: "Perform server mutations from the UI" },
              ],
              activities: [
                {
                  title: "Form → Function",
                  body: "A **Server Action** is an async function marked `'use server'` that runs on the server, callable from a form's `action` or a client component. It can mutate the database, then call **`revalidatePath`** or **`revalidateTag`** to refresh the visible data. Server Actions are the modern 'no API for everything' pattern: same-origin, CSRF-handled, and secure if you validate inputs.",
                },
                {
                  title: "Example",
                  body: "`async function save(formData) { 'use server'; await db.update(formData); revalidatePath('/profile'); }` used as `<form action={save}>`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Where does a Server Action run?",
                  options: [
                    "On the server, when invoked",
                    "In the browser tab",
                    "In a web worker only",
                    "On the CDN edge only",
                  ],
                  correctAnswer: "On the server, when invoked",
                  explanation:
                    "Server Actions execute server-side (as their name says), keeping secrets and data logic off the client.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "revalidatePath clears the cached router data for a route after a mutation.",
                  correctAnswer: "true",
                  explanation:
                    "Revalidation refreshes server-rendered data so the UI reflects the write.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a Server Action form submission.",
                  sequenceItems: [
                    { id: "submit", text: "User submits the form" },
                    { id: "call", text: "Action is invoked with formData" },
                    { id: "validate", text: "Action validates the input" },
                    { id: "mutate", text: "Database is updated" },
                    { id: "revalidate", text: "Route is revalidated" },
                  ],
                  sequenceCorrectOrder: ["submit", "call", "validate", "mutate", "revalidate"],
                  explanation:
                    "Submit → invoke action → validate → mutate → revalidate. Never mutate before validating.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The directive that marks an async function as a Server Action is ___-___.",
                  fillBlanks: [{ answer: "use server" }],
                  explanation:
                    "'use server' marks the function boundary to run exclusively on the server.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are best practices for Server Actions?",
                  multiSelectOptions: [
                    { text: "Validate all inputs with schemas", isCorrect: true },
                    { text: "Check authorization before mutating", isCorrect: true },
                    { text: "Run arbitrary client strings as code", isCorrect: false },
                    { text: "Revalidate after writes", isCorrect: true },
                  ],
                  explanation:
                    "Validate, authorize, and revalidate; never trust or re-execute client-provided code.",
                },
              ],
            },
            {
              title: "Route Handlers",
              description: "API routes with next/route.",
              slug: "route-handlers",
              estimatedMinutes: 6,
              learningObjectives: [
                "Create GET/POST route handlers",
                "Return JSON responses",
                "Choose route handlers vs Server Actions",
              ],
              skills: [
                { name: "route-handlers", description: "Build API endpoints in Next.js" },
              ],
              activities: [
                {
                  title: "Files That Answer Requests",
                  body: "A **route.ts** file turns a folder into an API endpoint: `export async function GET(req)` and friends handle methods. Return `Response.json(...)` with status codes. Use route handlers for **external-facing APIs** (webhooks, third parties) and Server Actions for **in-app form flows** — they overlap, but APIs you expose to the world belong in route handlers.",
                },
                {
                  title: "Example",
                  body: "`app/api/health/route.ts`: `export function GET() { return Response.json({ ok: true }); }` → GET /api/health.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which file creates an API route in the App Router?",
                  options: ["route.ts", "api.ts", "page.ts", "server.ts"],
                  correctAnswer: "route.ts",
                  explanation:
                    "route.ts exports method handlers; the folder path becomes the URL.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Route handlers are the right home for public webhooks consumed by other systems.",
                  correctAnswer: "true",
                  explanation:
                    "External consumers (webhooks, third parties) call route handlers; Server Actions are for first-party UI flows.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each approach to its best use.",
                  matchPairs: [
                    { left: "Server Action", right: "In-app form mutations" },
                    { left: "Route handler", right: "Public HTTP endpoint" },
                    { left: "revalidatePath", right: "Refresh after a write" },
                    { left: "Route segment config", right: "Per-route runtime/caching" },
                  ],
                  explanation:
                    "Actions carry in-app writes, handlers expose endpoints, revalidation refreshes pages, and segment config tunes per-route behavior.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A route handler returns JSON with the ___ class, e.g. Response.json().",
                  fillBlanks: [{ answer: "Response" }],
                  explanation:
                    "Route handlers return Web Response objects — Response.json() is the JSON convenience.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a POST route handler's flow.",
                  sequenceItems: [
                    { id: "body", text: "Handler reads the request body" },
                    { id: "schema", text: "Input is validated" },
                    { id: "work", text: "Action runs (query, write)" },
                    { id: "status", text: "Correct status is chosen" },
                    { id: "return", text: "Response.json is returned" },
                  ],
                  sequenceCorrectOrder: ["body", "schema", "work", "status", "return"],
                  explanation:
                    "Read body → validate → do work → choose status → return JSON.",
                },
              ],
            },
            {
              title: "Authentication",
              description: "Sessions, cookies, and protection.",
              slug: "authentication",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain session-based auth in App Router",
                "Protect routes and actions",
                "Avoid protecting secrets client-side",
              ],
              skills: [
                { name: "next-auth", description: "Add authentication to Next.js apps" },
              ],
              activities: [
                {
                  title: "Identity Everywhere",
                  body: "Auth in Next.js is **session/server-first**: store the session in an **httpOnly cookie** (invisible to JS), verify it server-side with `cookies()`, and gate pages and Server Actions with middleware or helpers. **Never** hard-code secrets in client components; the browser can only ever hold a signed/encrypted session token. Protecting individual fields, not just routes, keeps data safe even if a page is public.",
                },
                {
                  title: "Example",
                  body: "A `requireUser()` helper reads the session cookie, returns the user or redirects to /login; Server Actions call it before mutating.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why store auth sessions in httpOnly cookies?",
                  options: [
                    "JavaScript cannot read them, so XSS cannot steal them",
                    "Because CSS requires it",
                    "To speed up rendering",
                    "They auto-expire after every call",
                  ],
                  correctAnswer: "JavaScript cannot read them, so XSS cannot steal them",
                  explanation:
                    "httpOnly cookies are invisible to JS — the primary defense against session theft via XSS.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Authorization checks belong on the server, not just hidden in the UI.",
                  correctAnswer: "true",
                  explanation:
                    "Server-side checks are the real gate; hiding buttons is cosmetic UX, not security.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the auth flow for a protected page.",
                  sequenceItems: [
                    { id: "login", text: "User submits credentials" },
                    { id: "verify", text: "Server verifies them" },
                    { id: "cookie", text: "Session cookie is set" },
                    { id: "request", text: "Next request carries the cookie" },
                    { id: "gate", text: "Server verifies the session before rendering" },
                  ],
                  sequenceCorrectOrder: ["login", "verify", "cookie", "request", "gate"],
                  explanation:
                    "Login → verify → set session → next request → gate. Every protected render re-verifies server-side.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A cookie marked as ___ is invisible to client-side JavaScript.",
                  fillBlanks: [{ answer: "httpOnly" }],
                  explanation:
                    "httpOnly cookies are only sent over HTTP(S) — scripting cannot read or tamper with them.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which auth practices are correct?",
                  multiSelectOptions: [
                    { text: "Protect Server Actions with a session check", isCorrect: true },
                    { text: "Redirect unauthenticated users appropriately", isCorrect: true },
                    { text: "Store API secrets in client components", isCorrect: false },
                    { text: "Validate every mutation's permission server-side", isCorrect: true },
                  ],
                  explanation:
                    "Server-side session checks and action protection are the standard; secrets never ship to the browser.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};