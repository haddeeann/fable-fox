# Inkwell UI

The Vue frontend for Inkwell, a publishing application for posts, notes, and themed zine issues. It connects to the Inkwell Django API.

## Features

- Public issue archive and issue detail pages
- Themeable zine layouts using CSS custom properties
- Writer submission and editing workflow
- Editorial issue management and piece reordering
- Rich-text post editing
- JWT authentication
- Private notes

## Requirements

- Node.js 20 or newer
- npm
- A running Inkwell API

## Local setup

Install the locked dependencies:

```sh
npm ci
```

Copy the example environment file:

```sh
cp .env.example .env.local
```

Start the development server:

```sh
npm run dev
```

Vite normally serves the UI at `http://localhost:5173`.

## Environment variables

The local `.env.local` file should contain:

```env
VITE_API_URL=http://localhost:8000
```

`VITE_API_URL` is the base URL of the Django API. It must not include `/api` because API paths already include that prefix in the client code.

Vite exposes variables beginning with `VITE_` to browser code. Do not put passwords, tokens, private API keys, or other secrets in frontend environment files.

The committed `.env.example` contains the safe local default. Local environment files are ignored by Git.

## Commands

```sh
# Start the development server
npm run dev

# Type-check the application
npm run type-check

# Create a production build
npm run build

# Run unit tests
npm run test:unit

# Run browser tests
npm run test:e2e

# Check and fix lint issues
npm run lint

# Format source files
npm run format
```

## Project structure

- `src/api/` contains API clients.
- `src/stores/` contains Pinia stores.
- `src/views/` contains routed pages.
- `src/components/` contains shared UI components.
- `src/composables/useTheme.ts` applies an issue theme to the document.
- `src/assets/themes/` contains the CSS custom-property contract for each theme.

## Themes

Issue-facing components consume shared CSS custom properties such as `--color-bg`, `--color-text`, `--color-accent`, `--font-heading`, `--font-body`, and `--grid-gap`. To add a presentation theme, define the same variable set under a new `[data-theme="slug"]` selector, import the CSS file in `src/main.ts`, and add the slug to the supported theme list.

## Production

Set `VITE_API_URL` to the public API origin before running the production build. The generated static site is written to `dist/` and can be hosted by a static hosting provider.
