import { describe, it, expect } from "vitest";
import rule from "./3_7_i";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.i - Nationalité française", () => {
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
    gender: "M" | "F",
    isFrench: boolean = true,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender,
    federation: "FRA",
    licenseType: "A",
    club: "club1",
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

  it("devrait valider une équipe avec un joueur français et une joueuse française en T16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueuse 1", "F", true);
    const player3 = createPlayer("p3", "Joueur 2", "M", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec un joueur français et une joueuse française en N1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueuse 1", "F", true);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec un joueur français et une joueuse française en N2", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueuse 1", "F", true);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N3", () => {
    const team1 = createTeam("team1", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", false);
    const player2 = createPlayer("p2", "Joueuse 1", "F", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", false);
    const player2 = createPlayer("p2", "Joueuse 1", "F", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter l'absence de joueur français", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueuse 1", "F", true);
    const player2 = createPlayer("p2", "Joueur 1", "M", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.i",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("au moins un joueur de nationalité française");
  });

  it("devrait détecter l'absence de joueuse française", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueuse 1", "F", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.i",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("au moins une joueuse de nationalité française");
  });

  it("devrait détecter l'absence des deux (joueur et joueuse français)", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", false);
    const player2 = createPlayer("p2", "Joueuse 1", "F", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].message).toContain("joueur de nationalité française");
    expect(violations[1].message).toContain("joueuse de nationalité française");
  });

  it("devrait sanctionner au dernier échiquier", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", false);
    const player2 = createPlayer("p2", "Joueur 2", "M", false);
    const player3 = createPlayer("p3", "Joueur 3", "M", false);
    const player4 = createPlayer("p4", "Joueur 4", "M", false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[1].boardNumber).toBe(null);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueuse 1", "F", true);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, null, player2, null]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter plusieurs joueurs et joueuses français", () => {
    const team1 = createTeam("team1", "T16", "A");
    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const player2 = createPlayer("p2", "Joueur 2", "M", true);
    const player3 = createPlayer("p3", "Joueuse 1", "F", true);
    const player4 = createPlayer("p4", "Joueuse 2", "F", true);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", "M", true);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
