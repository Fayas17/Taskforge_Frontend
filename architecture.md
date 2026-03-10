# Taskforge Frontend Architecture

## Overview
This document outlines the architectural setup, folder structure, and key technologies implemented in the Taskforge Frontend application. It provides context on everything that has been set up to establish a robust, scalable, and maintainable React application.

## Tech Stack & Core Libraries
- **Core Framework**: React 19 + TypeScript + Vite. Vite provides an extremely fast development server and optimized build process.
- **Routing**: `react-router-dom` (v7). The application uses a central router configuration wrapped with `RouterProvider` for advanced route handling and layout management.
- **Styling**: Tailwind CSS v4 + PostCSS for utility-first, responsive styling.
- **Network & API**: `axios` for HTTP requests.
- **Animation & UI**: `framer-motion` for smooth, micro-animations and dynamic UI elements. `react-loading-skeleton` for placeholder loading states.
- **Code Quality & Git Hooks**: ESLint and Prettier for strict type-checked linting and consistent formatting. Husky is integrated for pre-commit hooks to enforce code quality before pushes.

## Directory Structure
The `src` directory is organized modularly to separate concerns and scale easily:

```text
src/
├── api/             # Axios instance setup (axios.ts) and network interceptors (interceptors.ts) 
├── assets/          # Static assets (images, icons, etc.)
├── components/      # Reusable UI components
│   ├── auth/        # Auth-specific components
│   └── common/      # Generic components (e.g., ErrorBoundary)
├── layouts/         # Page layout wrappers (e.g., MainLayout.tsx, DashboardLayout.tsx)
├── modules/         # Feature-based folder structure encapsulating specific domain logic
│   ├── auth/        # Authentication related pages and logic
│   └── dashboard/   # Dashboard related pages and logic
├── routes/          # Centralized route definitions (index.tsx)
├── App.tsx          # Root application component (currently demonstrating the skeleton loader)
├── main.tsx         # Application entry point, injecting Router and ErrorBoundary
└── index.css        # Global Tailwind and custom styles
```

## Key Implementations & Context

### 1. Advanced API Interceptors & Auth Flow
Located in `src/api/interceptors.ts` and `src/api/axios.ts`, the application is equipped with a sophisticated request/response interceptor mechanism:
- **Global Configuration**: Axios is pre-configured with the base URL (`VITE_API_BASE_URL`) and `withCredentials: true` to automatically handle HTTP-only cookies securely.
- **Automatic Token Refresh**: The response interceptor is designed to catch `401 Unauthorized` errors. If the access token expires, it queues subsequent requests, triggers a background silent refresh (`/auth/refresh/`) using securely stored cookies, and then dynamically retries the initially failed requests once the new token is acquired. This provides a completely seamless user experience when sessions expire.
- **Session Management**: If the refresh token itself fails or is invalid, it gracefully clears the frontend tracking state (`localStorage.removeItem('isAuthenticated')`), rejects pending requests, and bounces the user back to the login screen.

### 2. Feature-based Modular Architecture
The codebase is structured around "modules" (`src/modules/`). Instead of grouping all pages or logic by type (e.g., putting all controllers or views together globally), the app groups them by feature area (Auth, Dashboard). This makes the codebase much more predictable and easier to navigate without massive monolithic folders as the application scales.

### 3. Layout-driven Routing
Using `react-router-dom`'s nested route capabilities (`src/routes/index.tsx`), layouts (`DashboardLayout`, `MainLayout`) are injected at the route tree level rather than per-page. This strictly prevents component remounting during navigation, prevents layout layout-duplication, and allows layout-level state to persist seamlessly across page transitions.

### 4. Resilient Error Handling & Loading States
- **Error Boundaries**: A global `ErrorBoundary` component (`src/components/common/ErrorBoundary`) wraps the entire route tree in `main.tsx` to catch unhandled render exceptions, preventing the app from white-screening.
- **Loading Skeletons**: Integrated `react-loading-skeleton` provides immediate visual feedback during data fetching phases. This improves perceived performance significantly over standard loading spinners (as demonstrated in `App.tsx`).
