# example_playwright_project

## 1. Structure project

```text
.
├── .github/workflows/playwright.yml   # CI (GitHub Actions)
├── .husky/pre-commit                  # pre-commit hook (typecheck + lint/format check)
├── .vscode/                           # VS Code settings and recommended extensions
├── src/
│   ├── api/
│   │   ├── client/
│   │   │   ├── auth.client.ts         # register / login, stores the access token
│   │   │   └── base.client.ts         # base class: authGet/Post/Put/Patch/Delete with Bearer token
│   │   ├── fixtures/fixtures.ts       # API fixtures (authClientUserOne, tasksServiceUserOne)
│   │   ├── models/                    # TypeScript types of API requests/responses
│   │   │   ├── auth.model.ts
│   │   │   └── tasks.model.ts
│   │   └── services/tasks.service.ts  # tasks endpoints (extends BaseClient)
│   ├── config/env.ts                  # typed env variables (fails fast when missing)
│   ├── fixtures/fixtures.ts           # custom Playwright fixtures (UI)
│   └── pages/{home,buttons}.page.ts   # page objects
├── tests/
│   ├── api/test.spec.ts               # API test specs
│   └── buttons.spec.ts                # UI test specs
├── .env.example                       # example environment variables (BASE_URL, user credentials)
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

## 3. API testing

API tests use Playwright's `request` context and are organised in layers:

| Layer    | Location            | Responsibility                                                                 |
| -------- | ------------------- | ------------------------------------------------------------------------------ |
| Config   | `src/config/env.ts` | Reads env variables and throws if any is missing                               |
| Models   | `src/api/models/`   | Types for request/response bodies (e.g. `LoginResponse`, `TasksListResponse`)  |
| Clients  | `src/api/client/`   | `AuthClient` (register, login, token) and `BaseClient` (authorized HTTP calls) |
| Services | `src/api/services/` | Domain endpoints built on `BaseClient`, e.g. `TaskService.getTasksList()`      |
| Fixtures | `src/api/fixtures/` | Ready-to-use, already authenticated objects injected into tests                |

### Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `BASE_URL`          | Base URL of the application |
| `EMAIL_USER_ONE`    | Email of the test user      |
| `PASSWORD_USER_ONE` | Password of the test user   |

### Flow

1. The fixture `authClientUserOne` logs in via `POST /api/auth/login` and stores the `access_token`.
2. `tasksServiceUserOne` receives that client; `BaseClient` adds the `Authorization: Bearer <token>` header to every call.
3. The test just uses the service.

### Adding a new endpoint

1. Add the response/request types in `src/api/models/`.
2. Create a service extending `BaseClient` in `src/api/services/` and use `authGet` / `authPost` / ...
3. Register it as a fixture in `src/api/fixtures/fixtures.ts`.
