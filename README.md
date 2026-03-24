# TaskForge — Frontend

The frontend for TaskForge, a task management application. Built with React 19 and TypeScript, backed by a FastAPI + PostgreSQL backend.

---

## Tech Stack

| Layer       | Choice                                      |
| ----------- | ------------------------------------------- |
| Framework   | React 19 + TypeScript (strict mode)         |
| Build tool  | Vite 7                                      |
| Routing     | React Router v7                             |
| HTTP client | Axios with interceptors                     |
| Styling     | Tailwind CSS v4                             |
| Animation   | Framer Motion                               |
| Testing     | Vitest + React Testing Library + vitest-axe |
| Linting     | ESLint flat config + Prettier               |
| Git hooks   | Husky                                       |
| CI/CD       | GitHub Actions                              |

---

## Getting Started

**Prerequisites:** Node.js 22+, the [backend](../Taskforge_Backend) running on port 8000.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and set VITE_API_BASE_URL=http://localhost:8000/

# 3. Start dev server
npm run dev
```

### Common commands

| Command                 | What it does                                   |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start dev server with HMR at localhost:5173    |
| `npm run lint`          | Run ESLint                                     |
| `npm run check-format`  | Check Prettier formatting                      |
| `npm run test`          | Run unit tests                                 |
| `npm run test:coverage` | Run tests with coverage report (70% threshold) |
| `npm run build`         | Type-check + production bundle                 |

---

## Project Structure

```
src/
├── api/            # Axios instance and 401 refresh interceptor
├── components/     # Shared UI — ErrorBoundary and common components
├── constants/      # Route path constants
├── context/        # AuthContext — global authentication state
├── hooks/          # useAuth() hook for consuming AuthContext
├── layouts/        # Page shell components (DashboardLayout, MainLayout)
├── modules/
│   ├── auth/       # Login + Register pages, auth service, types
│   └── dashboard/  # Dashboard page and dashboard service
├── routes/
│   └── guards/     # ProtectedRoute, GuestRoute, CatchAllRoute
└── test/           # Vitest global setup — mocks, axe matchers
```

Path alias: `@/` maps to `src/` throughout the codebase.

---

## Authentication

**Cookie-based auth.** Access and refresh tokens live in HttpOnly cookies set by the backend — they never touch JavaScript or localStorage. This makes the app immune to XSS token theft. The backend handles cookie rotation on each refresh.

**Refresh queue.** When a 401 response comes in, the interceptor fires a single token refresh request. Any other requests that 401 while the refresh is in flight are held in a queue. Once the refresh succeeds, they all replay automatically. This prevents the refresh endpoint from being hammered by concurrent requests. See [`src/api/interceptors.ts`](src/api/interceptors.ts).

**Route guards.** All redirect logic lives in guards — pages never redirect themselves.

- `ProtectedRoute` — redirects unauthenticated users to `/`
- `GuestRoute` — redirects authenticated users away from the login/register pages
- `CatchAllRoute` — handles unknown paths, sends users to the right place based on auth state

---

## CI/CD Pipeline

Every push and pull request to `master` runs the full pipeline:

| Job              | What it checks                                           |
| ---------------- | -------------------------------------------------------- |
| Lint & Format    | ESLint errors, Prettier formatting                       |
| TypeScript       | `tsc --noEmit` — no type errors                          |
| Security Audit   | `npm audit` — flags high/critical vulnerabilities        |
| Unit Tests       | All tests pass, coverage ≥ 70% across all metrics        |
| Production Build | `tsc -b && vite build` — builds without errors           |
| CI Passed        | Aggregator job — this is what branch protection requires |

Branch protection on `master` requires `CI Passed` before merging. PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) and branches must follow the naming convention (`feat/<description>`, `fix/<description>`, etc.).

---

## Development Workflow

The pre-commit hook (Husky) runs lint and format checks automatically before each commit — you can't commit code that fails either check.

To run the full CI check locally before pushing:

```bash
npm run lint && npm run check-format && npx tsc --noEmit && npm run test:coverage
```

**Branch naming:** `feat/<description>`, `fix/<description>`, `chore/<description>`, `refactor/<description>`

**PR title format:** `feat: short description`, `fix: what was broken`, `chore: what was updated`
