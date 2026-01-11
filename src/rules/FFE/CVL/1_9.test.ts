import { describe, it, expect } from "vitest";
import R_1_9 from "./1_9";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "../A02_Championnat_france_clubs/types";
import {
  makeTeamChampionnatFranceClub,
  makePlayerChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.fixtures";

describe("CVL-1.9 - Nationalité étrangère (CVL)", () => {
  const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

  describe("Division N4 - Minimum 4 joueurs qualifiés", () => {
    it("devrait accepter une équipe avec 4 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N4" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player5 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player6 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4, player5, player6],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe N4 avec seulement 3 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N4" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player5 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player6 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4, player5, player6],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe(team.id);
      expect(violations[0].message).toContain("3 sur 4 requis");
    });

    it("devrait accepter une équipe N4 avec 5 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N4" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player5 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player6 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4, player5, player6],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });
  });

  describe("Division R1 - Minimum 3 joueurs qualifiés", () => {
    it("devrait accepter une équipe R1 avec 3 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "R1" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe R1 avec seulement 2 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "R1" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe(team.id);
      expect(violations[0].message).toContain("2 sur 3 requis");
    });
  });

  describe("Division R2 - Minimum 3 joueurs qualifiés", () => {
    it("devrait accepter une équipe R2 avec 3 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "R2" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("devrait rejeter une équipe R2 avec seulement 2 joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "R2" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.9");
      expect(violations[0].teamId).toBe(team.id);
      expect(violations[0].message).toContain("1 sur 3 requis");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer à la division N1", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N1" });

      const player1 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("ne devrait pas s'appliquer à la division N2", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N2" });

      const player1 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("ne devrait pas s'appliquer à la division N3", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N3" });

      const player1 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: false,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });
  });

  describe("Cas particuliers", () => {
    it("devrait gérer les joueurs null", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N4" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4, null, null],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("devrait accepter une équipe avec tous les joueurs qualifiés", () => {
      const team = makeTeamChampionnatFranceClub({ division: "R1" });

      const player1 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player2 = makePlayerChampionnatFranceClub({ isFrench: true });
      const player3 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });
      const player4 = makePlayerChampionnatFranceClub({
        isQualifiedResident: true,
        isFrench: false,
      });

      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1, player2, player3, player4],
      });

      const violations = R_1_9.validate([team], tournamentState, [teamComposition], team.id);

      expect(violations).toHaveLength(0);
    });

    it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
      const team = makeTeamChampionnatFranceClub({ division: "N4" });

      const player1 = makePlayerChampionnatFranceClub();
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: team.id,
        players: [player1],
      });

      expect(() => {
        R_1_9.validate([team], tournamentState, [teamComposition], "team999");
      }).toThrow("Équipe avec l'identifiant team999 non trouvée");
    });
  });
});
