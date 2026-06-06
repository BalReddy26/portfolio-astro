# DECISIONS

## Architecture Decisions

### Why Astro was chosen
Astro was selected because it is optimized for fast, content-forward sites where most of the work happens at build time. This portfolio is primarily a set of pages (Home, About, Projects, Blog listing, Contact, and 404) plus a small number of dynamic endpoints (RSS and the contact API). Astro’s component model (Astro + .astro pages) makes it straightforward to keep UI concerns separated from endpoint logic, while still allowing TypeScript-first development.

Astro also supports a “static output” workflow, which fits the performance goal for a personal portfolio: serving pre-rendered HTML/CSS with minimal server-side computation. That reduces hosting complexity and improves baseline performance and SEO, because the content is present in the initial HTML response.

### Why Cloudflare Workers were chosen
Cloudflare Workers were chosen for the contact API endpoint because the project requirement includes a server-side component with good security and operational controls. Workers provide:
- Simple request/response handling with `fetch`-like APIs.
- Fine-grained control over headers, status codes, and rate limiting.
- A deployment model that pairs cleanly with CI/CD pipelines (Wrangler + GitHub Actions).

In this repository, the contact form submits to an API route (`src/api/contact.ts`). The worker handler performs method checking, request parsing, validation, sanitization, rate limiting, and calls a service abstraction.

### Why TypeScript was chosen
TypeScript was chosen to reduce defects in two places that are particularly error-prone:
1) Input validation and sanitization logic.
2) API handler boundaries (ensuring request bodies and service outputs are handled consistently).

TypeScript’s structural typing lets the code express validation results (`valid: true` vs `valid: false` with typed `details`) and makes it easier to safely refactor and test the API logic. Additionally, tests in `tests/` target pure logic and handler behavior, and TypeScript provides strong guarantees that the test expectations align with the runtime types.

## Tradeoffs

### What was simplified
Several parts were intentionally kept simple to meet the project’s iterative goals:
- **Contact submission destination is mocked.** The `MockContactService` always returns success unless overridden in tests. This keeps the repository self-contained and avoids external dependencies (email providers, databases, queues) that would complicate local development and CI.
- **Blog is implemented as a listing with hardcoded post summaries.** The repository includes markdown content files, but the current blog detail rendering strategy is intentionally not fully wired end-to-end.
- **RSS generation is implemented directly in the endpoint.** The RSS feed uses a small internal set of posts. The XML generation is deterministic and test-covered, prioritizing correctness and simplicity.

### Why some features were not fully implemented
- **Production-ready durability for rate limiting** is not implemented. Rate limiting uses an in-memory limiter (`InMemoryRateLimiter`). This is sufficient for demonstrating behavior and passing unit tests, but it is not production-grade across multiple worker instances.
- **Form UX is “UX complete” but “delivery incomplete.”** The client side handles validation feedback and submission UX states, while the server side currently uses a mock service.

These choices were made to reduce time spent on integrations and maximize correctness of core logic (validation, sanitization, API response shape, RSS XML formatting, and tests).

## Features Cut

### Stretch goals intentionally omitted
The following stretch goals were intentionally deferred:
- Real email delivery (SMTP/SendGrid/Resend/etc.).
- Persistent storage for contact submissions (D1/KV/Queues) and admin views.
- A full dynamic blog system (route per post generated from content collections with structured metadata).
- Auto-generated Open Graph images (render-time image generation / OG image service integration).
- Production-grade observability dashboards and alerting rules.

### Reasoning
These were omitted because they require additional infrastructure, credentials, and more complex CI/CD configuration. They would increase failure modes unrelated to the core security and correctness requirements. The current implementation focuses on:
- Correctness and security of request handling.
- Deterministic RSS output.
- Testability of logic.
- Deployment automation scaffolding.

## AI Usage Transparency

This project used AI-assisted development in the following ways:
- **Planning assistance:** drafting folder structure and implementation phases, and helping translate requirements into code-level tasks.
- **Debugging assistance:** suggesting likely causes of validation/rate-limit logic issues and improving test strategy.
- **Documentation assistance:** generating drafts of README/TESTING content and clarifying what to document for submission.
- **Code review assistance:** proposing small refactors for readability and test isolation.

AI was not used to “invent” production secrets or hidden logic. Any AI-suggested behavior was validated via unit tests and manual smoke checks.

## Future Improvements (V2)

If extended to a v2, the following improvements are planned:
- **D1 integration** for durable submission storage and audit trails.
- **Real email delivery** for contact submissions with retry and failure reporting.
- **Dynamic blog system** that renders posts from the existing markdown sources using content collections, including proper per-post metadata.
- **Auto-generated OG images** to improve social sharing quality with consistent brand visuals.
- **Analytics improvements** (privacy-conscious), such as event logging to Workers and aggregated reporting.

## Production Concerns

### Security
- Ensure request body size limits (currently not explicitly implemented in the handler).
- Replace in-memory rate limiting with durable storage (KV/D1) for multi-instance correctness.
- Consider CSRF protections if the API is ever used in a broader authenticated context.

### Monitoring
- Use structured logs already present in the handler and integrate with Cloudflare observability dashboards.
- Add alerting on error rates (e.g., 4xx spikes for validation failures or 5xx for service errors).

### Scaling
- Move beyond in-memory state for rate limiting and any future persistence needs.
- Confirm that sanitization and validation remain consistent across deployments.

### Reliability
- Replace the mock service with a real implementation that includes retries, timeouts, and deterministic error handling.
- Ensure deterministic RSS output aligns with actual blog post sources.

## Lessons Learned
- Small security primitives (validation, sanitization, safe error messages, and rate limiting) are more valuable than large features when building production-oriented apps.
- Writing tests for pure logic (validation, rate limiting, RSS XML generation) dramatically improves confidence and reduces regressions.
- Keeping mock integrations during early phases helps avoid “infrastructure blockers” that prevent finishing core functionality.
- Documentation quality is part of engineering quality: a clear TESTING.md and DECISIONS.md reduces review friction and makes submission easier.

