# TESTING

## Running tests

From repo root:

```bash
cd portfolio-astro
npm test
```

Vitest is configured to discover tests at:

- `tests/**/*.{test,spec}.{ts,js}`

## Test suite overview (Phase 6)

Created Vitest tests:

- `tests/validation.test.ts`
  - Contact input validation boundaries and error cases
- `tests/rateLimit.test.ts`
  - In-memory rate limiter behavior across windows and IP isolation
- `tests/contactApi.test.ts`
  - `src/api/contact.ts` handler: method handling, validation errors, rate-limit errors, and service failure
- `tests/contactService.test.ts`
  - `MockContactService` abstraction behavior
- `tests/rss.test.ts`
  - RSS XML generation and `src/pages/rss.xml.ts` output includes expected posts

## What is covered

- Pure functions / deterministic logic:
  - `src/lib/validation.ts`
  - `src/lib/rateLimit.ts`
  - `src/utils/rss.ts`
- HTTP handler logic (via `Request`/`Response`):
  - `src/api/contact.ts`
  - `src/pages/rss.xml.ts`

## What is not covered (yet)

- Browser/UI-level tests (Astro pages + form UX end-to-end)
- Accessibility auditing (axe/lighthouse) and responsive visual checks
- Real contact submission integration (currently mock service)

---

## Accessibility Review (Manual)

### Keyboard navigation review
- Verified that all interactive elements on the pages are reachable via the keyboard.
- Confirmed `:focus-visible` styling is present in `src/styles/global.css`.
- Header navigation links are standard anchors inside a `nav` element.
- Theme toggle is a real `<button>` and supports keyboard activation.

### Skip-link review
- The layout includes a skip link: `.skip-link` in `BaseLayout.astro`.
- The link moves into view on focus (`.skip-link:focus { top: 10px; }`) and targets `main#main`.
- Expected behavior: pressing Tab from the header should allow jumping directly to the main content.

### Focus state review
- Global focus styling is applied using:
  - `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`
- Form inputs/buttons visibly show focus (via browser defaults + border-color changes in contact page styles).

### Semantic HTML review
- Pages use semantic elements (`header`, `main`, `nav`, `footer`) through `BaseLayout` and component structure.
- Contact form uses:
  - `<form>` with labeled inputs (`<label for="...">` matching `id` values)
  - `aria-live="polite"` status region for submission feedback.
- 404 page wraps main content with a labeled region and uses heading hierarchy.

### Color contrast review
- The theme uses high-contrast palette variables from `src/styles/tokens.css`.
- Key surfaces:
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`
- Known limitation: contrast should be verified with a color-contrast tool and/or Lighthouse because this repository primarily uses design tokens rather than automated contrast checks.

---

## Responsive Review (Manual)

Breakpoints verified against CSS media queries used in the project.

### 320px (mobile)
- Header navigation collapses to mobile-friendly layout (nav hidden until `min-width: 768px`).
- Theme toggle text hides on small screens (in `ThemeToggle.astro` CSS: `@media (max-width: 767px)`).
- Layout uses `container` with `width: min(1100px, calc(100% - 2 * var(--space-3)))`.

### 768px (tablet)
- Header navigation appears at `min-width: 768px`.
- Home page grid changes from single column to two columns at `min-width: 768px`.
- Blog listing cards become two columns at `min-width: 768px`.

### 1024px (desktop+)
- Projects page cards switch to single-column at `min-width: 1024px`.
- Overall typography remains readable via token-based sizes.

Known limitation: full visual verification (spacing, tap targets, and contrast) was not automated.

---

## Lighthouse Preparation

### Expected score improvements
Given the site is primarily static HTML/CSS with semantic landmarks and lightweight TS logic, expected improvements:

- **Performance:** 90+ (static output, minimal client JS aside from theme toggle + contact submission script)
- **Accessibility:** 85+ (skip link, focus states, labeled form inputs, ARIA status region)
- **Best Practices:** 85+ (standard HTML structure, metadata via component)
- **SEO:** 90+ (server-rendered markup, centralized metadata)

### Known limitations
- Automated Lighthouse accessibility scoring depends on actual HTML rendering and runtime states (especially theme toggle + form submission).
- Blog detail pages and routing beyond the listing are not fully covered by the current test suite.

---

## CI/CD and deployment behavior (Manual)

- CI workflow is provided under `.github/workflows/ci.yml`.
- Deployment workflow is provided under `.github/workflows/deploy.yml`.

---

## Assignment compliance checklist

| Requirement | Status | Evidence |
|---|---|---|
| Required pages | Partial | `src/pages/index.astro`, `about.astro`, `projects.astro`, `blog/index.astro`, `contact.astro`, `404.astro` |
| Contact form | Partial | `src/pages/contact.astro` + client-side UX + `fetch('/api/contact')` |
| RSS | Partial | `src/pages/rss.xml.ts`, `src/utils/rss.ts` |
| SEO | Partial | `src/components/Seo.astro` used by `BaseLayout.astro` |
| Dark mode | Partial | `src/components/ThemeToggle.astro` + CSS theming tokens |
| Accessibility | Partial | skip link + focus styles + labeled form inputs; detailed review documented above |
| Testing | Complete | Vitest tests under `tests/` |
| CI/CD | Complete | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` |
| Deployment | Partial | `wrangler.toml` + deploy workflow (requires CF secrets to execute) |
| Documentation | Partial | README/TESTING/DECISIONS/PLAN exist; expanded in this phase |

