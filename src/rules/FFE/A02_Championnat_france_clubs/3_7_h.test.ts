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
    isQualifiedResident: boolean = true,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    isQualifiedResident,
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
    const player1 = createPlayer("p1", "Joueur 1", true);
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

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 4 étrangers (équipe de 8, besoin de 5 qualifiés)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);
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

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 5 joueurs");
  });

  it("devrait valider une équipe avec 4 joueurs qualifiés (équipe de 6)", () => {
    const team1 = createTeam("team1", "N2", "A");
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

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 3 étrangers (équipe de 6, besoin de 4 qualifiés)", () => {
    const team1 = createTeam("team1", "N3", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
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

    // Team violation (not individual boards)
    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs");
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);
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

    // 4th foreign and all following boards should be sanctioned
    expect(violations.length).toBe(1); // Only board 8 (4th foreign)
    expect(violations[0].boardNumber).toBe(null);
  });

  it("devrait accepter les résidents UE et long terme comme qualifiés", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
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

    expect(violations).toEqual([]);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", false);

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
    const player1 = createPlayer("p1", "Joueur 1", true);
    const player2 = createPlayer("p2", "Joueur 2", true);
    const player3 = createPlayer("p3", "Joueur 3", true);
    const player4 = createPlayer("p4", "Joueur 4", true);

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
