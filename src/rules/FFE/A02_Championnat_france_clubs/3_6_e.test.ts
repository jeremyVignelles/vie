import { describe, it, expect } from "vitest";
import rule from "./3_6_e";
import { TournamentState } from "../../../types";
import { PlayerChampionnatFranceClub, TeamCompositionChampionnatFranceClub } from "./types";

describe("A02-3.6.e - Ordre des joueurs par Elo", () => {
  const createTournamentState = (): TournamentState<any, any, any, any> => ({
    teams: [],
    history: {},
  });

  const createPlayer = (id: string, name: string, rating: number): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    licenseType: "A",
    club: "club1",
    federation: "FRA",
    gender: "M",
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

  it("devrait valider une composition avec joueurs en ordre décroissant", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2400);
    const player2 = createPlayer("p2", "Joueur 2", 2300);
    const player3 = createPlayer("p3", "Joueur 3", 2200);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider des joueurs avec même Elo", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const player2 = createPlayer("p2", "Joueur 2", 2300);
    const player3 = createPlayer("p3", "Joueur 3", 2300);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une différence de 100 points exactement", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2100);
    const player2 = createPlayer("p2", "Joueur 2", 2200);
    const player3 = createPlayer("p3", "Joueur 3", 2000);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une différence de plus de 100 points mais avec des joueurs non continus", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2100);
    const player2 = createPlayer("p2", "Joueur 2", 2200);
    const player3 = createPlayer("p3", "Joueur 3", 2300);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.e",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("plus de 100 points d'écart");
    expect(violations[0].message).toContain("2100");
    expect(violations[0].message).toContain("2300");
  });

  it("devrait détecter un joueur avec un Elo trop élevé par rapport au précédent", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const player2 = createPlayer("p2", "Joueur 2", 2450);
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.e",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("plus de 100 points d'écart");
    expect(violations[0].message).toContain("2450");
    expect(violations[0].message).toContain("2300");
  });

  it("devrait détecter plusieurs violations d'ordre", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2200);
    const player2 = createPlayer("p2", "Joueur 2", 2350);
    const player3 = createPlayer("p3", "Joueur 3", 2500);
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(2);
    expect(violations[1].boardNumber).toBe(3);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2400);
    const player2 = createPlayer("p2", "Joueur 2", 2200);
    const teamComposition = createTeamComposition("team1", [player1, null, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait continuer à vérifier après une position vide", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const player2 = createPlayer("p2", "Joueur 2", 2450);
    const teamComposition = createTeamComposition("team1", [player1, null, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", 2300);
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
