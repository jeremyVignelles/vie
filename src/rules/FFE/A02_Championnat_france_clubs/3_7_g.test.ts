import { describe, it, expect } from "vitest";
import rule, { makeTransferredRuleValidator } from "./3_7_g";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.g - Joueuses et joueurs mutés", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<TeamCompositionChampionnatFranceClub
  > => ({
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
    transferred: boolean = false,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    transferred,
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter: null,
  });

  it("devrait valider une équipe avec 3 joueurs mutés ou moins (équipe de plus de 6)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", false);
    const player5 = createPlayer("p5", "Joueur 5", false);
    const player6 = createPlayer("p6", "Joueur 6", false);
    const player7 = createPlayer("p7", "Joueur 7", false);
    const player8 = createPlayer("p8", "Joueur 8", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
      player7,
      player8,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 4 joueurs mutés (équipe de plus de 6)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", false);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);
    const player5 = createPlayer("p5", "Joueur 5", true);
    const player6 = createPlayer("p6", "Joueur 6", false);
    const player7 = createPlayer("p7", "Joueur 7", false);
    const player8 = createPlayer("p8", "Joueur 8", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
      player7,
      player8,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 3 joueurs mutés");
  });

  it("devrait valider une équipe avec 2 joueurs mutés ou moins (équipe de 6)", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", false);
    const player4 = createPlayer("p4", "Joueur 4", false);
    const player5 = createPlayer("p5", "Joueur 5", false);
    const player6 = createPlayer("p6", "Joueur 6", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 3 joueurs mutés (équipe de 6)", () => {
    const team1 = createTeam("team1", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1", false);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);
    const player5 = createPlayer("p5", "Joueur 5", false);
    const player6 = createPlayer("p6", "Joueur 6", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
  });

  it("devrait retourner une seule violation d'équipe", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);
    const player5 = createPlayer("p5", "Joueur 5", false);
    const player6 = createPlayer("p6", "Joueur 6", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", false);
    const player4 = createPlayer("p4", "Joueur 4", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      null,
      player2,
      null,
      player3,
      player4,
    ]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    // 6 positions total, so max 2 transferred allowed, which we have exactly
    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe sans joueurs mutés", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", false);
    const player2 = createPlayer("p2", "Joueur 2", false);
    const player3 = createPlayer("p3", "Joueur 3", false);
    const player4 = createPlayer("p4", "Joueur 4", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", true);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });

  describe("makeTransferredRuleValidator avec configurations personnalisées", () => {
    it("devrait permettre de créer un validateur avec un quota fixe", () => {
      const customValidator = makeTransferredRuleValidator(() => 1, "CUSTOM-RULE");
      const team1 = createTeam("team1", "N1", "A");
      const players = [
        createPlayer("p1", "Joueur 1", true),
        createPlayer("p2", "Joueur 2", false),
        createPlayer("p3", "Joueur 3", false),
        createPlayer("p4", "Joueur 4", false),
      ];

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un quota fixe dépassé", () => {
      const customValidator = makeTransferredRuleValidator(() => 1, "CUSTOM-RULE");
      const team1 = createTeam("team1", "N1", "A");
      const players = [
        createPlayer("p1", "Joueur 1", true),
        createPlayer("p2", "Joueur 2", true),
        createPlayer("p3", "Joueur 3", false),
        createPlayer("p4", "Joueur 4", false),
      ];

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CUSTOM-RULE");
    });

    it("devrait permettre de filtrer par division", () => {
      const customValidator = makeTransferredRuleValidator(
        () => 0,
        "DIVISION-SPECIFIC",
        (division) => division === "N1",
      );
      const team1N1 = createTeam("team1", "N1", "A");
      const team2N2 = createTeam("team2", "N2", "A");
      const players = [createPlayer("p1", "Joueur 1", true), createPlayer("p2", "Joueur 2", false)];

      const tournamentState = createTournamentState([team1N1, team2N2]);
      const teamComposition1 = createTeamComposition("team1", players);
      const teamComposition2 = createTeamComposition("team2", players);

      // Should apply to N1
      const violations1 = customValidator(tournamentState, [teamComposition1], "team1");
      expect(violations1).toHaveLength(1);

      // Should not apply to N2
      const violations2 = customValidator(tournamentState, [teamComposition2], "team2");
      expect(violations2).toEqual([]);
    });
  });
});
