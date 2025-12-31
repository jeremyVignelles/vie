import { describe, it, expect } from "vitest";
import rule from "./3_7_c";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.7.c - Participation dans plusieurs équipes", () => {
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

  const createTeam = (id: string, division: string = "N1"): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
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
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
  });

  it("devrait valider un joueur qui n'a jamais joué dans une équipe plus forte", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué 2 fois dans une équipe plus forte", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const historyComposition1 = createTeamComposition("team1", [player1, player2]);
    const historyComposition2 = createTeamComposition("team1", [player1, player2]);
    const tournamentState = createTournamentState([team1, team2], {
      team1: [historyComposition1, historyComposition2],
    });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué 3 fois dans une équipe plus forte", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const historyComposition1 = createTeamComposition("team1", [player1, player2]);
    const historyComposition2 = createTeamComposition("team1", [player1, player2]);
    const historyComposition3 = createTeamComposition("team1", [player1, player2]);
    const tournamentState = createTournamentState([team1, team2], {
      team1: [historyComposition1, historyComposition2, historyComposition3],
    });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.c",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 3 fois");
    expect(violations[0].message).toContain("Joueur 1");
  });

  it("devrait détecter un joueur qui a joué plus de 3 fois dans une équipe plus forte", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyCompositions = [
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
    ];
    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.c",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 5 fois");
  });

  it("devrait compter les participations dans plusieurs équipes plus fortes", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const team3 = createTeam("team3");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyTeam1_1 = createTeamComposition("team1", [player1]);
    const historyTeam1_2 = createTeamComposition("team1", [player1]);
    const historyTeam2_1 = createTeamComposition("team2", [player1]);

    const tournamentState = createTournamentState([team1, team2, team3], {
      team1: [historyTeam1_1, historyTeam1_2],
      team2: [historyTeam2_1],
    });

    const teamComposition = createTeamComposition("team3", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team3");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 fois");
  });

  it("devrait ignorer les équipes plus faibles", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const team3 = createTeam("team3");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyTeam3_1 = createTeamComposition("team3", [player1]);
    const historyTeam3_2 = createTeamComposition("team3", [player1]);
    const historyTeam3_3 = createTeamComposition("team3", [player1]);

    const tournamentState = createTournamentState([team1, team2, team3], {
      team3: [historyTeam3_1, historyTeam3_2, historyTeam3_3],
    });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const historyCompositions = [
      createTeamComposition("team1", [player1, player2]),
      createTeamComposition("team1", [player1, player2]),
      createTeamComposition("team1", [player1, player2]),
    ];

    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait ignorer les positions null dans l'historique", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyCompositions = [
      createTeamComposition("team1", [player1, null]),
      createTeamComposition("team1", [null, player1]),
      createTeamComposition("team1", [player1]),
    ];

    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 fois");
  });

  it("devrait ignorer les positions null dans la composition actuelle", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyCompositions = [
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
    ];

    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [null, player1, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("ne devrait pas vérifier la première équipe", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait gérer une équipe plus forte sans historique", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait vérifier l'identité du joueur par ID", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 1"); // Même nom mais ID différent

    const historyCompositions = [
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
    ];

    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
