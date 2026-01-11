import { describe, it, expect } from "vitest";
import rule from "./3_7_k";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.k - Matchs de barrage", () => {
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
    playoff: boolean = false,
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    playoff,
    arbiter: null,
  });

  it("ne devrait pas s'appliquer aux matchs non-playoff", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1], false);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué dans la même division", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // Player 1 has played in N2 before
    const history = {
      team1: [createTeamComposition("team1", [player1], false)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué dans une division inférieure", () => {
    const team1 = createTeam("team1", "N2", "A");
    const team2 = createTeam("team2", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // Player 1 has played in N3 (lower division)
    const history = {
      team2: [createTeamComposition("team2", [player1], false)],
    };

    const tournamentState = createTournamentState([team1, team2], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui n'a jamais joué dans la nationale concernée ou inférieure", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // Player 1 has never played
    const tournamentState = createTournamentState([team1], {});
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.k",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("n'a pas joué au moins une fois");
  });

  it("devrait détecter un joueur qui a seulement joué dans une division supérieure", () => {
    const team1 = createTeam("team1", "N2", "A");
    const team2 = createTeam("team2", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // Player 1 has only played in N1 (higher division)
    const history = {
      team2: [createTeamComposition("team2", [player1], false)],
    };

    const tournamentState = createTournamentState([team1, team2], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("n'a pas joué au moins une fois");
  });

  it("devrait valider un joueur dans un playoff de T16 qui a joué en T16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const history = {
      team1: [createTeamComposition("team1", [player1], false)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur dans un playoff de N4 qui a joué en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const history = {
      team1: [createTeamComposition("team1", [player1], false)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs non éligibles", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    // Only player 3 has played in N2
    const history = {
      team1: [createTeamComposition("team1", [player3], false)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    const history = {
      team1: [createTeamComposition("team1", [player1], false)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [null, player1, null], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait compter les apparitions dans toutes les équipes de la division ou inférieure", () => {
    const team1 = createTeam("team1", "N2", "A");
    const team2 = createTeam("team2", "N2", "B");
    const team3 = createTeam("team3", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1");

    // Player 1 played in team3 (N3, lower division)
    const history = {
      team3: [createTeamComposition("team3", [player1], false)],
    };

    const tournamentState = createTournamentState([team1, team2, team3], history);
    const teamComposition = createTeamComposition("team1", [player1], true);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], true);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
