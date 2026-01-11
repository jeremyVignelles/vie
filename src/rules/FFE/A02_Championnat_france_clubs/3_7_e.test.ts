import { describe, it, expect } from "vitest";
import rule from "./3_7_e";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.e - Nombre de parties", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<TeamCompositionChampionnatFranceClub> => ({
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
    arbiter: null,
  });

  it("devrait valider un joueur qui n'a pas dépassé la limite de rondes", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // History: player1 has played 2 rounds
    const history = {
      team1: [
        createTeamComposition("team1", [player1], 1),
        createTeamComposition("team1", [player1], 2),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], 4);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a dépassé la limite en N2 (round 3, already played 3)", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // History: player1 has already played 3 rounds
    const history = {
      team1: [
        createTeamComposition("team1", [player1], 1),
        createTeamComposition("team1", [player1], 2),
        createTeamComposition("team1", [player1], 3),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], 3);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.e",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 3 rondes");
  });

  it("devrait appliquer la limite de 11 rondes pour le Top 16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // History: player1 has played 11 rounds
    const history = {
      team1: Array.from({ length: 11 }, (_, i) => createTeamComposition("team1", [player1], i + 1)),
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], 12);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.e",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 11 rondes");
  });

  it("devrait valider un joueur avec exactement 10 rondes en Top 16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // History: player1 has played 10 rounds
    const history = {
      team1: Array.from({ length: 10 }, (_, i) => createTeamComposition("team1", [player1], i + 1)),
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], 11);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait compter les rondes jouées dans toutes les équipes", () => {
    const team1 = createTeam("team1", "N2", "A");
    const team2 = createTeam("team2", "N2", "B");
    const player1 = createPlayer("p1", "Joueur 1");

    // History: player1 has played 2 rounds in team1 and 1 in team2 = 3 total
    const history = {
      team1: [
        createTeamComposition("team1", [player1], 1),
        createTeamComposition("team1", [player1], 2),
      ],
      team2: [createTeamComposition("team2", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1, team2], history);
    // Trying to play round 3 with 3 rounds already played
    const teamComposition = createTeamComposition("team1", [player1], 3);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 rondes");
  });

  it("devrait ignorer les joueurs null", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [null, player1], 2);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait retourner vide si le roundNumber n'est pas défini", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], undefined);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    // Both players have played 3 rounds, trying to play round 3
    const history = {
      team1: [
        createTeamComposition("team1", [player1, player2], 1),
        createTeamComposition("team1", [player1, player2], 2),
        createTeamComposition("team1", [player1, player2], 3),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1, player2], 3);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], 1);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
