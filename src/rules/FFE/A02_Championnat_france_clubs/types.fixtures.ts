import type {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import type { ArbiterFFE } from "../R01_Regles_generales/types";

let playerCFCCounter = 0;
let teamCFCCounter = 0;

/**
 * Crée un joueur de Championnat de France des Clubs avec des valeurs par défaut
 */
export function makePlayerChampionnatFranceClub(
  overrides: Partial<PlayerChampionnatFranceClub> = {},
): PlayerChampionnatFranceClub {
  const id = `player-cfc-${++playerCFCCounter}`;
  return {
    id,
    name: `Joueur CFC Test ${playerCFCCounter}`,
    rating: 2000,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club-test",
    isFrench: true,
    ...overrides,
  };
}

/**
 * Crée une équipe de Championnat de France des Clubs avec des valeurs par défaut
 */
export function makeTeamChampionnatFranceClub(
  overrides: Partial<TeamChampionnatFranceClub> = {},
): TeamChampionnatFranceClub {
  const id = `team-cfc-${++teamCFCCounter}`;
  return {
    id,
    name: `Équipe CFC Test ${teamCFCCounter}`,
    clubs: ["club-test"],
    hasAtLeast60Minutes: true,
    division: "N1",
    groupId: "A",
    ...overrides,
  };
}

/**
 * Crée une composition d'équipe de Championnat de France des Clubs avec des valeurs par défaut
 */
export function makeTeamCompositionChampionnatFranceClub<
  TPlayer extends PlayerChampionnatFranceClub = PlayerChampionnatFranceClub,
  TArbiter extends ArbiterFFE = ArbiterFFE,
>(
  overrides: Partial<TeamCompositionChampionnatFranceClub<TPlayer, TArbiter>> = {},
): TeamCompositionChampionnatFranceClub<TPlayer, TArbiter> {
  return {
    teamId: overrides.teamId ?? `team-cfc-${teamCFCCounter}`,
    players: [],
    arbiter: null,
    date: "2025-01-01",
    ...overrides,
  } as TeamCompositionChampionnatFranceClub<TPlayer, TArbiter>;
}
