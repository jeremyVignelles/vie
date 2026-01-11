# vie

✅ Vérification Informatique des Équipes

A TypeScript library for team information verification.

[Version française](./README.md)

## Installation

```bash
npm install vie
```

## How it works

### Modular architecture

**vie** is a modular system for validating team compositions in chess competitions. The library can be extended with different rule sets (`Ruleset`) adapted to different competitions, each with its own requirements and parameters.

### Main types

#### `TeamInfo`
Represents basic team information:
- `id`: unique team identifier
- `name`: team name
- Can be extended with additional competition-specific properties (division, group, etc.)

#### `Player`
Represents a player:
- `id`: FFE player code
- `name`: player's full name
- Can be extended with additional properties (rating, club, license, etc.)

#### `Arbiter`
Represents an arbiter:
- `id`: FFE arbiter code
- `name`: arbiter's full name
- Can be extended with additional properties (title, etc.)

#### `TeamComposition`
Represents a team's composition for a given round:
- `teamId`: team identifier
- `players`: array of aligned players (or `null` if absent)
- `arbiter`: designated arbiter (or `null` if none)

#### `TournamentState`
Represents the complete tournament state:
- `history`: history of team compositions for each previous round, indexed by team identifier

#### `Rule`
A validation rule:
- `id`: unique rule identifier
- `description`: rule description
- `validate()`: method that returns an array of `Violation` if the rule is not respected

#### `Ruleset`
A set of rules for a competition:
- `name`: displayed name of the rule set
- `link`: optional link to the rules documentation
- `rules`: array of rules to apply

#### `Violation`
Represents a rule violation:
- `ruleId`: identifier of the violated rule
- `teamId`: identifier of the concerned team
- `boardNumber`: board number concerned (or `null` for the whole team)
- `message`: message describing the violation

### `validateTeams()` method

The library's main function that validates team compositions:

```typescript
function validateTeams(
  teams: TeamInfoWithRuleset[],      // Teams with their rule sets
  tournamentState: TournamentState,   // Tournament state (history)
  currentTeams: TeamComposition[]     // Compositions to validate
): Violation[]                        // List of detected violations
```

## Usage

```typescript
import {
  validateTeams,
  type TeamInfoWithRuleset,
  type TournamentState,
  type TeamComposition,
} from 'vie';
import { ChampionnatDeFranceDesClubs } from 'vie/rules/FFE/A02_Championnat_france_clubs';

// 1. Define teams with their rule sets
const teams: TeamInfoWithRuleset<typeof ChampionnatDeFranceDesClubs>[] = [
  {
    id: 'team-paris',
    name: 'Paris Chess Club',
    ruleset: ChampionnatDeFranceDesClubs,  // French Championship rules
    division: 'N2',                         // National Division 2
    groupId: 'group-a',
    hasAtLeast60Minutes: true,              // Time control ≥ 60 minutes
    clubs: ['75001'],                       // Club code(s)
  },
];

// 2. Define the tournament state (previous rounds history)
const tournamentState: TournamentState = {
  history: {
    'team-paris': [
      // Round 1
      {
        teamId: 'team-paris',
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
          // ... other players
        ],
      },
    ],
  },
};

// 3. Define the current composition to validate (round 2)
const currentTeams: TeamComposition[] = [
  {
    teamId: 'team-paris',
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
      // ... other players
    ],
  },
];

// 4. Validate the compositions
const violations = validateTeams(teams, tournamentState, currentTeams);

// 5. Process the results
if (violations.length > 0) {
  console.log('Violations detected:');
  violations.forEach(v => {
    console.log(`- Team ${v.teamId}, board ${v.boardNumber}: ${v.message}`);
  });
} else {
  console.log('✅ All compositions comply with the rules');
}
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
