# example_playwright_project

## 1. Structure project

```text
.
├── .github/workflows/playwright.yml   # CI (GitHub Actions)
├── .husky/pre-commit                  # pre-commit hook (typecheck + lint/format check)
├── .vscode/                           # VS Code settings and recommended extensions
├── src/
│   ├── fixtures/fixtures.ts           # custom Playwright fixtures
│   └── pages/{home,buttons}.page.ts   # page objects
├── tests/
│   └── buttons.spec.ts                # test specs
├── .env.example                       # example environment variables (BASE_URL)
├── .nvmrc                             # Node version
├── eslint.config.mjs                  # ESLint config
├── .prettierrc                        # Prettier config
├── playwright.config.ts               # Playwright config
├── tsconfig.json                      # TypeScript config
└── package.json
```

## 2. Command project

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm ci`                 | Install dependencies                    |
| `npx playwright install` | Install Playwright browsers             |
| `cp .env.example .env`   | Create local env file (Windows: `copy`) |
| `npm test`               | Run all tests                           |
| `npm run test:ui`        | Run tests in UI mode                    |
| `npm run test:headed`    | Run tests in headed mode                |
| `npm run report`         | Open the HTML report                    |
| `npm run typecheck`      | TypeScript check                        |
| `npm run lint`           | Run ESLint                              |
| `npm run lint:fix`       | Run ESLint with auto-fix                |
| `npm run format`         | Format code with Prettier               |
| `npm run format:check`   | Check formatting                        |
| `npm run check`          | Lint + format check                     |
| `npm run fix`            | Format + lint auto-fix                  |
