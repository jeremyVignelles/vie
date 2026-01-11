import { describe, it, expect } from "vitest";
import rule from "./1_8";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "../A02_Championnat_france_clubs/types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.test";

describe("CVL-1.8 - Joueurs mutés (Nat. IV et Régionales)", () => {
  const createPlayers = (count: number, transferredCount: number = 0) => {
    return Array.from({ length: count }, (_, i) =>
      makePlayerChampionnatFranceClub({ transferred: i < transferredCount }),
    );
  };

  describe("Nationale IV - Max 2 joueurs mutés", () => {
    it("devrait valider une équipe avec 2 joueurs mutés", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6, 2);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6, 1);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 3 joueurs mutés", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6, 3);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
      expect(violations[0].message).toContain("3 joueurs mutés");
    });

    it("devrait valider une équipe sans joueur muté", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6, 0);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 1 - Max 1 joueur muté", () => {
    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4, 1);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 2 joueurs mutés", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4, 2);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 1 joueurs mutés");
      expect(violations[0].message).toContain("2 joueurs mutés");
    });

    it("devrait valider une équipe sans joueur muté", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4, 0);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 2 - Max 1 joueur muté", () => {
    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
      const players = createPlayers(4, 1);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 2 joueurs mutés", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
      const players = createPlayers(4, 2);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 1 joueurs mutés");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer en N1", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1", groupId: "A" });
      const players = createPlayers(8, 5);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en N2", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2", groupId: "A" });
      const players = createPlayers(8, 5);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en N3", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3", groupId: "A" });
      const players = createPlayers(8, 5);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  it("devrait gérer correctement les joueurs null", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
    const player1 = makePlayerChampionnatFranceClub({ transferred: true });
    const player2 = makePlayerChampionnatFranceClub({ transferred: true });
    const player3 = makePlayerChampionnatFranceClub({ transferred: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, null, player3, null, null],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub({ transferred: true });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
