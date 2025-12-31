# vie

✅ Vérification Informatique des Équipes

A TypeScript library for team information verification.

[Version française](./README.md)

## Installation

```bash
npm install vie
```

## Usage

```typescript
import { placeholder, VERSION } from 'vie';

console.log(placeholder()); // "vie library - to be implemented"
console.log(VERSION); // "1.0.0"
```

## Development

### Using Dev Container (Recommended)

The easiest way to get started is using the dev container:

1. **VS Code**: Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), open the repository, and select "Reopen in Container"
2. **GitHub Codespaces**: Click "Code" → "Codespaces" → "Create codespace" on GitHub

The dev container includes Node.js 20, all dependencies, and VS Code extensions pre-configured. See [.devcontainer/README.md](.devcontainer/README.md) for details.

### Local Setup

If you prefer to develop locally:

#### Prerequisites

- Node.js >= 20.0.0
- npm

#### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Type check
npm run type-check

# Build the library
npm run build
```

### Scripts

- `npm run build` - Build the library (bundle + types)
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run oxlint
- `npm run type-check` - Run TypeScript type checking

## Web Application

A demo web application is available in the `vie-app/` folder. See [vie-app/README.md](vie-app/README.md) for details.

```bash
cd vie-app
npm install
npm run dev
```

## Technology Stack

- **TypeScript** 5.9.x - Latest TypeScript version
- **Rolldown** 1.0.x - Fast Rust-based bundler
- **Vitest** 4.x - Blazing fast unit test framework
- **OXC** (oxlint) 1.x - Fast JavaScript/TypeScript linter

## CI/CD

This project uses GitHub Actions for:
- Running tests on multiple Node.js versions (18.x, 20.x, 22.x)
- Code coverage reporting
- Automatic publishing to NPM on release

## License

MIT
