import { describe, it, expect } from "vitest";
import rule from "./3_7_f";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.7.f - Noyau de l'équipe", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<
    PlayerChampionnatFranceClub,
    TeamChampionnatFranceClub,
    any,
    TeamCompositionChampionnatFranceClub
  > => ({
    teams,
    history,
  });

  const createTeam = (
    id: string,
    division: string = "N1",
    groupId: string = "A",
  ): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId,
    ruleset: mockRuleset,
  });

  const createPlayer = (
    id: string,
    name: string,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
    roundNumber?: number,
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    roundNumber,
  });

  it("ne devrait pas s'appliquer en ronde 1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const tournamentState = createTournamentState([team1], {});
    const teamComposition = createTeamComposition("team1", [player1, player2], 1);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en Top 16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // All new players in round 2
    const teamComposition = createTeamComposition("team1", [player2, player3], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // All new players in round 2
    const teamComposition = createTeamComposition("team1", [player2, player3], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec 50% de noyau en N1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const player4 = createPlayer("p4", "Joueur 4");

    // Players 1 and 2 played in round 1 (core)
    const history = {
      team1: [createTeamComposition("team1", [player1, player2], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 2 core players, 2 new players = 50%
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une équipe avec moins de 50% de noyau", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const player4 = createPlayer("p4", "Joueur 4");

    // Only player 1 played in round 1 (core)
    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 1 core player, 3 new players = 25% (need 50%)
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe("A02-3.7.f");
    expect(violations[0].boardNumber).toBe(null);
  });

  it("devrait retourner une violation d'équipe quand le noyau n'est pas respecté", () => {
    const team1 = createTeam("team1", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const player4 = createPlayer("p4", "Joueur 4");

    // Only player 1 is in the core
    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 1 core (p1), 3 non-core (p2, p3, p4) = need at least 2 core
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
  });

  it("devrait compter correctement avec des null players", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    // Player 1 is in core
    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 2 non-null players total, 1 core, 1 non-core = 50%
    const teamComposition = createTeamComposition("team1", [player1, null, player2, null], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une violation quand moins de 50% du noyau (1 sur 3)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    // Only player 1 played at round 1
    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 3 players, only 1 from core = 33% (need 50%)
    const teamComposition = createTeamComposition("team1", [player1, player2, player3], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(null);
  });

  it("devrait valider si tous les joueurs sont du noyau", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const history = {
      team1: [createTeamComposition("team1", [player1, player2], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1, player2], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait retourner vide si roundNumber n'est pas défini", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1, player2], undefined);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], 2);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
