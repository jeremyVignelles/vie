# Instructions pour refactoriser les fichiers de test

## Contexte

Les fichiers `types.test.ts` ont été créés dans les dossiers suivants avec des fonctions helper pour générer des objets de test :
- `/workspaces/vie/src/types.test.ts`
- `/workspaces/vie/src/rules/FFE/R01_Regles_generales/types.test.ts`
- `/workspaces/vie/src/rules/FFE/A02_Championnat_france_clubs/types.test.ts`

Ces fichiers contiennent des fonctions comme `makePlayer()`, `makePlayerFFE()`, `makeTeamFFE()`, etc. qui :
- Génèrent des IDs uniques automatiquement (compteur incrémental)
- Fournissent des valeurs par défaut sensées
- Acceptent un objet partiel en paramètre pour surcharger les propriétés

## Exemple de refactorisation effectuée sur 1_1.test.ts

### Avant
```typescript
const createPlayer = (
  id: string,
  name: string,
  licenseType: string,
  club: string,
): PlayerFFE => ({
  id,
  name,
  licenseType,
  club,
  federation: "FRA",
});

const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
const player2 = createPlayer("p2", "Joueur 2", "B", "club1");
```

### Après
```typescript
import { makePlayerFFE, makeTeamFFE, makeTeamCompositionFFE } from "./types.test";

const player1 = makePlayerFFE({ club: "club1" });
const player2 = makePlayerFFE({ club: "club1", licenseType: "B" });
```

## Étapes à suivre pour chaque fichier *.test.ts

Principe important : Ne pas utiliser de rechercher/remplacer en masse, qui donne pas toujours les bons résultats. Adapter au cas par cas, et si cela devient trop long ou que tu dépasses la fenêtre de contexte, arrêter le traitement et proposer à l'utilisateur de relancer pour la suite. Un suivi de l'avancement du traitement est à créer à la fin de ce document.

### ⚠️ RÈGLE CRITIQUE : Vérifier les paramètres de validate()

**TOUJOURS vérifier la signature de la méthode `validate()` de chaque règle avant de refactoriser les tests.**

Certaines règles nécessitent que le tableau des équipes (teams) soit passé en premier paramètre, même si ce n'est pas toujours utilisé dans tous les tests. 

**Erreur fréquente :** Passer un tableau vide `[]` au lieu du tableau d'équipes approprié.

**Exemples corrects :**
- Si un seul team1 est créé : `rule.validate([team1], tournamentState, [teamComposition], "team1")`
- Si team1 et team2 sont créés : `rule.validate([team1, team2], tournamentState, [teamComposition], "team1")`
- Vérifier dans le fichier .ts de la règle pour comprendre les paramètres attendus

**Pour vérifier :** Lire les premières lignes du fichier de règle (.ts) pour voir comment les paramètres sont utilisés dans la fonction `validate()`.

### 1. Identifier le fichier types.test.ts approprié

Pour chaque fichier de test, déterminer quel fichier `types.test.ts` utiliser :
- Tests dans `src/rules/FFE/R01_Regles_generales/` → utiliser `./types.test`
- Tests dans `src/rules/FFE/A02_Championnat_france_clubs/` → utiliser `../A02_Championnat_france_clubs/types.test`
- Tests dans `src/rules/FFE/CVL/` → utiliser `../A02_Championnat_france_clubs/types.test` (CVL utilise les types CFC)
- Tests à la racine → utiliser `./types.test`

### 2. Ajouter les imports nécessaires

Ajouter en haut du fichier :
```typescript
import { makeFunctionName1, makeFunctionName2, ... } from "./types.test";
```

Pour les fichiers CVL qui utilisent les types du Championnat France Clubs :
```typescript
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.test";
```

### 3. Ajouter le typage correct pour TournamentState

Identifier le type de composition utilisé et typer `TournamentState` :
```typescript
const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };
```

Ou pour les tests CFC :
```typescript
const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
```

Ajouter l'import du type si nécessaire :
```typescript
import { TeamCompositionFFE } from "./types";
```

### 4. Supprimer les fonctions helper locales

Supprimer toutes les fonctions du type :
- `createPlayer()`
- `createTeam()`
- `createTeamInfo()`
- `createArbiter()`
- `createComposition()`
- `createTeamComposition()`
- `createTournamentState()`

### 5. Remplacer les appels aux anciennes fonctions

Remplacer chaque appel en suivant ce principe : **ne spécifier que les propriétés pertinentes pour le test**.

