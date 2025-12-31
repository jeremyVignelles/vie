import { describe, it, expect } from "vitest";
import rule from "./3_6_a";
import { TournamentState, TeamComposition } from "../../../types";

describe("A02-3.6.a - Pas de trous dans la composition", () => {
  const createTournamentState = (): TournamentState<any, any, any, any> => ({
    teams: [],
    history: {},
  });

  const createPlayer = (id: string, name: string) => ({
    id,
    name,
  });

  const createTeamComposition = (teamId: string, players: (any | null)[]): TeamComposition => ({
    teamId,
    players,
  });

  it("devrait valider une composition sans trous", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition avec des positions vides à la fin", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const teamComposition = createTeamComposition("team1", [player1, player2, null, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un trou dans la composition", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const teamComposition = createTeamComposition("team1", [player1, null, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.a",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("trou dans la composition");
  });

  it("devrait détecter un trou avec plusieurs joueurs après", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const teamComposition = createTeamComposition("team1", [player1, null, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait détecter le premier joueur après un trou", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const teamComposition = createTeamComposition("team1", [player1, player2, null, null, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(5);
  });

  it("devrait valider une équipe vide", () => {
    const tournamentState = createTournamentState();

    const teamComposition = createTeamComposition("team1", [null, null, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition qui commence par des positions vides", () => {
    const tournamentState = createTournamentState();

    const teamComposition = createTeamComposition("team1", [null, null, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un trou après plusieurs joueurs", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");
    const player4 = createPlayer("p4", "Joueur 4");
    const teamComposition = createTeamComposition("team1", [
      player1,
      player2,
      player3,
      null,
      player4,
    ]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(5);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
