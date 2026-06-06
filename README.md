# Portfolio (Astro + Cloudflare)

This repository contains a personal portfolio site built with **Astro**, **TypeScript**, and **Cloudflare Workers**.

## Local setup

```bash
npm install
npm run dev
```

## Running tests

```bash
cd portfolio-astro
npx vitest run
```

## Deployment process

### Cloudflare deployment (Wrangler)

The API entrypoint is defined in `wrangler.toml` and deployed with Wrangler.

1. Ensure `wrangler.toml` exists at the repository root.
2. Set environment/auth as required by Wrangler.
3. Deploy:

```bash
npx wrangler deploy
```

## GitHub Actions overview

This repo uses two workflows:

- `.github/workflows/ci.yml`
  - Runs on PRs and pushes to non-main branches
  - Installs dependencies with `npm ci`
  - Runs lint (if configured), TypeScript type check, Vitest tests, and Astro build

- `.github/workflows/deploy.yml`
  - Runs on push to `main`
  - Builds Astro project
  - Deploys via `wrangler deploy`

## Required secrets

For Cloudflare deployment, GitHub Secrets must include:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Cloudflare deployment guide

The deployment workflow uses `cloudflare/wrangler-action@v3` and expects:
- a valid `wrangler.toml`
- `src/api/*` worker entrypoints (currently `src/api/contact.ts`)

Observability is enabled in `wrangler.toml` via the `[observability]` section.

