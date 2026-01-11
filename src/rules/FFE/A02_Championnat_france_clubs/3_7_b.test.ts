import { describe, it, expect } from "vitest";
import rule from "./3_7_b";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.b - Force des équipes", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<TeamCompositionChampionnatFranceClub
  > => ({
    history,
  });

  const createTeam = (id: string, division: string = "N1"): TeamChampionnatFranceClub => ({
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
    forfeited: boolean = false,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    forfeited,
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

  it("devrait valider une équipe plus faible qu'une équipe précédente", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const strongPlayer1 = createPlayer("p1", "Fort 1", 2500);
    const strongPlayer2 = createPlayer("p2", "Fort 2", 2400);
    const weakPlayer1 = createPlayer("p3", "Faible 1", 2300);
    const weakPlayer2 = createPlayer("p4", "Faible 2", 2200);

    const strongTeamComposition = createTeamComposition("team1", [strongPlayer1, strongPlayer2]);
    const weakTeamComposition = createTeamComposition("team2", [weakPlayer1, weakPlayer2]);

    const violations = rule.validate(
      tournamentState,
      [strongTeamComposition, weakTeamComposition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait détecter une équipe plus forte qu'une équipe censée être plus forte", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const weakPlayer1 = createPlayer("p1", "Faible 1", 2300);
    const weakPlayer2 = createPlayer("p2", "Faible 2", 2200);
    const strongPlayer1 = createPlayer("p3", "Fort 1", 2500);
    const strongPlayer2 = createPlayer("p4", "Fort 2", 2400);

    const weakTeamComposition = createTeamComposition("team1", [weakPlayer1, weakPlayer2]);
    const strongTeamComposition = createTeamComposition("team2", [strongPlayer1, strongPlayer2]);

    const violations = rule.validate(
      tournamentState,
      [weakTeamComposition, strongTeamComposition],
      "team2",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.b",
      teamId: "team2",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("censée être plus faible");
    expect(violations[0].message).toContain("team1");
  });

  it("devrait valider des équipes avec des Elo identiques", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1a = createPlayer("p1", "Joueur 1a", 2400);
    const player1b = createPlayer("p2", "Joueur 1b", 2300);
    const player2a = createPlayer("p3", "Joueur 2a", 2400);
    const player2b = createPlayer("p4", "Joueur 2b", 2300);

    const team1Composition = createTeamComposition("team1", [player1a, player1b]);
    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate(
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer les forfaits comme Elo = 0", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1a = createPlayer("p1", "Joueur 1a", 2400, true); // forfait
    const player1b = createPlayer("p2", "Joueur 1b", 2300);
    const player2a = createPlayer("p3", "Joueur 2a", 2200);
    const player2b = createPlayer("p4", "Joueur 2b", 2100);

    const team1Composition = createTeamComposition("team1", [player1a, player1b]);
    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate(
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer les positions null comme Elo = 0", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1a = createPlayer("p1", "Joueur 1a", 2400);
    const player2a = createPlayer("p2", "Joueur 2a", 2200);
    const player2b = createPlayer("p3", "Joueur 2b", 2100);

    const team1Composition = createTeamComposition("team1", [player1a, null]);
    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate(
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait comparer avec l'historique si l'équipe plus forte n'est pas dans currentTeams", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1a = createPlayer("p1", "Joueur 1a", 2500);
    const player1b = createPlayer("p2", "Joueur 1b", 2400);
    const player2a = createPlayer("p3", "Joueur 2a", 2300);
    const player2b = createPlayer("p4", "Joueur 2b", 2200);

    const team1HistoryComposition = createTeamComposition("team1", [player1a, player1b]);
    const tournamentState = createTournamentState([team1, team2], {
      team1: [team1HistoryComposition],
    });

    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait utiliser la dernière composition de l'historique", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1a = createPlayer("p1", "Joueur 1a", 2500);
    const player1b = createPlayer("p2", "Joueur 1b", 2400);
    const player2a = createPlayer("p3", "Joueur 2a", 2300);
    const player2b = createPlayer("p4", "Joueur 2b", 2200);

    const oldComposition = createTeamComposition("team1", [player2a, player2b]);
    const latestComposition = createTeamComposition("team1", [player1a, player1b]);
    const tournamentState = createTournamentState([team1, team2], {
      team1: [oldComposition, latestComposition],
    });

    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait signaler une erreur si l'équipe plus forte n'a pas de composition", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player2a = createPlayer("p1", "Joueur 2a", 2300);
    const player2b = createPlayer("p2", "Joueur 2b", 2200);

    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.b",
      teamId: "team2",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("composition de l'équipe plus forte");
    expect(violations[0].message).toContain("team1");
  });

  it("ne devrait pas vérifier la première équipe du tournoi", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1a = createPlayer("p1", "Joueur 1a", 2500);
    const player1b = createPlayer("p2", "Joueur 1b", 2400);

    const team1Composition = createTeamComposition("team1", [player1a, player1b]);

    const violations = rule.validate([team1], tournamentState, [team1Composition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait comparer avec plusieurs équipes plus fortes", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const team3 = createTeam("team3");
    const tournamentState = createTournamentState([team1, team2, team3]);

    const strongPlayer1 = createPlayer("p1", "Fort 1", 2500);
    const strongPlayer2 = createPlayer("p2", "Fort 2", 2400);
    const mediumPlayer1 = createPlayer("p3", "Moyen 1", 2300);
    const mediumPlayer2 = createPlayer("p4", "Moyen 2", 2200);
    const weakPlayer1 = createPlayer("p5", "Faible 1", 2100);
    const weakPlayer2 = createPlayer("p6", "Faible 2", 2000);

    const team1Composition = createTeamComposition("team1", [strongPlayer1, strongPlayer2]);
    const team2Composition = createTeamComposition("team2", [mediumPlayer1, mediumPlayer2]);
    const team3Composition = createTeamComposition("team3", [weakPlayer1, weakPlayer2]);

    const violations = rule.validate(
      tournamentState,
      [team1Composition, team2Composition, team3Composition],
      "team3",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer différentes longueurs d'équipes", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1a = createPlayer("p1", "Joueur 1a", 2400);
    const player1b = createPlayer("p2", "Joueur 1b", 2300);
    const player1c = createPlayer("p3", "Joueur 1c", 2200);
    const player2a = createPlayer("p4", "Joueur 2a", 2100);
    const player2b = createPlayer("p5", "Joueur 2b", 2000);

    const team1Composition = createTeamComposition("team1", [player1a, player1b, player1c]);
    const team2Composition = createTeamComposition("team2", [player2a, player2b]);

    const violations = rule.validate(
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1", 2400);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
