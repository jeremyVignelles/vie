import { describe, it, expect } from "vitest";
import rule from "./1_7";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("CVL-1.7 - Noyau de l'équipe (Nat. IV et Régionales)", () => {
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
    rating: number = 2000,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
  });

  const createPlayers = (count: number, startIndex: number = 1): PlayerChampionnatFranceClub[] => {
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      return createPlayer(`p${index}`, `Joueur ${index}`);
    });
  };

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

  describe("Nationale IV - Noyau de 3 joueurs minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(4);

      const tournamentState = createTournamentState([team1], {});
      const teamComposition = createTeamComposition("team1", players, 1);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec exactement 3 joueurs du noyau", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 4), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 3 core players, 3 new players
      const newPlayers = createPlayers(3, 7);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 3), ...newPlayers],
        2,
      );

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe avec seulement 2 joueurs du noyau", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 4), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // Only 2 core players, 4 new players (need 3)
      const newPlayers = createPlayers(4, 7);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 2), ...newPlayers],
        2,
      );

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 3 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 2 ont déjà joué");
    });

    it("devrait valider avec plus de 3 joueurs du noyau", () => {
      const team1 = createTeam("team1", "N4", "A");
      const players = createPlayers(6);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 5), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 5 core players, 1 new player
      const newPlayers = createPlayers(1, 7);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 5), ...newPlayers],
        2,
      );

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 1 - Noyau de 1 joueur minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4);

      const tournamentState = createTournamentState([team1], {});
      const teamComposition = createTeamComposition("team1", players, 1);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur du noyau", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 2), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 1 core player, 3 new players
      const newPlayers = createPlayers(3, 5);
      const teamComposition = createTeamComposition("team1", [players[0], ...newPlayers], 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe sans joueur du noyau", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 2), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // All new players (need at least 1)
      const newPlayers = createPlayers(4, 5);
      const teamComposition = createTeamComposition("team1", newPlayers, 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 1 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 0 ont déjà joué");
    });

    it("devrait valider avec plusieurs joueurs du noyau", () => {
      const team1 = createTeam("team1", "R1", "A");
      const players = createPlayers(4);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // All core players
      const teamComposition = createTeamComposition("team1", players, 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 2 - Noyau de 1 joueur minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = createTeam("team1", "R2", "A");
      const players = createPlayers(4);

      const tournamentState = createTournamentState([team1], {});
      const teamComposition = createTeamComposition("team1", players, 1);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur du noyau", () => {
      const team1 = createTeam("team1", "R2", "A");
      const players = createPlayers(4);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 2), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 1 core player, 3 new players
      const newPlayers = createPlayers(3, 5);
      const teamComposition = createTeamComposition("team1", [players[0], ...newPlayers], 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe sans joueur du noyau", () => {
      const team1 = createTeam("team1", "R2", "A");
      const players = createPlayers(4);

      const history = {
        team1: [createTeamComposition("team1", players.slice(0, 2), 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // All new players (need at least 1)
      const newPlayers = createPlayers(4, 5);
      const teamComposition = createTeamComposition("team1", newPlayers, 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 1 joueurs du noyau");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer en N1", () => {
      const team1 = createTeam("team1", "N1", "A");
      const players = createPlayers(8);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // All new players in round 2
      const newPlayers = createPlayers(8, 9);
      const teamComposition = createTeamComposition("team1", newPlayers, 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en Top 16", () => {
      const team1 = createTeam("team1", "T16", "A");
      const players = createPlayers(8);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // All new players in round 2
      const newPlayers = createPlayers(8, 9);
      const teamComposition = createTeamComposition("team1", newPlayers, 2);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  it("devrait gérer correctement les joueurs null en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const players = createPlayers(6);

    const history = {
      team1: [createTeamComposition("team1", players.slice(0, 4), 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 3 core players, 2 new players, 1 null
    const newPlayers = createPlayers(2, 7);
    const teamComposition = createTeamComposition(
      "team1",
      [...players.slice(0, 3), ...newPlayers, null],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas être influencé par un joueur forfeited en R1", () => {
    const team1 = createTeam("team1", "R1", "A");
    const players = createPlayers(4);

    const history = {
      team1: [createTeamComposition("team1", [{ ...players[0], forfeited: true }, players[1]], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // Player 1 (who was forfeited) still counts as core
    const newPlayers = createPlayers(3, 5);
    const teamComposition = createTeamComposition(
      "team1",
      [{ ...players[0], forfeited: false }, ...newPlayers],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait construire le noyau à partir des rondes précédentes en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const players = createPlayers(12);

    // Round 1: players 1-6
    // Round 2: players 4-9 (4,5,6 from round 1, 7,8,9 new)
    const history = {
      team1: [
        createTeamComposition("team1", players.slice(0, 6), 1),
        createTeamComposition("team1", players.slice(3, 9), 2),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 3: 3 players from history, 3 new players
    // Core = 1-9, using players 1, 7, 9 = 3 core players
    const newPlayers = createPlayers(3, 13);
    const teamComposition = createTeamComposition(
      "team1",
      [players[0], players[6], players[8], ...newPlayers],
      3,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });
});
