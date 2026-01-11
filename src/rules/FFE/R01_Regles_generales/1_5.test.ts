import { describe, it, expect } from "vitest";
import rule from "./1_5";
import { TournamentState } from "../../../types";
import { PlayerFFE, TeamCompositionFFE } from "./types";

describe("R01-1.5 - Interdiction joueurs RUS et BLR", () => {
  const createTournamentState = (): TournamentState<TeamCompositionFFE> => ({
    history: {},
  });

  const createPlayer = (id: string, name: string, federation: string): PlayerFFE => ({
    id,
    name,
    licenseType: "A",
    club: "club1",
    federation,
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerFFE | null)[],
  ): TeamCompositionFFE => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter: null,
  });

  it("devrait valider des joueurs de fédérations autorisées", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "FRA");
    const player2 = createPlayer("p2", "Joueur 2", "USA");
    const player3 = createPlayer("p3", "Joueur 3", "GER");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur russe (RUS)", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "FRA");
    const player2 = createPlayer("p2", "Joueur 2", "RUS");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.5",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'est pas autorisé à participer");
  });

  it("devrait détecter un joueur biélorusse (BLR)", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "FRA");
    const player2 = createPlayer("p2", "Joueur 2", "BLR");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.5",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'est pas autorisé à participer");
  });

  it("devrait détecter plusieurs joueurs interdits", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "RUS");
    const player2 = createPlayer("p2", "Joueur 2", "BLR");
    const player3 = createPlayer("p3", "Joueur 3", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "FRA");
    const teamComposition = createTeamComposition("team1", [player1, null, null]);

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée dans currentTeams", () => {
    const tournamentState = createTournamentState();

    const player1 = createPlayer("p1", "Joueur 1", "FRA");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
