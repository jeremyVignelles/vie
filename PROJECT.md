# vie - Documentation technique du projet

Documentation technique complète pour le projet de bibliothèque TypeScript VIE.

> **Note**: Ce document est destiné aux développeurs. Pour une introduction générale, voir [README.md](./README.md).

## 🎯 Fonctionnalités

✅ **TypeScript 5.9.3** - Dernière version avec mode strict et compilation directe  
✅ **Vitest 4.0.16** - Framework de test ultra-rapide  
✅ **OXC (oxlint) 1.36.0** - Linter ultra-rapide  
✅ **Test Fixtures** - Système de helpers pour générer des objets de test  
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
│   ├── index.ts                      # Point d'entrée principal
│   ├── index.test.ts                 # Tests unitaires
│   ├── types.ts                      # Types TypeScript de base
│   ├── types.fixtures.ts             # Helpers pour créer des objets de test
│   ├── tools.ts                      # Outils utilitaires
│   ├── tools.test.ts                 # Tests des outils
│   └── rules/                        # Règles de validation
│       └── FFE/
│           ├── R01_Regles_generales/      # Règles générales FFE
│           │   ├── *.ts                   # Implémentation des règles
│           │   ├── *.test.ts              # Tests des règles
│           │   ├── types.ts               # Types spécifiques
│           │   └── types.fixtures.ts      # Helpers de test spécifiques
│           ├── A02_Championnat_france_clubs/  # Règles Championnat France
│           │   ├── *.ts
│           │   ├── *.test.ts
│           │   ├── types.ts
│           │   └── types.fixtures.ts
│           └── CVL/                       # Règles Interclubs ligue Centre Val de Loire
│               ├── *.ts
│               └── *.test.ts
├── vie-app/                          # Application web de démonstration
│   ├── src/
│   │   └── main.ts                   # Point d'entrée de l'app
│   ├── index.html                    # Page HTML principale
│   ├── vite.config.ts                # Configuration Vite
│   └── package.json                  # Dépendances de l'app
├── dist/                             # Sortie de compilation (généré)
│   ├── index.js                      # Module ES compilé
│   ├── index.d.ts                    # Déclarations TypeScript
│   └── rules/                        # Règles compilées
├── package.json                      # Dépendances & scripts
├── tsconfig.json                     # Configuration TypeScript
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
npm run build            # Compilation TypeScript complète
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
| TypeScript | 5.9.3 | JavaScript avec typage statique et compilation |
| Vitest | 4.0.16 | Tests unitaires avec couverture |
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

Les tests sont écrits avec Vitest et utilisent un système de fixtures pour générer les données de test :

### Fixtures de test

Chaque module dispose de fonctions helpers (`types.fixtures.ts`) pour créer des objets de test :

```typescript
import { makePlayerFFE, makeTeamFFE, makeTeamCompositionFFE } from "./types.fixtures";
import { TournamentState } from "../../../types";
import { TeamCompositionFFE } from "./types";

describe("R01-1.1 - Licence et club", () => {
  it("devrait valider une équipe avec des joueurs licenciés du même club", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club1"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ club: "club1" });
    const player2 = makePlayerFFE({ club: "club1", licenseType: "B" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });
});
```

### Avantages du système de fixtures

- ✅ **IDs uniques automatiques** : Compteur incrémental pour éviter les conflits
- ✅ **Valeurs par défaut sensées** : Objets valides par défaut
- ✅ **Surcharge partielle** : Ne spécifier que les propriétés qui varient
- ✅ **Typage fort** : Assistance complète du TypeScript
- ✅ **Tests lisibles** : Focus sur ce qui est testé, pas sur la construction des données

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
- [Vitest Documentation](https://vitest.dev/)
- [OXC Project](https://oxc-project.github.io/)

## 📄 Licence

MIT

---

**Bibliothèque de validation** : Ce projet implémente un système complet de validation de règles pour les compétitions d'échecs avec différentes fédérations et tournois.
