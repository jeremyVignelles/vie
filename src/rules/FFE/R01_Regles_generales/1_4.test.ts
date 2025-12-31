import { describe, it, expect } from "vitest";
import rule from "./1_4";
import { TournamentState } from "../../../types";
import { PlayerFFE, TeamFFE, TeamCompositionFFE } from "./types";

describe("R01-1.4 - Licence A pour cadence >= 60 minutes", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamFFE[],
  ): TournamentState<PlayerFFE, TeamFFE, any, TeamCompositionFFE> => ({
    teams,
    history: {},
  });

  const createTeam = (id: string, hasAtLeast60Minutes: boolean): TeamFFE => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes,
    ruleset: mockRuleset,
  });

  const createPlayer = (id: string, name: string, licenseType: string): PlayerFFE => ({
    id,
    name,
    licenseType,
    club: "club1",
    federation: "FRA",
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerFFE | null)[],
  ): TeamCompositionFFE => ({
    teamId,
    players,
    date: "2025-01-01",
  });

  it("devrait valider des joueurs avec licence A en cadence >= 60 minutes", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A");
    const player2 = createPlayer("p2", "Joueur 2", "A");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur avec licence B en cadence >= 60 minutes", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A");
    const player2 = createPlayer("p2", "Joueur 2", "B");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.4",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'a pas une licence de type A");
  });

  it("devrait détecter un joueur sans licence en cadence >= 60 minutes", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A");
    const player2 = createPlayer("p2", "Joueur 2", "N");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("n'a pas une licence de type A");
  });

  it("ne devrait pas vérifier la licence en cadence < 60 minutes", () => {
    const team = createTeam("team1", false);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "B");
    const player2 = createPlayer("p2", "Joueur 2", "N");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs sans licence A", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "B");
    const player2 = createPlayer("p2", "Joueur 2", "N");
    const player3 = createPlayer("p3", "Joueur 3", "A");
    const teamComposition = createTeamComposition("team1", [player1, player2, player3]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A");
    const teamComposition = createTeamComposition("team1", [player1, null, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = createTeam("team1", true);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
