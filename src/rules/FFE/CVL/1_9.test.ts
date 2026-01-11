import { describe, it, expect } from "vitest";
import R_1_9 from "./1_9";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";

describe("CVL-1.9 - Nationalité étrangère (CVL)", () => {
  const mockRuleset = { name: "CVL", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
  ): TournamentState<TeamCompositionChampionnatFranceClub> => ({
    history: {},
  });

  const createTeam = (id: string, division: string = "N4"): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId: "A",
    ruleset: mockRuleset,
  });

  const createPlayer = (
    id: string,
    name: string,
    isQualified: boolean = true,
    isFrench: boolean = false,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating: 2000,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    isQualifiedResident: isQualified && !isFrench,
    isFrench,
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

  describe("Division N4 - Minimum 4 joueurs qualifiés", () => {
    it("devrait accepter une équipe avec 4 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4 (UE)", true, false);
      const player5 = createPlayer("p5", "Joueur 5", false, false);
      const player6 = createPlayer("p6", "Joueur 6", false, false);

      const teamComposition = createTeamComposition("team1", [
        player1,
        player2,
        player3,
        player4,
        player5,
        player6,
      ]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe N4 avec seulement 3 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);
      const player5 = createPlayer("p5", "Joueur 5", false, false);
      const player6 = createPlayer("p6", "Joueur 6", false, false);

      const teamComposition = createTeamComposition("team1", [
        player1,
        player2,
        player3,
        player4,
        player5,
        player6,
      ]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe("team1");
      expect(violations[0].message).toContain("3 sur 4 requis");
    });

    it("devrait accepter une équipe N4 avec 5 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (FR)", true, true);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4 (UE)", true, false);
      const player5 = createPlayer("p5", "Joueur 5 (UE)", true, false);
      const player6 = createPlayer("p6", "Joueur 6", false, false);

      const teamComposition = createTeamComposition("team1", [
        player1,
        player2,
        player3,
        player4,
        player5,
        player6,
      ]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("Division R1 - Minimum 3 joueurs qualifiés", () => {
    it("devrait accepter une équipe R1 avec 3 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "R1");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe R1 avec seulement 2 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "R1");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3", false, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe("team1");
      expect(violations[0].message).toContain("2 sur 3 requis");
    });
  });

  describe("Division R2 - Minimum 3 joueurs qualifiés", () => {
    it("devrait accepter une équipe R2 avec 3 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "R2");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3 (Résident)", true, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe R2 avec seulement 2 joueurs qualifiés", () => {
      const team1 = createTeam("team1", "R2");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2", false, false);
      const player3 = createPlayer("p3", "Joueur 3", false, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe("team1");
      expect(violations[0].message).toContain("1 sur 3 requis");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer à la division N1", () => {
      const team1 = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1", false, false);
      const player2 = createPlayer("p2", "Joueur 2", false, false);
      const player3 = createPlayer("p3", "Joueur 3", false, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("ne devrait pas s'appliquer à la division N2", () => {
      const team1 = createTeam("team1", "N2");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1", false, false);
      const player2 = createPlayer("p2", "Joueur 2", false, false);
      const player3 = createPlayer("p3", "Joueur 3", false, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("ne devrait pas s'appliquer à la division N3", () => {
      const team1 = createTeam("team1", "N3");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1", false, false);
      const player2 = createPlayer("p2", "Joueur 2", false, false);
      const player3 = createPlayer("p3", "Joueur 3", false, false);
      const player4 = createPlayer("p4", "Joueur 4", false, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("Cas particuliers", () => {
    it("devrait gérer les joueurs null", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (UE)", true, false);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4 (UE)", true, false);

      const teamComposition = createTeamComposition("team1", [
        player1,
        player2,
        player3,
        player4,
        null,
        null,
      ]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait accepter une équipe avec tous les joueurs qualifiés", () => {
      const team1 = createTeam("team1", "R1");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1 (FR)", true, true);
      const player2 = createPlayer("p2", "Joueur 2 (FR)", true, true);
      const player3 = createPlayer("p3", "Joueur 3 (UE)", true, false);
      const player4 = createPlayer("p4", "Joueur 4 (Résident)", true, false);

      const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

      const violations = R_1_9.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const player1 = createPlayer("p1", "Joueur 1", true);
      const teamComposition = createTeamComposition("team1", [player1]);

      expect(() => {
        R_1_9.validate([team1], tournamentState, [teamComposition], "team999");
      }).toThrow("Équipe avec l'identifiant team999 non trouvée");
    });
  });
});
