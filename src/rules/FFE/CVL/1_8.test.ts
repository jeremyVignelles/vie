import { describe, it, expect } from "vitest";
import rule from "./1_8";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("CVL-1.8 - Joueurs mutés (Nat. IV et Régionales)", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<
    PlayerChampionnatFranceClub,
    TeamChampionnatFranceClub,
    any,
    ArbiterFFE,
    TeamCompositionChampionnatFranceClub
  > => ({
    teams,
    history,
  });

  const createTeam = (
    id: string,
    division: string = "N4",
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
    rating: number = 2000,
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

  const createPlayers = (
    count: number,
    startIndex: number = 1,
    transferredCount: number = 0,
  ): PlayerChampionnatFranceClub[] => {
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      return createPlayer(`p${index}`, `Joueur ${index}`, i < transferredCount);
    });
  };

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter: null,
  });

  describe("Nationale IV - Max 2 joueurs mutés", () => {
    it("devrait valider une équipe avec 2 joueurs mutés", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6, 1, 2);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6, 1, 1);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 3 joueurs mutés", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6, 1, 3);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
      expect(violations[0].message).toContain("3 joueurs mutés");
    });

    it("devrait valider une équipe sans joueur muté", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6, 1, 0);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 1 - Max 1 joueur muté", () => {
    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4, 1, 1);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 2 joueurs mutés", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4, 1, 2);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 1 joueurs mutés");
      expect(violations[0].message).toContain("2 joueurs mutés");
    });

    it("devrait valider une équipe sans joueur muté", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4, 1, 0);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 2 - Max 1 joueur muté", () => {
    it("devrait valider une équipe avec 1 joueur muté", () => {
      const team1 = createTeam("team1", "R2", "A");
      const players = createPlayers(4, 1, 1);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un dépassement avec 2 joueurs mutés", () => {
      const team1 = createTeam("team1", "R2", "A");
      const players = createPlayers(4, 1, 2);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.8");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("dépassé le quota de 1 joueurs mutés");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer en N1", () => {
      const team1 = createTeam("team1", "N1", "A");
      const players = createPlayers(8, 1, 5);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en N2", () => {
      const team1 = createTeam("team1", "N2", "A");
      const players = createPlayers(8, 1, 5);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en N3", () => {
      const team1 = createTeam("team1", "N3", "A");
      const players = createPlayers(8, 1, 5);

      const tournamentState = createTournamentState([team1]);
      const teamComposition = createTeamComposition("team1", players);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  it("devrait gérer correctement les joueurs null", () => {
    const team1 = createTeam("team1", "N4", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      null,
      player3,
      null,
      null,
    ]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N4", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", true);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
