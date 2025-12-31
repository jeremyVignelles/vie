# vie

✅ Vérification Informatique des Équipes

Une bibliothèque TypeScript pour la vérification des informations d'équipe.

[English version](./README.en.md) | [Documentation technique complète](./PROJECT.md)

## Installation

```bash
npm install vie
```

## Utilisation

```typescript
import { placeholder, VERSION } from 'vie';

console.log(placeholder()); // "vie library - to be implemented"
console.log(VERSION); // "1.0.0"
```

## Développement

### Utiliser le Dev Container (Recommandé)

La méthode la plus simple pour commencer :

1. **VS Code**: Installez l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), ouvrez ce dépôt, et sélectionnez "Reopen in Container"
2. **GitHub Codespaces**: Cliquez sur "Code" → "Codespaces" → "Create codespace" sur GitHub

Le dev container inclut Node.js 24, toutes les dépendances, et les extensions VS Code pré-configurées. Voir [.devcontainer/README.md](.devcontainer/README.md) pour plus de détails.

### Installation locale

Si vous préférez développer localement :

#### Prérequis

- Node.js >= 20.0.0
- npm

#### Configuration

```bash
# Installer les dépendances
npm install

# Lancer les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer le linter
npm run lint

# Vérifier les types
npm run type-check

# Compiler la bibliothèque
npm run build
```

### Scripts disponibles

- `npm run build` - Compiler la bibliothèque (bundle + types)
- `npm test` - Lancer les tests une fois
- `npm run test:watch` - Lancer les tests en mode watch
- `npm run lint` - Lancer oxlint
- `npm run type-check` - Vérification des types TypeScript

## Application web

Une application web de démonstration est disponible dans le dossier `vie-app/`. Voir [vie-app/README.md](vie-app/README.md) pour plus de détails.

```bash
cd vie-app
npm install
npm run dev
```

## Stack technologique

- **TypeScript** 5.9.x - Dernière version de TypeScript
- **Rolldown** 1.0.x - Bundler rapide basé sur Rust
- **Vitest** 4.x - Framework de test ultra-rapide
- **OXC** (oxlint) 1.x - Linter JavaScript/TypeScript rapide

## CI/CD

Ce projet utilise GitHub Actions pour :
- Lancer les tests sur plusieurs versions de Node.js (20.x, 22.x, 24.x)
- Rapports de couverture de code
- Publication automatique sur NPM lors des releases

## Licence

MIT
