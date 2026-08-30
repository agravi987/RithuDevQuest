import type { SeedPath } from "@/lib/curriculum/seed";

export const nodeBackendPath: SeedPath = {
  title: "Node.js & Express",
  description:
    "Server-side JavaScript: modules, npm, the HTTP model, Express routing and middleware, and data handling with validation.",
  slug: "node-backend",
  modules: [
    {
      title: "Node Basics",
      description: "Modules, npm, the filesystem, and HTTP.",
      slug: "node-basics",
      icon: "Server",
      units: [
        {
          title: "Modules & Packages",
          description: "Organizing code with imports and npm.",
          slug: "modules-packages",
          lessons: [
            {
              title: "Node Modules",
              description: "import/export and the module system.",
              slug: "node-modules",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain CommonJS vs ESM",
                "Use import and export",
                "Read package.json fields",
              ],
              skills: [
                { name: "node-modules", description: "Structure Node code into modules" },
              ],
              activities: [
                {
                  title: "Divide and Import",
                  body: "Node's two module systems: **CommonJS** (`require`) and **ES modules** (`import`), now the default for modern projects. A module exports its public surface and imports what it needs. `package.json` is the project's manifest — `name`, `version`, `scripts`, `dependencies`, `type` (which flips the module system). `import` / `export` gives statically analyzable, tree-shakeable code.",
                },
                {
                  title: "Example",
                  body: "`// db.ts\nexport async function getUser(id: string) { ... }` then `import { getUser } from './db'` in a route file.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which keyword introduces the default module system in modern Node projects?",
                  options: ["import", "require", "define", "include"],
                  correctAnswer: "import",
                  explanation:
                    "ES modules (import/export) are the modern standard; require remains for CommonJS compatibility.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "The \"type\": \"module\" field in package.json enables ES module syntax for .js files.",
                  correctAnswer: "true",
                  explanation:
                    "Setting type: module makes Node treat .js as ES modules instead of CommonJS.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each package.json field to its purpose.",
                  matchPairs: [
                    { left: "scripts", right: "npm run commands" },
                    { left: "dependencies", right: "Runtime packages" },
                    { left: "devDependencies", right: "Build/test packages" },
                    { left: "type", right: "Module system flag" },
                  ],
                  explanation:
                    "Scripts define commands, dependencies are runtime, devDependencies are build-time, and type flags ESM vs CJS.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The command that installs all of a project's dependencies listed in package.json is npm ___.",
                  fillBlanks: [{ answer: "install" }],
                  explanation:
                    "npm install reads dependencies and installs them (and writes node_modules).",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the lifecycle of a simple npm-installed script run.",
                  sequenceItems: [
                    { id: "install", text: "npm install populates node_modules" },
                    { id: "resolve", text: "Import is resolved to a file" },
                    { id: "parse", text: "Module is parsed and executed" },
                    { id: "share", text: "Exports become available to importers" },
                    { id: "run", text: "The app code runs" },
                  ],
                  sequenceCorrectOrder: ["install", "resolve", "parse", "share", "run"],
                  explanation:
                    "Install → resolve the import → parse/execute the module → surface exports → run the app.",
                },
                {
                  type: "word_scramble",
                  difficulty: "beginner",
                  question: "Unscramble the folder where installed packages live:",
                  scrambledWord: "nodemodules",
                  explanation:
                    "node_modules — the directory npm writes installed packages into.",
                },
              ],
            },
          ],
        },
        {
          title: "HTTP on Node",
          description: "Serving requests without frameworks.",
          slug: "http-basics",
          lessons: [
            {
              title: "The HTTP Request/Response Cycle",
              description: "How servers and clients talk.",
              slug: "http-cycle",
              estimatedMinutes: 7,
              learningObjectives: [
                "Describe requests and responses",
                "Use the common methods and status codes",
                "Explain headers and bodies",
              ],
              skills: [
                { name: "http", description: "Reason about the request/response cycle" },
              ],
              activities: [
                {
                  title: "A Conversation, Not Magic",
                  body: "A server receives a **request** (method, path, headers, optional body) and returns a **response** (status code, headers, body). Methods carry intent: GET is read, POST is create, PUT/PATCH is update (whole vs partial), DELETE is remove. Status codes group by class: `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error. Headers like `Content-Type` and `Authorization` transport metadata.",
                },
                {
                  title: "Example",
                  body: "POST /api/users with Content-Type: application/json → 201 Created with the new user in the body; a missing field returns 400 Bad Request.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which method should create a new resource?",
                  options: ["POST", "GET", "DELETE", "HEAD"],
                  correctAnswer: "POST",
                  explanation:
                    "POST creates resources (or runs non-idempotent actions); GET reads, DELETE removes.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each status class to its meaning.",
                  matchPairs: [
                    { left: "2xx", right: "Success" },
                    { left: "3xx", right: "Redirect" },
                    { left: "4xx", right: "Client error" },
                    { left: "5xx", right: "Server error" },
                  ],
                  explanation:
                    "2xx success, 3xx redirects, 4xx the client is at fault, 5xx the server failed.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A GET request with side effects that delete data violates HTTP semantics.",
                  correctAnswer: "true",
                  explanation:
                    "GET should be safe/read-only; mutating actions belong to POST, PUT, PATCH, or DELETE.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the parts of a client/server exchange.",
                  sequenceItems: [
                    { id: "client", text: "Client builds a request" },
                    { id: "route", text: "Request hits the server's route" },
                    { id: "handle", text: "Handler computes a response" },
                    { id: "status", text: "Server sends status + body" },
                    { id: "parse", text: "Client parses the response" },
                  ],
                  sequenceCorrectOrder: ["client", "route", "handle", "status", "parse"],
                  explanation:
                    "Client request → route match → handler → response → client parses. Every HTTP interaction is this loop.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "HTTP status code class ___ covers redirects like 301 and 302.",
                  fillBlanks: [{ answer: "3xx" }],
                  explanation:
                    "3xx is the redirect class; 301 permanent, 302 temporary, 304 not modified.",
                },
              ],
            },
            {
              title: "Node HTTP Servers",
              description: "The raw http module.",
              slug: "node-http-servers",
              estimatedMinutes: 6,
              learningObjectives: [
                "Create a server with node:http",
                "Read request properties",
                "Write a response with a status and body",
              ],
              skills: [
                { name: "node-http", description: "Build raw HTTP servers" },
              ],
              activities: [
                {
                  title: "The Foundation",
                  body: "Node's `node:http` module gives a minimal server: `createServer((req, res) => { ... })`. `req.url` and `req.method` identify the route; `res.statusCode` and `res.end(body)` answer. Real apps put a framework (Express) on top, but the raw module teaches the contract: one function receives a request and must write a response.",
                },
                {
                  title: "Example",
                  body: "`const server = createServer((req, res) => { res.statusCode = 200; res.end('Hello'); }); server.listen(3000);` — visit localhost:3000.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which module provides the raw HTTP server API in Node?",
                  options: ["node:http", "node:fs", "node:path", "node:os"],
                  correctAnswer: "node:http",
                  explanation:
                    "node:http provides createServer; node:fs is filesystem and node:path is path helpers.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "createServer's callback must write the response before the request can complete.",
                  correctAnswer: "true",
                  explanation:
                    "The handler owns the response — call res.end() (possibly after async work) to finish it.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The property holding the request path in Node's handler is req.___.",
                  fillBlanks: [{ answer: "url" }],
                  explanation:
                    "req.url carries the request path and query string; req.method carries the HTTP verb.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order starting a minimal Node HTTP server.",
                  sequenceItems: [
                    { id: "import", text: "Import node:http" },
                    { id: "handler", text: "Define the request handler" },
                    { id: "create", text: "createServer(handler)" },
                    { id: "listen", text: "server.listen(port)" },
                    { id: "accept", text: "Incoming requests reach the handler" },
                  ],
                  sequenceCorrectOrder: ["import", "handler", "create", "listen", "accept"],
                  explanation:
                    "Import → handler → createServer → listen → accept. The server exists once it is listening.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Express",
      description: "Routing, middleware, and APIs.",
      slug: "express",
      icon: "Route",
      units: [
        {
          title: "Routing",
          description: "Mapping URLs to handlers.",
          slug: "routing",
          lessons: [
            {
              title: "Express Routing",
              description: "app.get, params, and queries.",
              slug: "express-routing",
              estimatedMinutes: 7,
              learningObjectives: [
                "Define routes for each method",
                "Read path parameters and query strings",
                "Send JSON responses",
              ],
              skills: [
                { name: "express-routing", description: "Build REST-style routes with Express" },
              ],
              activities: [
                {
                  title: "Path → Handler",
                  body: "Express maps `app.get('/users/:id', handler)` to matching requests. `:id` is a **path parameter** (`req.params.id`), while `?limit=10` is a **query** (`req.query.limit`). Handlers call `res.json(obj)` to send JSON and `res.status(404)` before finishing to set error codes. Validate params before using them.",
                },
                {
                  title: "Example",
                  body: "`app.get('/users/:id', (req, res) => { const user = users[req.params.id]; if (!user) return res.status(404).json({ error: 'not found' }); res.json(user); });`",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How does Express expose the :id in app.get('/users/:id', ...)?",
                  options: ["req.params.id", "req.query.id", "req.body.id", "req.url.id"],
                  correctAnswer: "req.params.id",
                  explanation:
                    "Path params land in req.params; query strings land in req.query; posted bodies in req.body.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "res.json(obj) sets Content-Type to application/json and sends the body.",
                  correctAnswer: "true",
                  explanation:
                    "res.json serializes and sets the JSON content type — the standard API response helper.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each route piece to where Express stores it.",
                  matchPairs: [
                    { left: "Path param", right: "req.params" },
                    { left: "Query string", right: "req.query" },
                    { left: "Posted body", right: "req.body" },
                    { left: "HTTP method", right: "req.method" },
                  ],
                  explanation:
                    "Params, query, body, and method each live at a distinct place on the request object.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The wildcard segment declared as /users/:id is called a path ___.",
                  fillBlanks: [{ answer: "parameter" }],
                  explanation:
                    "Colon-parameters capture a URL segment into req.params for dynamic routes.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are correct Express response patterns?",
                  multiSelectOptions: [
                    { text: "res.status(404).json({error}) for missing resources", isCorrect: true },
                    { text: "Returning 200 with wrong-shaped data to be friendly", isCorrect: false },
                    { text: "Setting the right status for success", isCorrect: true },
                    { text: "Validating params before lookup", isCorrect: true },
                  ],
                  explanation:
                    "Correct status codes, honest errors, and validated params are the baseline of a good API.",
                },
              ],
            },
            {
              title: "Middleware",
              description: "The pipeline between request and response.",
              slug: "middleware",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the Express middleware chain",
                "Write request-scoped middleware",
                "Handle errors and next(err)",
              ],
              skills: [
                { name: "middleware", description: "Compose Express request pipelines" },
              ],
              activities: [
                {
                  title: "A Pipeline, Not a Switch",
                  body: "Everything in Express is **middleware**: functions that run in order, receive `(req, res, next)`, do their job, then call `next()` to continue. `app.use(express.json())` parses bodies; auth middleware checks credentials; an error handler has **four arguments** `(err, req, res, next)` and runs when anything calls `next(err)`. Order matters — parse before you read, auth before you trust.",
                },
                {
                  title: "Example",
                  body: "`app.use(logRequests); app.use(express.json()); app.use(requireAuth);` runs logging, then body parsing, then auth — before any route handler.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What signals the end of one middleware's work in Express?",
                  options: ["next()", "end()", "return true", "done()"],
                  correctAnswer: "next()",
                  explanation:
                    "next() passes control to the following middleware or route handler.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Middleware order matters because each stage runs before the ones after it.",
                  correctAnswer: "true",
                  explanation:
                    "The chain is ordered: body parsing must precede handlers that read the body, auth before handlers that trust it.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the middleware flow for a guarded POST route.",
                  sequenceItems: [
                    { id: "parse", text: "express.json() parses the body" },
                    { id: "auth", text: "Auth middleware checks credentials" },
                    { id: "allow", text: "next() allows the request onward" },
                    { id: "handle", text: "Route handler runs" },
                    { id: "respond", text: "Handler sends the response" },
                  ],
                  sequenceCorrectOrder: ["parse", "auth", "allow", "handle", "respond"],
                  explanation:
                    "Parse → auth → next → handler → respond. Every middleware gates what comes next.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "An Express error handler is identified by having ___ arguments.",
                  fillBlanks: [{ answer: "four" }],
                  explanation:
                    "Error middleware takes (err, req, res, next) — the extra leading err argument marks it as an error handler.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each middleware concern to its typical position.",
                  matchPairs: [
                    { left: "Body parsing", right: "As early as possible" },
                    { left: "Auth/session", right: "Before trusted handlers" },
                    { left: "Logging", right: "First, to see all traffic" },
                    { left: "Error handler", right: "Last, catching everything" },
                  ],
                  explanation:
                    "Log first, parse early, auth before trust, and error handlers last to catch fallout.",
                },
              ],
            },
          ],
        },
        {
          title: "Data & Validation",
          description: "JSON, databases, and safety.",
          slug: "data-validation",
          lessons: [
            {
              title: "Validation",
              description: "Never trust the request body.",
              slug: "validation",
              estimatedMinutes: 6,
              learningObjectives: [
                "Validate bodies before use",
                "Return 400 on invalid input",
                "Sanitize what you store",
              ],
              skills: [
                { name: "api-validation", description: "Validate request data server-side" },
              ],
              activities: [
                {
                  title: "Trust Nothing",
                  body: "Every request body is untrusted input. Validate types, required fields, lengths, and allowed values **server-side** with a schema (Zod-less form: manual checks; or a library). Reject invalid input with `400 Bad Request` and a helpful message before it touches a query or template. This blocks malformed data, injection, and overflow bugs.",
                },
                {
                  title: "Example",
                  body: "Body with `{email: 'nope'}` fails a type check → `res.status(400).json({ errors: [{ field: 'email', message: 'must be a valid email' }] })`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Where must request validation always live?",
                  options: [
                    "Server-side, before any side effect",
                    "Only in the frontend",
                    "In the database trigger only",
                    "Nowhere, inputs never change",
                  ],
                  correctAnswer: "Server-side, before any side effect",
                  explanation:
                    "Client-side checks are convenience; security requires validated, server-side enforcement.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A missing required field should produce a 400 rather than a 500.",
                  correctAnswer: "true",
                  explanation:
                    "Invalid client input is a 4xx (client error); a 500 would imply your server broke.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each invalid input to the right response.",
                  matchPairs: [
                    { left: "Missing required field", right: "400 Bad Request" },
                    { left: "Wrong JSON shape", right: "400 Bad Request" },
                    { left: "Overlong text", right: "413 Payload Too Large" },
                    { left: "Unknown route", right: "404 Not Found" },
                  ],
                  explanation:
                    "Shape and completeness problems are 400s, oversized payloads are 413, unknown routes are 404.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Validating and cleaning data before it is stored is called ~~~.",
                  fillBlanks: [{ answer: "sanitizing" }],
                  explanation:
                    "Sanitization normalizes and strips dangerous/irrelevant input before storage.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which validation steps matter most for an API?",
                  multiSelectOptions: [
                    { text: "Type and shape checks on the body", isCorrect: true },
                    { text: "Length limits on text fields", isCorrect: true },
                    { text: "Always trusting the Accept header parsing", isCorrect: false },
                    { text: "Rejecting unknown extra fields when relevant", isCorrect: true },
                  ],
                  explanation:
                    "Shapes, types, lengths, and strict fields are core; no server should blindly trust client claims.",
                },
              ],
            },
            {
              title: "REST APIs",
              description: "Resources, verbs, and status codes.",
              slug: "rest-apis",
              estimatedMinutes: 7,
              learningObjectives: [
                "Model resources as URLs",
                "Use verbs consistently",
                "Return appropriate status codes",
              ],
              skills: [
                { name: "rest", description: "Design consistent REST APIs" },
              ],
              activities: [
                {
                  title: "Nouns, Verbs, and Codes",
                  body: "REST models **resources** as URLs (`/users`, `/users/:id`) and uses **verbs** for actions: GET reads, POST creates, PUT or PATCH updates, DELETE removes. Responses carry the right status: `200` OK, `201` Created, `204` No Content, `404` missing, `422` unprocessable. Nested resources read naturally: `/users/7/orders` for a user's orders.",
                },
                {
                  title: "Example",
                  body: "POST /api/users → 201 Created. GET /api/users/7 → 200 with the user or 404. PATCH /api/users/7 → 200. DELETE /api/users/7 → 204.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which status is right when POST creates a new resource?",
                  options: ["201 Created", "204 No Content", "404 Not Found", "500 Internal Error"],
                  correctAnswer: "201 Created",
                  explanation:
                    "Successful creation returns 201 (optionally 200 with the body); 204 is for successful no-body responses.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "PUT replaces a resource entirely while PATCH applies a partial update.",
                  correctAnswer: "true",
                  explanation:
                    "PUT is a full replacement; PATCH applies only the supplied changes.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a REST delete-flow with a valid and then a missing id.",
                  sequenceItems: [
                    { id: "delete", text: "DELETE /api/users/7 arrives" },
                    { id: "exists", text: "User 7 exists" },
                    { id: "remove", text: "Record is deleted" },
                    { id: "respond", text: "204 No Content responds" },
                    { id: "missing", text: "A later delete of 7 returns 404" },
                  ],
                  sequenceCorrectOrder: ["delete", "exists", "remove", "respond", "missing"],
                  explanation:
                    "Delete arrives → exists → removed → 204 → repeat is 404. Idempotence shows in the 404, not a crash.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A resource collection is typically modeled at a plural route like /___.",
                  fillBlanks: [{ answer: "users" }],
                  explanation:
                    "Plural noun routes (/users, /orders) point at collections; adding /:id targets one resource.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each verb to its semantic meaning.",
                  matchPairs: [
                    { left: "GET", right: "Read a resource" },
                    { left: "POST", right: "Create or act" },
                    { left: "PUT", right: "Replace fully" },
                    { left: "DELETE", right: "Remove a resource" },
                  ],
                  explanation:
                    "GET reads, POST creates, PUT replaces, DELETE removes — consistent verbs make APIs predictable.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};