import { describe, it, expect } from "vitest";
import rule from "./3_7_g";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.7.g - Joueuses et joueurs mutés", () => {
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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // 4th transferred player (player5 at board 5) and all following should be sanctioned
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].boardNumber).toBe(5);
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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // 3rd transferred player (player4 at board 4) and all following should be sanctioned
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].boardNumber).toBe(4);
    expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // 6 players, so max 2 transferred allowed
    // 3rd transferred (player3 at board 3) and all following boards should be sanctioned
    expect(violations.length).toBe(4); // boards 3, 4, 5, 6
    expect(violations[0].boardNumber).toBe(3);
    expect(violations[1].boardNumber).toBe(4);
    expect(violations[2].boardNumber).toBe(5);
    expect(violations[3].boardNumber).toBe(6);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", false);
    const player4 = createPlayer("p4", "Joueur 4", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, null, player2, null, player3, player4]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

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

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", true);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
