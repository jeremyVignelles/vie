# Copilot Instructions for vie Project

## Project Overview
This is a TypeScript library project for "Vérification Informatique des Équipes" (VIE).

## Project Structure
```
vie/
├── .devcontainer/       # Dev container configuration
├── src/                 # Source TypeScript files
│   ├── index.ts        # Main entry point
│   └── *.test.ts       # Test files
├── dist/               # Build output (generated)
├── .github/            # GitHub configurations
│   ├── workflows/      # CI/CD workflows
│   └── agents/         # Copilot instructions
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vitest.config.ts    # Vitest configuration
├── vite.config.ts      # Vite configuration
└── rolldown.config.mjs # Rolldown bundler configuration
```

## Development Setup

### Using Dev Container (Recommended)
The project includes a pre-configured dev container with Node.js 24 and all dependencies:
- **VS Code**: Open repo and select "Reopen in Container"
- **GitHub Codespaces**: Create a codespace directly from GitHub

The dev container automatically runs `npm install` and configures VS Code with recommended extensions.

### Local Setup

#### Prerequisites
- Node.js >= 20.0.0
- npm

#### Installation
```bash
npm install
```

### Available Scripts
- `npm run dev` - Start development server with Vite
- `npm run build` - Build the library (bundle + types)
- `npm run build:bundle` - Build bundle with Rolldown
- `npm run build:types` - Generate TypeScript declarations
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run oxlint
- `npm run type-check` - Run TypeScript type checking

## Technology Stack
- **Language**: TypeScript 5.9.x
- **Bundler**: Rolldown 1.0.x (beta)
- **Dev Server**: Vite 7.x
- **Testing**: Vitest 4.x
- **Linting**: OXC (oxlint) 1.x
- **Node**: v24.x (latest)

## Coding Guidelines
- Use strict TypeScript with all strict flags enabled
- Write tests for all new features using Vitest
- Follow ES2022+ standards
- Export types alongside implementations
- Use named exports (avoid default exports)
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Testing
- Place test files next to source files with `.test.ts` extension
- Use Vitest's `describe`, `it`, and `expect` for test structure
- Aim for high test coverage
- Use `npm run test:watch` during development

## Building
The build process generates:
- `dist/index.mjs` - ES Module bundle
- `dist/index.cjs` - CommonJS bundle
- `dist/index.d.ts` - TypeScript declarations
- Source maps for all outputs

## CI/CD
- **CI**: Runs on every push and PR to main branch
  - Tests on Node 20.x, 22.x, and 24.x
  - Runs linter, type checker, tests, and build
  - Generates coverage reports
- **Publish**: Triggered on GitHub releases
  - Automatically publishes to NPM
  - Requires NPM_TOKEN secret to be configured

## Contributing
1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure `npm run lint`, `npm run type-check`, and `npm test` pass
4. Submit a pull request

## Package Publishing
The package is configured to publish to NPM automatically via GitHub Actions when a release is created. Make sure:
1. NPM_TOKEN secret is configured in GitHub repository settings
2. Version is bumped in package.json before creating a release
3. All CI checks pass before publishing
