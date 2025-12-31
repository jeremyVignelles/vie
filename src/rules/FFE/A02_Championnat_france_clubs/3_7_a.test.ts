import { describe, it, expect } from "vitest";
import rule from "./3_7_a";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.7.a - Règles Top 16", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
  ): TournamentState<
    PlayerChampionnatFranceClub,
    TeamChampionnatFranceClub,
    any,
    TeamCompositionChampionnatFranceClub
  > => ({
    teams,
    history: {},
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
    gender: "M" | "F",
    federation: string,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender,
    federation,
    licenseType: "A",
    club: "club1",
    isFrench: federation === "FRA",
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
  });

  it("devrait ignorer les équipes qui ne sont pas en Top 16", () => {
    const team = createTeam("team1", "N1");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 1800, "M", "FRA");
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition Top 16 correcte", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const player3 = createPlayer("p3", "Joueur 3", 2300, "M", "USA");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter l'absence de joueur français masculin", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "USA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.a",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("au moins un joueur français et une joueuse française");
  });

  it("devrait détecter l'absence de joueuse française", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueur 2", 2300, "M", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("au moins un joueur français et une joueuse française");
  });

  it("devrait détecter un joueur avec Elo < 2000 (non joueuse française obligatoire)", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const player3 = createPlayer("p3", "Joueur 3", 1900, "M", "USA");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.a",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("n'a pas le classement Elo minimum requis de 2000");
  });

  it("la première joueuse française compte comme joueuse obligatoire", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const player3 = createPlayer("p3", "Joueuse 3", 1700, "F", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
    expect(violations[0].message).toContain("n'a pas le classement Elo minimum requis de 2000");
  });

  it("devrait accepter une joueuse française avec Elo < 2000 comme joueuse obligatoire", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs violations", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 1900, "M", "USA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "USA");
    const player3 = createPlayer("p3", "Joueur 3", 1700, "M", "GER");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // 3 violations pour les Elo < 2000 + 1 pour l'absence de joueurs français
    expect(violations).toHaveLength(4);
  });

  it("la joueuse française avec le meilleur Elo est considérée comme obligatoire", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 2100, "F", "FRA");
    const player3 = createPlayer("p3", "Joueuse 3", 1900, "F", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait gérer les positions vides (null)", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const player2 = createPlayer("p2", "Joueuse 2", 1800, "F", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, null, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = createTeam("team1", "T16");
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", 2500, "M", "FRA");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
