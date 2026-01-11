import { describe, it, expect } from "vitest";
import rule from "./1_6";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("CVL-1.6 - Interdiction de jouer dans plusieurs équipes de même division", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<TeamCompositionChampionnatFranceClub> => ({
    history,
  });

  const createTeam = (
    id: string,
    division: string = "R1",
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

  it("devrait valider un joueur qui n'a jamais joué dans une autre équipe de la même division", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R1", "B");
    const players = createPlayers(4);

    // Players 1-2 played for team1 in round 1
    const history = {
      team1: [createTeamComposition("team1", [players[0], players[1]], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 uses different players (3-4)
    const teamComposition = createTeamComposition("team2", [players[2], players[3]], 2);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué dans une autre équipe de la même division", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R1", "B");
    const players = createPlayers(4);

    // Player 1 played for team1 in round 1
    const history = {
      team1: [createTeamComposition("team1", [players[0], players[1]], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 tries to use player 1 in round 2
    const teamComposition = createTeamComposition("team2", [players[0], players[2], players[3]], 2);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("CVL-1.6");
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[0].message).toContain("Joueur 1");
    expect(violations[0].message).toContain(
      "a déjà joué dans une autre équipe de la même division",
    );
  });

  it("devrait détecter plusieurs joueurs ayant joué dans une autre équipe", () => {
    const team1 = createTeam("team1", "R2", "A");
    const team2 = createTeam("team2", "R2", "B");
    const players = createPlayers(6);

    // Players 1-4 played for team1
    const history = {
      team1: [createTeamComposition("team1", players.slice(0, 4), 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 tries to use players 1 and 2
    const teamComposition = createTeamComposition(
      "team2",
      [players[0], players[1], players[4], players[5]],
      2,
    );

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait autoriser un joueur à jouer dans une autre équipe d'une division différente", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R2", "A");
    const players = createPlayers(4);

    // Player 1 played for team1 in R1
    const history = {
      team1: [createTeamComposition("team1", [players[0], players[1]], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 (R2) uses player 1 - this should be allowed (different division)
    const teamComposition = createTeamComposition("team2", [players[0], players[2], players[3]], 2);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait autoriser un joueur à jouer dans la même équipe à plusieurs reprises", () => {
    const team1 = createTeam("team1", "R1", "A");
    const players = createPlayers(4);

    // Player 1 played for team1 in rounds 1 and 2
    const history = {
      team1: [
        createTeamComposition("team1", [players[0], players[1]], 1),
        createTeamComposition("team1", [players[0], players[2]], 2),
      ],
    };

    const tournamentState = createTournamentState(history);
    // Player 1 plays again for team1 in round 3
    const teamComposition = createTeamComposition("team1", [players[0], players[3]], 3);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait gérer correctement les joueurs null", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R1", "B");
    const players = createPlayers(2);

    const history = {
      team1: [createTeamComposition("team1", [players[0], null], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 with null players
    const teamComposition = createTeamComposition("team2", [null, players[1], null], 2);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur même s'il a joué dans plusieurs rondes de l'autre équipe", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R1", "B");
    const players = createPlayers(4);

    // Player 1 played for team1 in rounds 1 and 2
    const history = {
      team1: [
        createTeamComposition("team1", [players[0], players[1]], 1),
        createTeamComposition("team1", [players[0], players[2]], 2),
      ],
    };

    const tournamentState = createTournamentState(history);
    // Team2 tries to use player 1 in round 3
    const teamComposition = createTeamComposition("team2", [players[0], players[3]], 3);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait vérifier parmi toutes les équipes de la même division", () => {
    const team1 = createTeam("team1", "R2", "A");
    const team2 = createTeam("team2", "R2", "B");
    const team3 = createTeam("team3", "R2", "C");
    const players = createPlayers(6);

    // Player 1 played for team1, player 2 played for team2
    const history = {
      team1: [createTeamComposition("team1", [players[0], players[3]], 1)],
      team2: [createTeamComposition("team2", [players[1], players[4]], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team3 tries to use players 1 and 2
    const teamComposition = createTeamComposition("team3", [players[0], players[1], players[5]], 2);

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [teamComposition],
      "team3",
    );

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait détecter une violation même si le joueur était forfeited", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R1", "B");
    const players = createPlayers(2);

    // Player 1 played for team1 but was forfeited
    const history = {
      team1: [createTeamComposition("team1", [{ ...players[0], forfeited: true }, players[1]], 1)],
    };

    const tournamentState = createTournamentState(history);
    // Team2 tries to use player 1
    const teamComposition = createTeamComposition("team2", [players[0]], 2);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué dans une autre équipe");
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "R1", "A");
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], 2);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
