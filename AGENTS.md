# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **client-only React portfolio SPA** (no backend, no database, no API). All content is hardcoded in `client/src/pages/Home.tsx`.

### Stack

- Vite 7 + React 19 + TypeScript 5.6 + Tailwind CSS v4
- Framer Motion for animations, shadcn/ui (Radix) components
- Package manager: **npm** (lockfile: `package-lock.json`)

### Running the dev server

```
npm run dev
```

Starts Vite on `http://localhost:5173` (binds `0.0.0.0`). No environment variables needed.

### Building

```
npm run build
```

Output goes to `dist/`. There is a circular chunk warning (`react -> vendor -> react`) which is benign.

### Known issues

- `npx tsc --noEmit` reports a pre-existing type error in `client/src/components/FloatingPhone.tsx` (Framer Motion `ease` type mismatch). This does **not** block the build or dev server since Vite uses esbuild/SWC, not `tsc`.
- `@icons-pack/react-simple-icons` declares `engines.node >=24` but works fine on Node 22.
- Replit-specific Vite plugins (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`) load only when `REPL_ID` env var is set; safely skipped outside Replit.

### Linting / Testing

No ESLint config or test framework is present in this repo. There are no automated tests to run.
