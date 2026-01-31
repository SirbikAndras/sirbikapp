# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React 19 + TypeScript + Vite SPA frontend for SirbikApp, connecting to a Java Spring Boot backend. Uses OpenAPI code generation for type-safe API integration.

## Commands

```bash
npm run dev              # Start dev server (port 8080, proxies /api to backend on 8081)
npm run build            # TypeScript type-check + production build
npm run lint             # Run ESLint
npm run generate-api     # Regenerate API clients from backend OpenAPI spec
```

**Prerequisites:** Backend must be running on port 8081 with OpenAPI endpoint at `/v3/api-docs` before running `generate-api`.

## Architecture

### Directory Structure
- `src/view/` - Page/route components (LoginView, CounterView)
- `src/components/` - Reusable UI components (Button, Input)
- `src/api/generated/` - Auto-generated TypeScript API clients from OpenAPI (DO NOT EDIT)
- `src/api/axiosInstance.ts` - Axios instance with JWT auth interceptor
- `src/api/apiClient.ts` - Configured API client instances

### Key Patterns

**Authentication:** JWT tokens stored in `sessionStorage` (key: `jwtToken`). Axios interceptor in `axiosInstance.ts` automatically adds Bearer token to requests.

**API Integration:** OpenAPI-generated clients provide full type safety. Regenerate with `npm run generate-api` when backend API changes.

**State Management:** TanStack Query (React Query) for server state with caching. Local state uses React hooks.

**Routing:** React Router v7 with routes defined in `App.tsx`.

**Styling:** Tailwind CSS v4 with CSS variables for theming (dark mode). Custom colors defined in `src/index.css`.

### Node Version
v24 (see `.nvmrc`)
