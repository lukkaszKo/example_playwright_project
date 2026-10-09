# example_playwright_project

Playwright + TypeScript starter.

## Setup

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
```

## Scripts

- `npm test` – run tests; `test:ui`, `test:headed` – interactive modes
- `npm run report` – open the HTML report
- `npm run check` / `npm run fix` – lint + format
- `npm run typecheck` – TypeScript check

## Structure

- `tests/` – specs
- `src/` – `fixtures.ts`, `pages/` (page objects)
- `BASE_URL` in `.env` sets the target site
