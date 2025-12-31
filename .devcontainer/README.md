# Dev Container for VIE

This dev container provides a complete Node.js development environment for the VIE TypeScript library project.

## Features

- **Node.js 24** (Latest) with npm
- **Git** for version control
- **TypeScript** support with latest version
- **VS Code extensions** pre-installed:
  - Vitest Test Explorer
  - TypeScript support
  - GitHub Copilot
  - ESLint & Prettier
  - EditorConfig

## Usage

### Opening in VS Code

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this repository in VS Code
3. When prompted, click "Reopen in Container" (or use Command Palette: "Dev Containers: Reopen in Container")
4. Wait for the container to build and dependencies to install

### Opening in GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click the "Code" button
3. Select the "Codespaces" tab
4. Click "Create codespace on [branch]"

## What's Included

The container automatically:
- Installs Node.js 24 (Latest)
- Runs `npm install` after container creation
- Forwards port 5173 for Vite dev server
- Configures VS Code with optimal settings for TypeScript development
- Sets up Vitest integration

## Available Commands

Once inside the container, you can run:

```bash
npm run dev          # Start Vite dev server
npm run build        # Build the library
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run oxlint
npm run type-check   # TypeScript type checking
```

## Port Forwarding

- **Port 5173**: Vite development server (auto-forwarded)

## Troubleshooting

### Container fails to build
- Ensure Docker is running
- Try rebuilding the container: Command Palette → "Dev Containers: Rebuild Container"

### Dependencies not installed
- Manually run `npm install` in the terminal

### Extensions not loading
- Reload VS Code window: Command Palette → "Developer: Reload Window"
