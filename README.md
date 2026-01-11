# vie

✅ Vérification Informatique des Équipes

Une bibliothèque TypeScript pour la vérification des informations d'équipe.

[English version](./README.en.md) | [Documentation technique complète](./PROJECT.md)

## Installation

```bash
npm install vie
```

## Comment ça marche

### Architecture modulaire

**vie** est un système modulaire de validation de compositions d'équipes pour les compétitions d'échecs. La bibliothèque peut être étendue avec différents ensembles de règles (`Ruleset`) adaptés à différentes compétitions, chacun avec ses propres exigences et paramètres.

### Types principaux

#### `TeamInfo`
Représente les informations de base d'une équipe :
- `id` : identifiant unique de l'équipe
- `name` : nom de l'équipe
- Peut être étendu avec des propriétés supplémentaires spécifiques à une compétition (division, groupe, etc.)

#### `Player`
Représente un joueur :
- `id` : code FFE du joueur
- `name` : nom complet du joueur
- Peut être étendu avec des propriétés supplémentaires (ELO, club, licence, etc.)

#### `Arbiter`
Représente un arbitre :
- `id` : code FFE de l'arbitre
- `name` : nom complet de l'arbitre
- Peut être étendu avec des propriétés supplémentaires (titre, etc.)

#### `TeamComposition`
Représente la composition d'une équipe pour une ronde donnée :
- `teamId` : identifiant de l'équipe
- `players` : tableau des joueurs alignés (ou `null` en cas d'absence)
- `arbiter` : arbitre désigné (ou `null` si aucun)

#### `TournamentState`
Représente l'état complet du tournoi :
- `history` : historique des compositions d'équipes pour chaque ronde précédente, indexé par identifiant d'équipe

#### `Rule`
Une règle de validation :
- `id` : identifiant unique de la règle
- `description` : description de la règle
- `validate()` : méthode qui retourne un tableau de `Violation` si la règle n'est pas respectée

#### `Ruleset`
Un ensemble de règles pour une compétition :
- `name` : nom affiché de l'ensemble de règles
- `link` : lien optionnel vers la documentation des règles
- `rules` : tableau des règles à appliquer

#### `Violation`
Représente une infraction aux règles :
- `ruleId` : identifiant de la règle enfreinte
- `teamId` : identifiant de l'équipe concernée
- `boardNumber` : numéro de l'échiquier concerné (ou `null` pour toute l'équipe)
- `message` : message décrivant l'infraction

### Méthode `validateTeams()`

La fonction principale de la bibliothèque qui valide les compositions d'équipes :

```typescript
function validateTeams(
  teams: TeamInfoWithRuleset[],      // Équipes avec leurs ensembles de règles
  tournamentState: TournamentState,   // État du tournoi (historique)
  currentTeams: TeamComposition[]     // Compositions à valider
): Violation[]                        // Liste des infractions détectées
```

## Utilisation

```typescript
import {
  validateTeams,
  type TeamInfoWithRuleset,
  type TournamentState,
  type TeamComposition,
} from 'vie';
import { ChampionnatDeFranceDesClubs } from 'vie/rules/FFE/A02_Championnat_france_clubs';

// 1. Définir les équipes avec leurs ensembles de règles
const teams: TeamInfoWithRuleset<typeof ChampionnatDeFranceDesClubs>[] = [
  {
    id: 'equipe-paris',
    name: 'Échecs Club Paris',
    ruleset: ChampionnatDeFranceDesClubs,  // Règles du championnat de France
    division: 'N2',                         // Division Nationale 2
    groupId: 'groupe-a',
    hasAtLeast60Minutes: true,              // Temps de réflexion ≥ 60 minutes
    clubs: ['75001'],                       // Code(s) du/des club(s)
  },
];

// 2. Définir l'état du tournoi (historique des rondes précédentes)
const tournamentState: TournamentState = {
  history: {
    'equipe-paris': [
      // Ronde 1
      {
        teamId: 'equipe-paris',
        date: '2026-01-05',
        arbiter: null,
        players: [
          {
            id: 'A12345',
            name: 'Dupont Jean',
            gender: 'M',
            rating: 2200,
            federation: 'FRA',
            licenseType: 'A',
            club: '75001',
          },
          {
            id: 'B67890',
            name: 'Martin Sophie',
            gender: 'F',
            rating: 2100,
            federation: 'FRA',
            licenseType: 'A',
            club: '75001',
          },
          // ... autres joueurs
        ],
      },
    ],
  },
};

// 3. Définir la composition actuelle à valider (ronde 2)
const currentTeams: TeamComposition[] = [
  {
    teamId: 'equipe-paris',
    date: '2026-01-11',
    arbiter: null,
    players: [
      {
        id: 'B67890',
        name: 'Martin Sophie',
        gender: 'F',
        rating: 2100,
        federation: 'FRA',
        licenseType: 'A',
        club: '75001',
      },
      {
        id: 'A12345',
        name: 'Dupont Jean',
        gender: 'M',
        rating: 2200,
        federation: 'FRA',
        licenseType: 'A',
        club: '75001',
      },
      // ... autres joueurs
    ],
  },
];

// 4. Valider les compositions
const violations = validateTeams(teams, tournamentState, currentTeams);

// 5. Traiter les résultats
if (violations.length > 0) {
  console.log('Infractions détectées :');
  violations.forEach(v => {
    console.log(`- Équipe ${v.teamId}, échiquier ${v.boardNumber}: ${v.message}`);
  });
} else {
  console.log('✅ Toutes les compositions sont conformes aux règles');
}
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
