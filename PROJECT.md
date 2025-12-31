# vie - TypeScript Library Project

This project is a complete TypeScript library skeleton with modern tooling.

## 🎯 Features

✅ **TypeScript 5.9.3** - Latest version with strict mode  
✅ **Rolldown 1.0.0** - Fast Rust-based bundler  
✅ **Vite 7.3.0** - Next-gen development tooling  
✅ **Vitest 4.0.16** - Fast unit testing framework  
✅ **OXC (oxlint) 1.36.0** - Lightning-fast linter  
✅ **Dev Container** - Pre-configured development environment  
✅ **GitHub Actions CI/CD** - Automated testing and NPM publishing  
✅ **Copilot Workspace Ready** - Instructions in `.github/agents/`

## 📦 Project Structure

```
vie/
├── .devcontainer/
│   ├── devcontainer.json            # Dev container configuration
│   └── README.md                    # Dev container documentation
├── .github/
│   ├── agents/
│   │   └── copilot-instructions.md  # Copilot Workspace configuration
│   └── workflows/
│       ├── ci.yml                    # CI workflow (Node 18, 20, 22)
│       └── publish.yml               # NPM publish workflow
├── src/
│   ├── index.ts                      # Main entry point (skeleton)
│   └── index.test.ts                 # Unit tests
├── dist/                             # Build output (generated)
│   ├── index.mjs                     # ESM bundle
│   ├── index.cjs                     # CommonJS bundle
│   └── index.d.ts                    # TypeScript declarations
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── rolldown.config.mjs              # Rolldown bundler config
├── vite.config.ts                   # Vite configuration
├── vitest.config.ts                 # Vitest configuration
├── .npmignore                       # NPM publish exclusions
└── README.md                        # This file
```

## 🚀 Quick Start

### Using Dev Container (Recommended)

The easiest way to get started:

1. **VS Code**: Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), open this repo, and click "Reopen in Container"
2. **GitHub Codespaces**: Click "Code" → "Codespaces" → "Create codespace" on GitHub

The dev container automatically sets up Node.js 20, installs dependencies, and configures VS Code with all necessary extensions.

See [.devcontainer/README.md](.devcontainer/README.md) for more details.

### Local Installation

If you prefer local development:

```bash
npm install
```

### Development Commands

```bash
# Run tests
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:ui          # UI mode

# Linting & Type Checking
npm run lint             # Run oxlint
npm run type-check       # TypeScript type checking

# Building
npm run build            # Full build (bundle + types)
npm run build:bundle     # Rolldown bundling only
npm run build:types      # TypeScript declarations only

# Development
npm run dev              # Start Vite dev server
```

## 🔧 Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Rolldown | 1.0.0-beta.58 | Fast Rust-based bundler |
| Vite | 7.3.0 | Development server |
| Vitest | 4.0.16 | Unit testing |
| OXC (oxlint) | 1.36.0 | Fast linting |
| Node.js | 20.x+ | Runtime environment |

## 📝 Code Quality

- ✅ Strict TypeScript configuration
- ✅ 100% test coverage
- ✅ Zero linter errors
- ✅ Source maps for debugging
- ✅ Declaration maps for type navigation

## 🤖 CI/CD

### Continuous Integration
- Runs on: `push` and `pull_request` to `main`
- Tests on: Node.js 18.x, 20.x, and 22.x
- Steps: lint → type-check → test → build → coverage

### NPM Publishing
- Triggered by: GitHub releases
- Requires: `NPM_TOKEN` secret
- Process: lint → type-check → test → build → publish

## 🧪 Testing

Tests are written using Vitest with 100% coverage:

```typescript
import { describe, it, expect } from 'vitest';
import { placeholder, VERSION } from './index';

describe('vie library', () => {
  it('should export placeholder function', () => {
    expect(placeholder()).toBe('vie library - to be implemented');
  });

  it('should export VERSION constant', () => {
    expect(VERSION).toBe('1.0.0');
  });
});
```

## 📤 Publishing to NPM

1. Update version in `package.json`
2. Commit changes
3. Create a GitHub release
4. GitHub Actions will automatically publish to NPM

Make sure `NPM_TOKEN` is configured in repository secrets.

## 🔐 Security

- No vulnerabilities in dependencies
- Automated dependency updates via GitHub Actions
- Code scanning enabled
- Provenance attestation for NPM packages

## 📖 Copilot Workspace

Full instructions for GitHub Copilot Workspace are available in:
`.github/agents/copilot-instructions.md`

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rolldown Documentation](https://rolldown.rs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [OXC Project](https://oxc-project.github.io/)

## 📄 License

MIT

---

**Ready to implement**: This is a skeleton project. The actual implementation is ready to be added in `src/index.ts`.