#### Exemples de transformation

**Création de joueur - ne spécifier que ce qui est testé :**
```typescript
// Avant
const player = createPlayer("p1", "Joueur 1", "A", "club1");

// Après - test validant un joueur licencié du bon club
const player = makePlayerFFE({ club: "club1" });

// Après - test validant un joueur avec licence type N
const player = makePlayerFFE({ licenseType: "N" });

// Après - test validant club ET licence
const player = makePlayerFFE({ licenseType: "N", club: "club2" });
```

**Création d'équipe :**
```typescript
// Avant
const team = createTeamInfo("N1");

// Après - si on teste la division
const team = makeTeamChampionnatFranceClub({ division: "N1" });

// Après - si on teste juste qu'une équipe existe (division non importante)
const team = makeTeamChampionnatFranceClub();
```

**Création de composition :**
```typescript
// Avant
const composition = createTeamComposition("team1", [player1, player2]);

// Après
const composition = makeTeamCompositionFFE({
  teamId: "team1",
  players: [player1, player2],
});
```

**Création d'arbitre :**
```typescript
// Avant
const arbiter = { id: "a1", name: "Arbitre", arbiterTitle: "AFC" };

// Après - si on teste le titre
const arbiter = makeArbiterFFE({ arbiterTitle: "AFC" });

// Après - si le titre n'importe pas
const arbiter = makeArbiterFFE();
```

### 6. Simplifier les tests

**Principe clé** : Ne spécifier dans les objets de test QUE les propriétés qui sont validées par la règle testée.

Exemples :
- Si la règle ne vérifie que `licenseType`, ne spécifier que `licenseType`
- Si la règle ne vérifie que `club`, ne spécifier que `club`
- Si la règle vérifie `rating` et `gender`, spécifier ces deux propriétés
- Si la règle ne vérifie rien de spécifique sur un joueur, utiliser `makePlayerFFE()` sans paramètres

**Astuce** : Lire la règle testée (fichier .ts correspondant) pour comprendre quelles propriétés sont utilisées.

### 7. Gérer les cas avec IDs spécifiques

Quand un test a besoin d'IDs spécifiques (par exemple pour tester une erreur "équipe non trouvée") :

```typescript
// Si on a besoin d'un ID spécifique
const team = makeTeamFFE({ id: "team1" });

// Et plus tard dans le test, on vérifie team999 qui n'existe pas
expect(() => {
  rule.validate([team], tournamentState, [teamComposition], "team999");
}).toThrow("Équipe avec l'identifiant team999 non trouvée");
```

### 8. Vérifier les types TypeScript

Après refactorisation, vérifier qu'il n'y a pas d'erreurs de type :
```bash
npx tsc --noEmit path/to/file.test.ts
```

### 9. Lancer les tests

Vérifier que tous les tests passent :
```bash
npm test -- path/to/file.test.ts
```

## Checklist par fichier

Pour chaque fichier `*.test.ts` :

- [ ] Identifier le bon fichier `types.test.ts` à utiliser
- [ ] Ajouter les imports des fonctions `make*`
- [ ] Ajouter l'import du type pour `TournamentState<...>`
- [ ] Typer correctement toutes les variables `tournamentState`
- [ ] Supprimer les fonctions helper locales (`createPlayer`, etc.)
- [ ] Remplacer tous les appels aux anciennes fonctions
- [ ] Simplifier : ne spécifier que les propriétés testées
- [ ] Vérifier les types TypeScript
- [ ] Lancer les tests et vérifier qu'ils passent

## Fonctions disponibles par fichier types.test.ts

### src/types.test.ts
- `makePlayer(overrides?)`
- `makeArbiter(overrides?)`
- `makeTeamInfo(overrides?)`
- `makeTeamComposition(overrides?)`
- `makeViolation(overrides?)`

### src/rules/FFE/R01_Regles_generales/types.test.ts
- `makePlayerFFE(overrides?)`
- `makeTeamFFE(overrides?)`
- `makeArbiterFFE(overrides?)`
- `makeTeamCompositionFFE(overrides?)`

### src/rules/FFE/A02_Championnat_france_clubs/types.test.ts
- `makePlayerChampionnatFranceClub(overrides?)`
- `makeTeamChampionnatFranceClub(overrides?)`
- `makeTeamCompositionChampionnatFranceClub(overrides?)`

Note : Pour les arbitres dans les tests CFC, utiliser `makeArbiterFFE` depuis `R01_Regles_generales/types.test.ts`.

