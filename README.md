# SQL Coach 🗄️

An interactive SQL learning platform that teaches through guided questioning instead of giving you the answer. Write real SQL against a live database, get AI-powered feedback, and build genuine understanding — one query at a time.

Built for final-year students and early professionals preparing for placements and technical interviews.

---

## How it works

1. **Take a placement test** — MCQ + write-a-query. Get placed into Beginner or Mid tier automatically.
2. **Pick a topic** from your personalized curriculum (SELECT → JOINs → CTEs and beyond).
3. **Write SQL** against a real database in a live editor.
4. **Get guided feedback** — if your query is wrong, the AI highlights the incorrect part and asks you a guiding question. It never just gives you the answer.
5. **Use hints** if you're stuck — up to 3 per problem, no penalty.
6. **Understand why** — once you get it right (or use all hints), Explanation Mode walks you through exactly why the correct query works.

---

## Features

- **Real SQL execution** — queries run against an actual PostgreSQL database via a read-only sandbox
- **AI-guided feedback** — streamed responses from Claude that guide you toward the answer without giving it away
- **Split panel UI** — problem + schema diagram on the left, editor + AI guidance on the right
- **Schema diagrams** — Mermaid ERD of the dataset, always visible while you work
- **Query execution plan** — visual breakdown of how PostgreSQL processes your query
- **Result preview** — see what your query actually returned vs. what was expected
- **Hint system** — 3 structured hints per problem revealed progressively
- **Explanation mode** — deep explanation of the correct solution after solving or revealing the answer
- **Progress tracking** — topics completed, past attempts saved, session continuity

---

## Curriculum

| Tier | Topics |
|---|---|
| **Beginner** | SELECT, WHERE, ORDER BY, LIMIT, basic JOINs, GROUP BY, HAVING |
| **Mid** | Complex JOINs, Subqueries, CTEs |

Problems are generated dynamically by Claude per topic — you won't see the same question twice.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Next.js (App Router) |
| Backend | Next.js Route Handlers |
| Database + Auth | Supabase (PostgreSQL) |
| SQL Sandbox | Supabase read-only restricted role |
| AI | Anthropic Claude API (streamed) |
| Visualizations | Mermaid.js |
| Editor | CodeMirror |

---

## Project Status

Currently in active development. Building in phases:

- [x] Architecture + design decisions
- [ ] Phase 1 — Supabase setup, auth, DB schema
- [ ] Phase 2 — Curriculum engine + dashboard
- [ ] Phase 3 — Core loop (editor, query execution, AI guidance)
- [ ] Phase 4 — Visualizations (schema diagram, execution plan)
- [ ] Phase 5 — Placement test, explanation mode, polish

---

## Local Setup

> Coming once Phase 1 is complete.

---

## License

MIT
