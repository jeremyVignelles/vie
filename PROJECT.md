# vie - Documentation technique du projet

Documentation technique complète pour le projet de bibliothèque TypeScript VIE.

> **Note**: Ce document est destiné aux développeurs. Pour une introduction générale, voir [README.md](./README.md).

## 🎯 Fonctionnalités

✅ **TypeScript 5.9.3** - Dernière version avec mode strict  
✅ **Rolldown 1.0.0** - Bundler rapide basé sur Rust  
✅ **Vitest 4.0.16** - Framework de test ultra-rapide  
✅ **OXC (oxlint) 1.36.0** - Linter ultra-rapide  
✅ **Dev Container** - Environnement de développement pré-configuré  
✅ **GitHub Actions CI/CD** - Tests automatisés et publication NPM  
✅ **Copilot Workspace** - Instructions dans `.github/agents/`

## 📦 Structure du projet

```
vie/
├── .devcontainer/
│   ├── devcontainer.json            # Configuration du dev container
│   └── README.md                    # Documentation du dev container
├── .github/
│   ├── agents/
│   │   └── copilot-instructions.md  # Configuration Copilot Workspace
│   └── workflows/
│       ├── ci.yml                    # CI/CD (Node 20, 22, 24)
│       └── publish.yml               # Workflow de publication NPM
├── src/
│   ├── index.ts                      # Point d'entrée principal (squelette)
│   └── index.test.ts                 # Tests unitaires
├── vie-app/                          # Application web de démonstration
│   ├── src/
│   │   └── main.ts                   # Point d'entrée de l'app
│   ├── index.html                    # Page HTML principale
│   ├── vite.config.ts                # Configuration Vite
│   └── package.json                  # Dépendances de l'app
├── dist/                             # Sortie de compilation (généré)
│   ├── index.mjs                     # Bundle ES Module
│   ├── index.cjs                     # Bundle CommonJS
│   └── index.d.ts                    # Déclarations TypeScript
├── package.json                      # Dépendances & scripts
├── tsconfig.json                     # Configuration TypeScript
├── rolldown.config.mjs              # Configuration du bundler
├── vitest.config.ts                 # Configuration des tests
├── .npmignore                       # Filtre de publication NPM
└── README.md                        # Documentation utilisateur
```

## 🚀 Démarrage rapide

### Utiliser le Dev Container (Recommandé)

La méthode la plus simple :

1. **VS Code**: Installez l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), ouvrez ce dépôt, et cliquez sur "Reopen in Container"
2. **GitHub Codespaces**: Cliquez sur "Code" → "Codespaces" → "Create codespace" sur GitHub

Le dev container configure automatiquement Node.js 24, installe les dépendances, et configure VS Code avec toutes les extensions nécessaires.

Voir [.devcontainer/README.md](.devcontainer/README.md) pour plus de détails.

### Installation locale

Si vous préférez le développement local :

```bash
npm install
```

### Commandes de développement

```bash
# Tests
npm test                  # Lancer une fois
npm run test:watch        # Mode watch
npm run test:ui          # Mode UI

# Linting & vérification des types
npm run lint             # Lancer oxlint
npm run type-check       # Vérification des types TypeScript

# Compilation
npm run build            # Compilation complète (bundle + types)
npm run build:bundle     # Bundling Rolldown uniquement
npm run build:types      # Déclarations TypeScript uniquement
```

### Application web

Pour développer l'application web :

```bash
cd vie-app
npm install
npm run dev              # Démarre le serveur de dev Vite
```

## 🔧 Stack technologique

| Outil | Version | Usage |
|-------|---------|-------|
| TypeScript | 5.9.3 | JavaScript avec typage statique |
| Rolldown | 1.0.0-beta.58 | Bundler rapide basé sur Rust |
| Vitest | 4.0.16 | Tests unitaires |
| OXC (oxlint) | 1.36.0 | Linting rapide |
| Node.js | 24.x | Environnement d'exécution |

## 📝 Qualité du code

- ✅ Configuration TypeScript stricte
- ✅ 100% de couverture de tests
- ✅ Zéro erreur de linter
- ✅ Source maps pour le débogage
- ✅ Declaration maps pour la navigation des types

## 🤖 CI/CD

### Intégration continue
- Déclenchement : `push` et `pull_request` vers `main`
- Tests sur : Node.js 20.x, 22.x, et 24.x
- Étapes : lint → type-check → test → build → coverage

### Publication NPM
- Déclenchement : Création de releases GitHub
- Nécessite : Secret `NPM_TOKEN`
- Processus : lint → type-check → test → build → publish

## 🧪 Tests

Les tests sont écrits avec Vitest avec 100% de couverture :

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

## 📤 Publication sur NPM

1. Mettre à jour la version dans `package.json`
2. Commit les changements
3. Créer une release GitHub
4. GitHub Actions publie automatiquement sur NPM

Assurez-vous que `NPM_TOKEN` est configuré dans les secrets du dépôt.

## 🔐 Sécurité

- Aucune vulnérabilité dans les dépendances
- Mises à jour automatiques des dépendances via GitHub Actions
- Analyse de code activée
- Attestation de provenance pour les packages NPM

## 📖 Copilot Workspace

Les instructions complètes pour GitHub Copilot Workspace sont disponibles dans :
`.github/agents/copilot-instructions.md`

## 🎓 Ressources d'apprentissage

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rolldown Documentation](https://rolldown.rs/)
- [Vitest Documentation](https://vitest.dev/)
- [OXC Project](https://oxc-project.github.io/)

## 📄 Licence

MIT

---

**Prêt pour l'implémentation** : Ceci est un projet squelette. L'implémentation réelle est prête à être ajoutée dans `src/index.ts`.
