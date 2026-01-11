import type { PlayerFFE, TeamFFE, ArbiterFFE, TeamCompositionFFE } from "./types";

let playerFFECounter = 0;
let arbiterFFECounter = 0;
let teamFFECounter = 0;

/**
 * Crée un joueur FFE avec des valeurs par défaut
 */
export function makePlayerFFE(overrides: Partial<PlayerFFE> = {}): PlayerFFE {
  const id = `player-ffe-${++playerFFECounter}`;
  return {
    id,
    name: `Joueur FFE Test ${playerFFECounter}`,
    licenseType: "A",
    club: "club-test",
    federation: "FRA",
    ...overrides,
  };
}

/**
 * Crée une équipe FFE avec des valeurs par défaut
 */
export function makeTeamFFE(overrides: Partial<TeamFFE> = {}): TeamFFE {
  const id = `team-ffe-${++teamFFECounter}`;
  return {
    id,
    name: `Équipe FFE Test ${teamFFECounter}`,
    clubs: ["club-test"],
    hasAtLeast60Minutes: true,
    ...overrides,
  };
}

/**
 * Crée un arbitre FFE avec des valeurs par défaut
 */
export function makeArbiterFFE(overrides: Partial<ArbiterFFE> = {}): ArbiterFFE {
  const id = `arbiter-ffe-${++arbiterFFECounter}`;
  return {
    id,
    name: `Arbitre FFE Test ${arbiterFFECounter}`,
    arbiterTitle: "AFC",
    ...overrides,
  };
}

/**
 * Crée une composition d'équipe FFE avec des valeurs par défaut
 */
export function makeTeamCompositionFFE<
  TPlayer extends PlayerFFE = PlayerFFE,
  TArbiter extends ArbiterFFE = ArbiterFFE,
>(
  overrides: Partial<TeamCompositionFFE<TPlayer, TArbiter>> = {},
): TeamCompositionFFE<TPlayer, TArbiter> {
  return {
    teamId: overrides.teamId ?? `team-ffe-${teamFFECounter}`,
    players: [],
    arbiter: null,
    date: "2025-01-01",
    ...overrides,
  } as TeamCompositionFFE<TPlayer, TArbiter>;
}
