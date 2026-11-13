import type { SeedPath } from "@/lib/curriculum/seed";

export const ragMemoryPath: SeedPath = {
  title: "RAG & Memory",
  description:
    "Retrieval-augmented generation: chunking, embeddings, vector search, the indexing/retrieval/generation pipeline, reranking, and agent memory.",
  slug: "rag-memory",
  modules: [
    {
      title: "Retrieval",
      description: "Chunking, embeddings, vector search.",
      slug: "retrieval",
      icon: "Search",
      units: [
        {
          title: "Embeddings",
          description: "Turning text into vectors.",
          slug: "embeddings",
          lessons: [
            {
              title: "Embeddings 101",
              description: "Vectors that capture meaning.",
              slug: "embeddings-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain what an embedding is",
                "Describe cosine similarity",
                "Choose a useful embedding dimension",
              ],
              skills: [
                { name: "embeddings", description: "Embed text and compute similarity" },
              ],
              activities: [
                {
                  title: "Numbers That Mean Something",
                  body: "An **embedding** is a list of numbers (a vector) that captures a text's meaning. Similar texts get **similar vectors**, so you can rank items by closeness using **cosine similarity** (angle between vectors; 1 = same direction). Embedding models output fixed dimensions (e.g. 768 or 1536). Same-model consistency matters: vectors from two different embedding models are not comparable.",
                },
                {
                  title: "Example",
                  body: "Embedding 'kitten' and 'puppy' lands them close together; 'kitten' and 'database' land far apart.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does an embedding model produce?",
                  options: [
                    "A fixed-length vector of numbers",
                    "A translated sentence",
                    "A ranked leaderboard",
                    "A hash for caching",
                  ],
                  correctAnswer: "A fixed-length vector of numbers",
                  explanation:
                    "Embeddings encode meaning as fixed-dimension vectors used for similarity search.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Vectors from different embedding models can be directly compared for similarity.",
                  correctAnswer: "false",
                  explanation:
                    "Each model defines its own vector space; mixing models gives meaningless distances.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each embedding concept to its meaning.",
                  matchPairs: [
                    { left: "Embedding", right: "Meaningful numeric vector" },
                    { left: "Cosine similarity", right: "Angle-based closeness" },
                    { left: "Dimension", right: "Length of the vector" },
                    { left: "Vector space", right: "Coordinate system of meaning" },
                  ],
                  explanation:
                    "Embeddings live in a vector space; cosine similarity measures closeness; dimension is vector length.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which are true about embeddings?",
                  multiSelectOptions: [
                    { text: "Similar text produces similar vectors", isCorrect: true },
                    { text: "Dimension matches the token count", isCorrect: false },
                    { text: "Same model must be used for store and query", isCorrect: true },
                    { text: "They are trained to encode meaning", isCorrect: true },
                  ],
                  explanation:
                    "Meaning-closeness, model consistency, and training are core; dimension is a model property, not token count.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Cosine similarity of 1 means two vectors point in the same ___.",
                  fillBlanks: [{ answer: "direction" }],
                  explanation:
                    "Cosine similarity is the cosine of the angle between vectors — identical direction scores 1.",
                },
              ],
            },
            {
              title: "Chunking",
              description: "Splitting documents for retrieval.",
              slug: "chunking",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain why chunking matters",
                "Choose chunk size and overlap",
                "Avoid splitting meaning at boundaries",
              ],
              skills: [
                { name: "chunking", description: "Split documents into retrievable pieces" },
              ],
              activities: [
                {
                  title: "Right-Sized Pieces",
                  body: "You cannot embed a whole book usefully, so documents are split into **chunks**. Chunk **size** trades focus against context: small chunks retrieve precisely but lack surrounding context; large chunks are context-rich but bury the needle. **Overlap** between chunks keeps sentences from being cut mid-thought. Split on semantic boundaries (paragraphs, headers, code blocks) rather than fixed character counts where possible.",
                },
                {
                  title: "Example",
                  body: "For a troubleshooting guide, chunk per section header with 200-character overlap; for FAQ answers, chunk per question–answer pair with no overlap.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Why do RAG pipelines chunk documents?",
                  options: [
                    "Embeddings work best on focused pieces of text",
                    "To double the storage cost",
                    "Because APIs forbid long text",
                    "To remove all noun phrases",
                  ],
                  correctAnswer: "Embeddings work best on focused pieces of text",
                  explanation:
                    "Smaller, focused chunks embed and retrieve far better than one giant blob.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Chunking on semantic boundaries beats splitting by raw character count.",
                  correctAnswer: "true",
                  explanation:
                    "Fixed-size splits cut sentences and meaning mid-thought; semantic splits keep chunks coherent.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order a simple chunking pipeline.",
                  sequenceItems: [
                    { id: "parse", text: "Parse the document into headings/paragraphs" },
                    { id: "split", text: "Split into candidate chunks" },
                    { id: "overlap", text: "Add overlap across boundaries" },
                    { id: "filter", text: "Drop empty or boilerplate chunks" },
                    { id: "embed", text: "Embed each chunk for storage" },
                  ],
                  sequenceCorrectOrder: ["parse", "split", "overlap", "filter", "embed"],
                  explanation:
                    "Parse → split → overlap → filter → embed. Filtering junk chunks is an easy retrieval win.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which chunking choices are sensible?",
                  multiSelectOptions: [
                    { text: "Splitting on section boundaries", isCorrect: true },
                    { text: "Adding overlap across boundaries", isCorrect: true },
                    { text: "Embedding entire books as one vector", isCorrect: false },
                    { text: "Filtering header/nav boilerplate", isCorrect: true },
                  ],
                  explanation:
                    "Semantic splits, overlap, and boilerplate filtering all improve retrieval; whole-book embeddings lose focus.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "Small chunks retrieve precisely but lose surrounding ___.",
                  fillBlanks: [{ answer: "context" }],
                  explanation:
                    "The size tradeoff: precise small chunks forfeit the broader context larger chunks preserve.",
                },
              ],
            },
          ],
        },
        {
          title: "Vector Search",
          description: "Finding the nearest neighbors.",
          slug: "vector-search",
          lessons: [
            {
              title: "Vector Databases",
              description: "Storing and querying embeddings.",
              slug: "vector-databases",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain how vector search works",
                "Describe approximate nearest neighbor",
                "Compare dedicated stores vs in-DB vectors",
              ],
              skills: [
                { name: "vector-search", description: "Query embeddings with nearest-neighbor search" },
              ],
              activities: [
                {
                  title: "Find the Closest",
                  body: "A **vector database** stores embeddings and answers 'which stored vectors are closest to this query vector?'. Exact search is brute force; production systems use **approximate nearest neighbor (ANN)** indexes (HNSW, IVFFlat) that trade a tiny accuracy loss for huge speed on millions of vectors. Many databases now ship native vector types — pick the one matching your operational stack and scale.",
                },
                {
                  title: "Example",
                  body: "You embed a user's question, run a top-k search over 2M product-description vectors, and return 10 candidates for the re-ranker.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What queries does a vector database answer?",
                  options: [
                    "Which stored vectors are closest to this vector",
                    "Which table has the most rows",
                    "The topological order of a graph",
                    "The current time",
                  ],
                  correctAnswer: "Which stored vectors are closest to this vector",
                  explanation:
                    "Vector search returns the nearest neighbors of a query embedding.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "ANN indexes return exact nearest neighbors with 100% certainty.",
                  correctAnswer: "false",
                  explanation:
                    "Approximate indexes trade small accuracy loss for large speed gains — usually worth it at scale.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each concept to its role in vector search.",
                  matchPairs: [
                    { left: "HNSW", right: "Approximate index" },
                    { left: "Top-k", right: "How many results to return" },
                    { left: "Query embedding", right: "User question as a vector" },
                    { left: "Index", right: "Speeds up nearest-neighbor lookup" },
                  ],
                  explanation:
                    "HNSW is an ANN index, top-k bounds results, the query embedding is the probe, and the index accelerates lookups.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "When is a dedicated vector database worth it?",
                  multiSelectOptions: [
                    { text: "Millions of vectors and low-latency queries", isCorrect: true },
                    { text: "Growing vector + metadata filtering needs", isCorrect: true },
                    { text: "You already manage three databases", isCorrect: false },
                    { text: "Tens of documents you could scan in memory", isCorrect: false },
                  ],
                  explanation:
                    "Dedicated stores pay off at scale and with rich filters; for tiny corpora a smaller stack wins.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "The family of algorithms that finds near-neighbors quickly, sacrificing exactness, is called ___ nearest neighbor.",
                  fillBlanks: [{ answer: "approximate" }],
                  explanation:
                    "Approximate nearest neighbor (ANN) makes million-scale vector search fast.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "The RAG Pipeline",
      description: "Index, retrieve, generate.",
      slug: "pipeline",
      icon: "Workflow",
      units: [
        {
          title: "Core Pipeline",
          description: "Retrieval-augmented generation end to end.",
          slug: "core-pipeline",
          lessons: [
            {
              title: "RAG in Action",
              description: "Grounding answers with retrieved documents.",
              slug: "rag-basics",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain the index/retrieve/generate flow",
                "Describe retrieval-augmented prompts",
                "Recognize when RAG is the right tool",
              ],
              skills: [
                { name: "rag", description: "Ground model output with retrieved context" },
              ],
              activities: [
                {
                  title: "Search First, Answer Second",
                  body: "**Retrieval-augmented generation (RAG)** answers questions from your documents instead of the model's memory. Side A (**index**): chunk and embed everything ahead of time. Side B (**retrieve**): embed the user question and fetch the top-k closest chunks. Side C (**generate**): hand the model those chunks with the question and strict instructions to answer only from them. RAG is cheap to update (re-index a document), auditable, and slashes hallucination.",
                },
                {
                  title: "Example",
                  body: "'What is our refund policy?' → retrieve the refund page chunk → 'Answer using only the context. If the answer is absent, say you do not know.' → grounded answer.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the three-stage shape of RAG?",
                  options: [
                    "Index, retrieve, generate",
                    "Train, test, deploy",
                    "Build, ship, run",
                    "Cache, parse, render",
                  ],
                  correctAnswer: "Index, retrieve, generate",
                  explanation:
                    "Index the corpus, retrieve relevant chunks, then generate grounded answers.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "RAG lets you update an answer by re-indexing a document rather than retraining the model.",
                  correctAnswer: "true",
                  explanation:
                    "New or fixed content is just re-chunked and embedded — no model retraining.",
                },
                {
                  type: "sequence",
                  difficulty: "beginner",
                  question: "Order the steps of a RAG query.",
                  sequenceItems: [
                    { id: "ask", text: "User submits a question" },
                    { id: "embedq", text: "Question is embedded" },
                    { id: "search", text: "Vector search returns top-k chunks" },
                    { id: "prompt", text: "Chunks and question are assembled" },
                    { id: "answer", text: "Model answers from the context" },
                  ],
                  sequenceCorrectOrder: ["ask", "embedq", "search", "prompt", "answer"],
                  explanation:
                    "Question → embed → search → prompt assembly → grounded generation.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each RAG stage to what happens there.",
                  matchPairs: [
                    { left: "Index", right: "Chunk and embed the corpus" },
                    { left: "Retrieve", right: "Fetch the closest chunks" },
                    { left: "Generate", right: "Answer from provided context" },
                    { left: "Re-index", right: "Refresh content without retraining" },
                  ],
                  explanation:
                    "Index builds the store, retrieve queries it, generate uses it, and re-index updates it cheaply.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which problems does RAG directly address?",
                  multiSelectOptions: [
                    { text: "Stale knowledge with a known cutoff", isCorrect: true },
                    { text: "Hallucinating private-corporate facts", isCorrect: true },
                    { text: "Tuning model weights for a domain", isCorrect: false },
                    { text: "Answering from documents you cannot open", isCorrect: false },
                  ],
                  explanation:
                    "RAG fixes freshness and private-data grounding; it does not change weights, and it needs accessible documents.",
                },
              ],
            },
            {
              title: "Prompting for RAG",
              description: "Teaching the model to use context only.",
              slug: "rag-prompting",
              estimatedMinutes: 6,
              learningObjectives: [
                "Write grounding instructions",
                "Handle missing answers safely",
                "Add citations to answers",
              ],
              skills: [
                { name: "rag-prompting", description: "Ground prompts with retrieved context" },
              ],
              activities: [
                {
                  title: "Use the Context",
                  body: "The generation prompt must be explicit: 'Answer using only the context below. If the context lacks the answer, say the answer is not in the provided material.' Require **citations** (chunk IDs or source names) so answers are auditable. Retrieving 3–5 good chunks beats 30 mediocre ones — feed the model focus, not noise.",
                },
                {
                  title: "Example",
                  body: "Context block tagged with source IDs; the model answers and appends '[Source: refund-policy §2]', making every claim traceable.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What should a RAG generation prompt instruct when context lacks the answer?",
                  options: [
                    "Say the answer is not in the provided material",
                    "Guess from general knowledge",
                    "Reword the question and retry forever",
                    "Return an empty string",
                  ],
                  correctAnswer: "Say the answer is not in the provided material",
                  explanation:
                    "Explicit 'nothing here' fallbacks stop the model from inventing an answer.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Adding citations makes RAG answers auditable and easier to trust.",
                  correctAnswer: "true",
                  explanation:
                    "Cited answers let users verify claims against the source chunks.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The instruction 'answer only from the context' is called a ___ instruction — the model must not leave the provided material.",
                  fillBlanks: [{ answer: "grounding" }],
                  explanation:
                    "Grounding instructions pin the model's answers to the retrieved context.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which retrieval-prompt practices help quality?",
                  multiSelectOptions: [
                    { text: "Feed 3–5 focused chunks, not 30 noisy ones", isCorrect: true },
                    { text: "Label chunks with source IDs", isCorrect: true },
                    { text: "Hide the context from the model", isCorrect: false },
                    { text: "Demand the model contradict the context", isCorrect: false },
                  ],
                  explanation:
                    "Focused, tagged context plus grounding instructions produces better, auditable answers.",
                },
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question:
                    "Why does retrieving too many low-quality chunks hurt RAG answers?",
                  options: [
                    "The model gets distracted by irrelevant context",
                    "More chunks always improve accuracy",
                    "The vector database runs out of memory",
                    "Citations become impossible to generate",
                  ],
                  correctAnswer:
                    "The model gets distracted by irrelevant context",
                  explanation:
                    "Too many irrelevant chunks dilute the signal, leading the model to fabricate or misquote — fewer focused chunks beat a flood of noise.",
                },
              ],
            },
          ],
        },
        {
          title: "Advanced Retrieval",
          description: "Reranking and hybrid search.",
          slug: "advanced",
          lessons: [
            {
              title: "Reranking",
              description: "A second pass over candidates.",
              slug: "reranking",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain why a re-ranker is worth it",
                "Describe cross-encoder scoring",
                "Combine coarse recall with fine ranking",
              ],
              skills: [
                { name: "reranking", description: "Boost precision with a second-stage ranker" },
              ],
              activities: [
                {
                  title: "Coarse Recall, Fine Ranking",
                  body: "First-stage vector search is fast but approximate. A **re-ranker** — often a *cross-encoder* that scores query–candidate pairs jointly — reorders the top 50 candidates to pick the best 3–5. Joint scoring sees the full match, not just the summary vectors, so it fixes the case where a semantically-related-but-wrong chunk outranks the exact answer.",
                },
                {
                  title: "Example",
                  body: "Embedding search returns 50 chunks in ~20ms; the cross-encoder re-scores only those 50, and the top 3 feed the prompt. Net effect: more relevant answers for a few extra milliseconds.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is the typical job of a re-ranker in a RAG pipeline?",
                  options: [
                    "Re-score a shortlist of candidates to pick the best",
                    "Re-embed the whole corpus every query",
                    "Replace the vector index entirely",
                    "Rewrite the user's question",
                  ],
                  correctAnswer: "Re-score a shortlist of candidates to pick the best",
                  explanation:
                    "The re-ranker works on a small candidate list, scoring pairs jointly for precision.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A cross-encoder scores the query and each candidate together, giving richer comparison than pure embedding distance.",
                  correctAnswer: "true",
                  explanation:
                    "Joint scoring (cross-encoding) captures interactions the separate embeddings miss.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the two-stage retrieval flow.",
                  sequenceItems: [
                    { id: "recall", text: "Vector search returns a broad candidate list" },
                    { id: "rerank", text: "Re-ranker re-scores the candidates" },
                    { id: "topk", text: "Top few passages are kept" },
                    { id: "prompt", text: "Selected passages feed the prompt" },
                    { id: "answer", text: "Model answers from chosen context" },
                  ],
                  sequenceCorrectOrder: ["recall", "rerank", "topk", "prompt", "answer"],
                  explanation:
                    "Broad recall → rerank → top-k → prompt → answer. Two stages separate speed from precision.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A model that scores a query and candidate text jointly is called a cross-___.",
                  fillBlanks: [{ answer: "encoder" }],
                  explanation:
                    "Cross-encoders encode the query–candidate pair together for fine-grained scoring.",
                },
                {
                  type: "match",
                  difficulty: "advanced",
                  question: "Match each stage to its strength.",
                  matchPairs: [
                    { left: "Embedding search", right: "Fast recall over millions" },
                    { left: "Cross-encoder", right: "Precise pairwise scoring" },
                    { left: "BM25", right: "Lexical keyword matching" },
                    { left: "Reranker", right: "Refines a shortlist" },
                  ],
                  explanation:
                    "Embedding search recalls broadly, BM25 catches exact terms, and the reranker's cross-encoder refines precision.",
                },
              ],
            },
            {
              title: "Hybrid Search",
              description: "Keywords plus semantics.",
              slug: "hybrid-search",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain why keywords still matter",
                "Describe hybrid scoring fusion",
                "Tune semantic vs lexical weight",
              ],
              skills: [
                { name: "hybrid-search", description: "Fuse keyword and semantic retrieval" },
              ],
              activities: [
                {
                  title: "Exact Terms Still Matter",
                  body: "Embeddings miss exact terms (part numbers, error codes, `ACME-1234`). **Hybrid search** merges a **lexical** ranker (like BM25, exact-token) with **semantic** vector search, then fuses the two rankings. Fusion methods like **RRF (Reciprocal Rank Fusion)** blend positions without needing comparable scores. Tune the blend per domain: code-heavy corpora want more lexical weight; conversational queries want more semantic.",
                },
                {
                  title: "Example",
                  body: "Query 'error 403 cache miss' — BM25 nails '403', embeddings nail the concept; RRF merges both into one ranked list.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does hybrid search combine?",
                  options: [
                    "Lexical keyword matching and semantic vector search",
                    "Two different LLMs",
                    "SQL and NoSQL",
                    "REST and gRPC",
                  ],
                  correctAnswer: "Lexical keyword matching and semantic vector search",
                  explanation:
                    "Hybrid fuses exact-term (BM25-style) retrieval with semantic embeddings.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "Exact identifiers like error codes are a blind spot for pure embedding search.",
                  correctAnswer: "true",
                  explanation:
                    "Rare tokens and codes are poorly represented in semantic space — lexical search covers them.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each retrieval method to its strength.",
                  matchPairs: [
                    { left: "BM25", right: "Exact keyword matches" },
                    { left: "Embeddings", right: "Semantic meaning" },
                    { left: "RRF", right: "Blends two rankings" },
                    { left: "Hybrid", right: "Both worlds together" },
                  ],
                  explanation:
                    "BM25 is lexical, embeddings are semantic, RRF fuses rankings, and hybrid exploits both.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "RRF — ___ rank fusion — blends two ranked lists without shared scores.",
                  fillBlanks: [{ answer: "reciprocal" }],
                  explanation:
                    "Reciprocal Rank Fusion converts each list's positions into scores and sums them.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question:
                    "In which cases should hybrid search lean toward more lexical weight?",
                  multiSelectOptions: [
                    { text: "Queries full of part numbers and error codes", isCorrect: true },
                    { text: "Code corpora with exact identifiers", isCorrect: true },
                    { text: "Rare acronyms that embeddings under-represent", isCorrect: true },
                    { text: "Casual conversational questions about concepts", isCorrect: false },
                  ],
                  explanation:
                    "Exact tokens, identifiers, and rare acronyms are lexical strengths; conversational concept questions want more semantic weight.",
                },
              ],
            },
            {
              title: "Agent Memory",
              description: "Short-term and long-term context.",
              slug: "agent-memory",
              estimatedMinutes: 7,
              learningObjectives: [
                "Distinguish working from persistent memory",
                "Use summaries and stores correctly",
                "Keep memory adversarial—only what is needed",
              ],
              skills: [
                { name: "agent-memory", description: "Manage agent context across turns" },
              ],
              activities: [
                {
                  title: "Remember What Matters",
                  body: "Agents manage two memory kinds: **working memory** (the current conversation context) and **long-term memory** (facts, preferences, and history persisted across sessions — often stored and retrieved with embeddings). As context grows, **summarize** older turns to keep the window focused. Cap memory to the genuinely useful: every stored fact costs retrieval time and risks stale or private data.",
                },
                {
                  title: "Example",
                  body: "User preference 'always reply concisely' is stored as a small vector; a week later a new session retrieves it before the first answer.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What is working memory in an agent?",
                  options: [
                    "The current conversation context",
                    "A filesystem cache",
                    "The training corpus",
                    "The GPU RAM",
                  ],
                  correctAnswer: "The current conversation context",
                  explanation:
                    "Working memory is the live context the model sees each turn; long-term memory persists across sessions.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Summarizing older turns keeps long conversations inside the context window.",
                  correctAnswer: "true",
                  explanation:
                    "Condensing old turns into summaries preserves the thread while leaving room for new content.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each memory kind to its role.",
                  matchPairs: [
                    { left: "Working memory", right: "Live context for a turn" },
                    { left: "Long-term memory", right: "Persisted cross-session facts" },
                    { left: "Summary", right: "Compressed older turns" },
                    { left: "Embedded facts", right: "Retrievable stored knowledge" },
                  ],
                  explanation:
                    "Working memory live, long-term persisted, summaries compress, and embedded facts are retrievable.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which are risks of unbounded agent memory?",
                  multiSelectOptions: [
                    { text: "Stale or contradictory stored facts", isCorrect: true },
                    { text: "Private data leaking into retrieval", isCorrect: true },
                    { text: "Context bloat slowing responses", isCorrect: true },
                    { text: "Lower token prices automatically", isCorrect: false },
                  ],
                  explanation:
                    "Staleness, privacy, and context bloat are the real costs — curate and localize what is stored.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "Condensing older conversation turns into ___ keeps the context window focused on what matters.",
                  fillBlanks: [{ answer: "summaries" }],
                  explanation:
                    "Summarizing old turns compresses the thread so working memory stays focused.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};