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
│   │   ├── helpers/response.helper.ts # getResponse / getResponseBodyJson (status check + typed body)
│   │   ├── models/                    # TypeScript types of API requests/responses
│   │   │   ├── auth.model.ts
│   │   │   ├── common.model.ts        # shared types (ErrorMessage)
│   │   │   └── tasks.model.ts
│   │   └── services/tasks.service.ts  # tasks endpoints (extends BaseClient)
│   ├── config/env.ts                  # typed env variables (fails fast when missing)
│   └── e2e/
│       ├── fixtures/fixtures.ts       # custom Playwright fixtures (UI)
│       └── pages/                     # page objects
│           ├── home.page.ts
│           ├── buttons.page.ts
│           └── inputs.page.ts
├── tests/
│   ├── api/task.spec.ts               # API test specs (tasks)
│   ├── buttons.spec.ts                # UI test specs (with visual snapshots)
│   └── inputs.spec.ts                 # UI test specs
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
| Helpers  | `src/api/helpers/`  | `getResponse` / `getResponseBodyJson<T>` - throw a readable error on non-2xx   |
| Clients  | `src/api/client/`   | `AuthClient` (register, login, token) and `BaseClient` (authorized HTTP calls) |
| Services | `src/api/services/` | Domain endpoints built on `BaseClient`, e.g. `TaskService.getTasksList()`      |
| Fixtures | `src/api/fixtures/` | Ready-to-use, already authenticated objects injected into tests                |

### Raw vs. parsed methods

Every service method comes in two variants:

- `xxxRaw()` (e.g. `createTaskRaw`) returns the `APIResponse` - use it to assert status codes and error responses (negative tests).
- `xxx()` (e.g. `createTask`) checks the status via `getResponseBodyJson<T>` and returns the typed body; it throws on a non-2xx response.

`TaskService` covers: `getTasksList`, `createTask`, `getTaskInfo`, `updateTask`, `deleteTask`, `updateTaskStatus`.

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

### Test tags

The `Tasks API` suite is tagged `@api` and `@task` on the `describe` level; each test additionally has one type tag:

| Tag            | Meaning                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------- |
| `@functional`  | Single endpoint: happy path, validation (400), not found (404)                               |
| `@integration` | Verifies behaviour across several endpoints (e.g. create then get/list, delete then get 404) |

Examples:

```bash
npx playwright test --grep @api                    # all API tests
npx playwright test --grep "@api.*@integration"    # API integration tests only
npx playwright test --grep @functional             # functional tests (API and UI)
```

### Adding a new endpoint

1. Add the response/request types in `src/api/models/`.
2. Create a service extending `BaseClient` in `src/api/services/`, use `authGet` / `authPost` / ... and add a `Raw` + parsed method pair (parse with `getResponseBodyJson<T>`).
3. Register it as a fixture in `src/api/fixtures/fixtures.ts`.
