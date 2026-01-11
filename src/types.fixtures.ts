import type { Player, Arbiter, TeamInfo, TeamComposition, Violation } from "./types";

let playerCounter = 0;
let arbiterCounter = 0;
let teamCounter = 0;

/**
 * Crée un joueur avec des valeurs par défaut
 */
export function makePlayer(overrides: Partial<Player> = {}): Player {
  const id = `player-${++playerCounter}`;
  return {
    id,
    name: `Joueur Test ${playerCounter}`,
    ...overrides,
  };
}

/**
 * Crée un arbitre avec des valeurs par défaut
 */
export function makeArbiter(overrides: Partial<Arbiter> = {}): Arbiter {
  const id = `arbiter-${++arbiterCounter}`;
  return {
    id,
    name: `Arbitre Test ${arbiterCounter}`,
    ...overrides,
  };
}

/**
 * Crée une équipe avec des valeurs par défaut
 */
export function makeTeamInfo(overrides: Partial<TeamInfo> = {}): TeamInfo {
  const id = `team-${++teamCounter}`;
  return {
    id,
    name: `Équipe Test ${teamCounter}`,
    ...overrides,
  };
}

/**
 * Crée une composition d'équipe avec des valeurs par défaut
 */
export function makeTeamComposition<
  TPlayer extends Player = Player,
  TArbiter extends Arbiter = Arbiter,
>(overrides: Partial<TeamComposition<TPlayer, TArbiter>> = {}): TeamComposition<TPlayer, TArbiter> {
  return {
    teamId: overrides.teamId ?? `team-${teamCounter}`,
    players: [],
    arbiter: null,
    ...overrides,
  } as TeamComposition<TPlayer, TArbiter>;
}

/**
 * Crée une violation avec des valeurs par défaut
 */
export function makeViolation(overrides: Partial<Violation> = {}): Violation {
  return {
    ruleId: "TEST-RULE",
    teamId: overrides.teamId ?? `team-${teamCounter}`,
    boardNumber: null,
    message: "Violation de test",
    ...overrides,
  };
}
