import { describe, it, expect } from "vitest";
import rule from "./3_8";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.8 - Forfaits sportifs", () => {
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

  const createTeam = (id: string, division: string): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId: division + "-1",
    ruleset: mockRuleset,
  });

  const createPlayer = (
    id: string,
    name: string,
    rating: number,
    forfeited: boolean = false,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    isFrench: true,
    forfeited,
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
  });

  describe("Top 16", () => {
    it("devrait sanctionner chaque forfait", () => {
      const team = createTeam("team1", "T16");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2500, true);
      const player2 = createPlayer("p2", "Joueur 2", 2400, false);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
    });

    it("devrait sanctionner plusieurs forfaits", () => {
      const team = createTeam("team1", "T16");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2500, true);
      const player2 = createPlayer("p2", "Joueur 2", 2400, true);
      const player3 = createPlayer("p3", "Joueur 3", 2300, false);
      const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[1].message).toContain("échiquier 2");
    });

    it("ne devrait pas sanctionner sans forfait", () => {
      const team = createTeam("team1", "T16");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2500, false);
      const player2 = createPlayer("p2", "Joueur 2", 2400, false);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait sanctionner un joueur null comme forfait", () => {
      const team = createTeam("team1", "T16");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2500, false);
      const teamComposition = createTeamComposition("team1", [player1, null]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 2");
    });
  });

  describe("N1", () => {
    it("devrait sanctionner chaque forfait", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2300, true);
      const player2 = createPlayer("p2", "Joueur 2", 2200, false);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
    });

    it("devrait sanctionner plusieurs forfaits", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2300, true);
      const player2 = createPlayer("p2", "Joueur 2", 2200, true);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[1].message).toContain("échiquier 2");
    });
  });

  describe("N2", () => {
    it("ne devrait pas sanctionner les 3 premiers forfaits", () => {
      const team = createTeam("team1", "N2");

      // Create history with 2 previous forfeitures
      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, false),
          ]),
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, false),
          ]),
        ],
      };

      const tournamentState = createTournamentState([team], history);

      // Current round: 1 forfeit (3rd total)
      const player1 = createPlayer("p1", "Joueur 1", 2100, true);
      const player2 = createPlayer("p2", "Joueur 2", 2000, false);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait sanctionner à partir du 4e forfait de 100€", () => {
      const team = createTeam("team1", "N2");

      // Create history with 3 previous forfeitures
      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, false),
          ]),
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, true),
          ]),
        ],
      };

      const tournamentState = createTournamentState([team], history);

      // Current round: 1 forfeit (4th total)
      const player1 = createPlayer("p1", "Joueur 1", 2100, true);
      const player2 = createPlayer("p2", "Joueur 2", 2000, false);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[0].message).toContain("4e forfait");
      expect(violations[0].message).toContain("N2");
    });

    it("devrait sanctionner plusieurs forfaits au-delà du 4e", () => {
      const team = createTeam("team1", "N2");

      // Create history with 4 previous forfeitures
      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, true),
          ]),
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2100, true),
            createPlayer("p2", "Joueur 2", 2000, true),
          ]),
        ],
      };

      const tournamentState = createTournamentState([team], history);

      // Current round: 2 forfaits (5th and 6th total)
      const player1 = createPlayer("p1", "Joueur 1", 2100, true);
      const player2 = createPlayer("p2", "Joueur 2", 2000, true);
      const teamComposition = createTeamComposition("team1", [player1, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("5e forfait");
      expect(violations[1].message).toContain("6e forfait");
    });

    it("devrait compter les joueurs null dans l'historique", () => {
      const team = createTeam("team1", "N2");

      // Create history with 2 null players (forfaits) + 1 explicit forfeit
      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          createTeamComposition("team1", [null, createPlayer("p2", "Joueur 2", 2000, false)]),
          createTeamComposition("team1", [null, createPlayer("p2", "Joueur 2", 2000, true)]),
        ],
      };

      const tournamentState = createTournamentState([team], history);

      // Current round: 1 null player (4th total forfeit)
      const player2 = createPlayer("p2", "Joueur 2", 2000, false);
      const teamComposition = createTeamComposition("team1", [null, player2]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[0].message).toContain("4e forfait");
    });
  });

  describe("N3", () => {
    it("devrait appliquer les mêmes règles que N2", () => {
      const team = createTeam("team1", "N3");

      // Create history with 3 previous forfeitures
      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          createTeamComposition("team1", [
            createPlayer("p1", "Joueur 1", 2000, true),
            createPlayer("p2", "Joueur 2", 1900, true),
            createPlayer("p3", "Joueur 3", 1800, true),
          ]),
        ],
      };

      const tournamentState = createTournamentState([team], history);

      // Current round: 1 forfeit (4th total)
      const player1 = createPlayer("p1", "Joueur 1", 2000, true);
      const teamComposition = createTeamComposition("team1", [player1]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[0].message).toContain("4e forfait");
      expect(violations[0].message).toContain("N3");
    });

    it("ne devrait pas sanctionner avant le 4e forfait", () => {
      const team = createTeam("team1", "N3");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 2000, true);
      const player2 = createPlayer("p2", "Joueur 2", 1900, true);
      const player3 = createPlayer("p3", "Joueur 3", 1800, true);
      const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait rien faire pour les divisions N4 ou autres", () => {
      const team = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team]);

      const player1 = createPlayer("p1", "Joueur 1", 1800, true);
      const teamComposition = createTeamComposition("team1", [player1]);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });
});