## Valeurs par défaut

### Astuce : Helper pour créer plusieurs joueurs

Pour les tests nécessitant plusieurs joueurs, créer un helper local dans le fichier de test :

```typescript
const createPlayers = (count: number) => {
  return Array.from({ length: count }, () => makePlayerChampionnatFranceClub());
};

// Puis l'utiliser :
const players = createPlayers(4);
// Accès : players[0], players[1], etc.

// Si besoin de surcharger un joueur spécifique :
players[0] = makePlayerChampionnatFranceClub({ name: "Joueur 1" });
```

Cela rend le code plus concis et lisible, surtout pour les tests avec beaucoup de joueurs.

### PlayerFFE
- `id`: généré automatiquement (unique)
- `name`: généré automatiquement (unique)
- `licenseType`: `"A"`
- `club`: `"club-test"`
- `federation`: `"FRA"`

### PlayerChampionnatFranceClub
- Hérite de PlayerFFE +
- `rating`: `2000`
- `gender`: `"M"`

### TeamFFE
- `id`: généré automatiquement (unique)
- `name`: généré automatiquement (unique)
- `clubs`: `["club-test"]`
- `hasAtLeast60Minutes`: `true`

### TeamChampionnatFranceClub
- Hérite de TeamFFE +
- `division`: `"N1"`
- `groupId`: `"A"`

### ArbiterFFE
- `id`: généré automatiquement (unique)
- `name`: généré automatiquement (unique)
- `arbiterTitle`: `"AFC"`

### TeamCompositionFFE / TeamCompositionChampionnatFranceClub
- `teamId`: `"team-ffe-X"` ou selon override
- `players`: `[]`
- `arbiter`: `null`
- `date`: `"2025-01-01"`

## Fichiers à refactoriser

Liste des fichiers de test à traiter (obtenir la liste complète avec) :
```bash
find /workspaces/vie/src -name "*.test.ts" -not -name "types.test.ts"
```

## Commande pour traiter tous les tests d'un dossier

```bash
npm test -- src/rules/FFE/R01_Regles_generales/
npm test -- src/rules/FFE/A02_Championnat_france_clubs/
npm test -- src/rules/FFE/CVL/
```

## Exemple complet de refactorisation

Voir `/workspaces/vie/src/rules/FFE/R01_Regles_generales/1_1.test.ts` comme référence d'un fichier complètement refactorisé.

## Suivi de l'avancement

### ✅ Complété

#### R01_Regles_generales (4/4 fichiers)
- ✅ `1_1.test.ts` - Déjà refactorisé (exemple de référence)
- ✅ `1_4.test.ts` - 7 tests passent
- ✅ `1_5.test.ts` - 6 tests passent
- ✅ `R02_3.test.ts` - 7 tests passent

#### CVL (5/5 fichiers) ✅ COMPLET
- ✅ `1_6.test.ts` - 10 tests passent
- ✅ `1_7.test.ts` - 16 tests passent
- ✅ `1_8.test.ts` - 14 tests passent
- ✅ `1_9.test.ts` - 13 tests passent
- ✅ `5_1.test.ts` - 13 tests passent

#### A02_Championnat_france_clubs (8 fichiers complétés)
- ✅ `2_5_arbitre_joueur.test.ts` - Déjà refactorisé
- ✅ `2_5_titre_arbitre.test.ts` - Déjà refactorisé
- ✅ `3_6_a.test.ts` - 9 tests passent
- ✅ `3_6_e.test.ts` - 9 tests passent
- ✅ `3_7_a.test.ts` - 8 tests passent
- ✅ `3_7_b.test.ts` - 12 tests passent
- ✅ `3_7_c.test.ts` - 13 tests passent
- ✅ `3_7_d.test.ts` - 14 tests passent
- ✅ `3_7_e.test.ts` - 9 tests passent

### 🔄 En cours

#### A02_Championnat_france_clubs (8 fichiers restants)
- `3_7_f.test.ts`
- `3_7_g.test.ts`
- `3_7_h.test.ts`
- `3_7_i.test.ts`
- `3_7_j.test.ts`
- `3_7_k.test.ts`
- `3_8.test.ts`

**Total**: 17 fichiers complétés / 24 fichiers au total

**Prochaine étape recommandée** : Continuer avec les fichiers 3_7_f.test.ts à 3_8.test.ts dans A02_Championnat_france_clubs.
