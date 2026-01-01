import { describe, it, expect } from "vitest";
import rule from "./3_7_j";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.j - Elo en N4 et division inferieure", () => {
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
    clubs: string[] = ["club1"],
    groupId: string = "A",
  ): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs,
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
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter: null,
  });

  it("ne devrait pas s'appliquer en T16", () => {
    const team1 = createTeam("team1", "T16");
    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N1", () => {
    const team1 = createTeam("team1", "N1");
    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N3", () => {
    const team1 = createTeam("team1", "N3");
    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur avec Elo <= 2400 en N4", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club1"]);
    const team3 = createTeam("team3", "N2", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2400);
    const player2 = createPlayer("p2", "Joueur 2", 2300);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur avec Elo > 2400 en N4 (avec 2+ équipes en divisions supérieures)", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club1"]);
    const team3 = createTeam("team3", "N2", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2401);
    const player2 = createPlayer("p2", "Joueur 2", 2300);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.j",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("Elo supérieur à 2400");
  });

  it("ne devrait pas s'appliquer si moins de 2 équipes en divisions supérieures", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1, team2]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer si aucune équipe en divisions supérieures", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club1"]);
    const team3 = createTeam("team3", "N2", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const player2 = createPlayer("p2", "Joueur 2", 2450);
    const player3 = createPlayer("p3", "Joueur 3", 2300);
    const player4 = createPlayer("p4", "Joueur 4", 2350);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // Only player 2 (board 2) with Elo > 2400 should be sanctioned
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("devrait considérer les équipes d'entente (clubs multiples)", () => {
    const team1 = createTeam("team1", "N4", ["club1", "club2"]);
    const team2 = createTeam("team2", "N1", ["club1"]);
    const team3 = createTeam("team3", "N2", ["club2"]);

    const player1 = createPlayer("p1", "Joueur 1", 2450);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations.length).toBeGreaterThan(0);
  });

  it("devrait compter toutes les équipes des divisions supérieures", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club2"]);
    const team3 = createTeam("team3", "N2", ["club3"]);

    const player1 = createPlayer("p1", "Joueur 1", 2500);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // Now counts all teams in higher divisions, so violations should be reported
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N4", ["club1"]);
    const team2 = createTeam("team2", "N1", ["club1"]);
    const team3 = createTeam("team3", "N2", ["club1"]);

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const player2 = createPlayer("p2", "Joueur 2", 2450);

    const tournamentState = createTournamentState([team1, team2, team3]);
    const teamComposition = createTeamComposition("team1", [player1, null, player2, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N4");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
