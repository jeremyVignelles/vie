import { describe, it, expect } from "vitest";
import rule from "./3_7_h";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-3.7.h - Nationalité étrangère", () => {
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
    isFrench: boolean = true,
    residesInEU: boolean = false,
    longTermResident: boolean = false,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    isFrench,
    residesInEU,
    longTermResident,
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
  });

  it("devrait valider une équipe avec 5 joueurs qualifiés (équipe de plus de 6)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", false, true, false);
    const player4 = createPlayer("p4", "Joueur 4", false, false, true);
    const player5 = createPlayer("p5", "Joueur 5", true, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);
    const player7 = createPlayer("p7", "Joueur 7", false, false, false);
    const player8 = createPlayer("p8", "Joueur 8", false, false, false);

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

  it("devrait détecter un dépassement avec 4 étrangers (équipe de 8, besoin de 5 qualifiés)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", true, false, false);
    const player4 = createPlayer("p4", "Joueur 4", true, false, false);
    const player5 = createPlayer("p5", "Joueur 5", false, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);
    const player7 = createPlayer("p7", "Joueur 7", false, false, false);
    const player8 = createPlayer("p8", "Joueur 8", false, false, false);

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

    // 4 qualified players, need 5, so 4th foreign player (player8 at board 8) should be sanctioned
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].boardNumber).toBe(8);
    expect(violations[0].message).toContain("au moins 5 joueurs");
  });

  it("devrait valider une équipe avec 4 joueurs qualifiés (équipe de 6)", () => {
    const team1 = createTeam("team1", "N2", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", false, true, false);
    const player3 = createPlayer("p3", "Joueur 3", false, false, true);
    const player4 = createPlayer("p4", "Joueur 4", true, false, false);
    const player5 = createPlayer("p5", "Joueur 5", false, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);

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

  it("devrait détecter un dépassement avec 3 étrangers (équipe de 6, besoin de 4 qualifiés)", () => {
    const team1 = createTeam("team1", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", true, false, false);
    const player4 = createPlayer("p4", "Joueur 4", false, false, false);
    const player5 = createPlayer("p5", "Joueur 5", false, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);

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

    // 3 qualified players, need 4, so 3rd foreign player (player6 at board 6) should be sanctioned
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].boardNumber).toBe(6);
    expect(violations[0].message).toContain("au moins 4 joueurs");
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", true, false, false);
    const player4 = createPlayer("p4", "Joueur 4", true, false, false);
    const player5 = createPlayer("p5", "Joueur 5", false, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);
    const player7 = createPlayer("p7", "Joueur 7", false, false, false);
    const player8 = createPlayer("p8", "Joueur 8", false, false, false);

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

    // 4th foreign and all following boards should be sanctioned
    expect(violations.length).toBe(1); // Only board 8 (4th foreign)
    expect(violations[0].boardNumber).toBe(8);
  });

  it("devrait accepter les résidents UE et long terme comme qualifiés", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", false, true, false);
    const player2 = createPlayer("p2", "Joueur 2", false, true, false);
    const player3 = createPlayer("p3", "Joueur 3", false, false, true);
    const player4 = createPlayer("p4", "Joueur 4", false, false, true);
    const player5 = createPlayer("p5", "Joueur 5", true, false, false);
    const player6 = createPlayer("p6", "Joueur 6", false, false, false);
    const player7 = createPlayer("p7", "Joueur 7", false, false, false);
    const player8 = createPlayer("p8", "Joueur 8", false, false, false);

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

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", false, false, false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, null, player2, null, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    // 3 non-null players, need max 3 qualified if > 6, but we have 3 so need 5 if > 6
    // Actually 3 <= 6, so need 4... but we only have 3 players total
    // So we need min(4, 3) which doesn't make sense. Actually the rule states the minimum required, not a percentage
    // With 3 players, we'd need 4 qualified which is impossible
    // The rule should only apply when there are enough players
    // Let me re-read: "au moins cinq" for > 6, "au moins 4" for <= 6
    // So with 3 players, we'd need 4 qualified, which means all must be qualified
    expect(violations.length).toBeGreaterThan(0);
  });

  it("devrait valider une équipe avec tous les joueurs qualifiés", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const player2 = createPlayer("p2", "Joueur 2", true, false, false);
    const player3 = createPlayer("p3", "Joueur 3", true, false, false);
    const player4 = createPlayer("p4", "Joueur 4", true, false, false);

    const tournamentState = createTournamentState([team1]);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3, player4]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", true, false, false);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
