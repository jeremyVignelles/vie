import { describe, it, expect } from "vitest";
import rule from "./1_1";
import { TournamentState } from "../../../types";
import { PlayerFFE, TeamFFE, TeamCompositionFFE } from "./types";

describe("R01-1.1 - Licence et club", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamFFE[],
  ): TournamentState<PlayerFFE, TeamFFE, any, TeamCompositionFFE> => ({
    teams,
    history: {},
  });

  const createTeam = (id: string, clubs: string[]): TeamFFE => ({
    id,
    name: `Équipe ${id}`,
    clubs,
    hasAtLeast60Minutes: false,
    ruleset: mockRuleset,
  });

  const createPlayer = (
    id: string,
    name: string,
    licenseType: string,
    club: string,
  ): PlayerFFE => ({
    id,
    name,
    licenseType,
    club,
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

  it("devrait valider une équipe avec des joueurs licenciés du même club", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const player2 = createPlayer("p2", "Joueur 2", "B", "club1");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur non licencié (type N)", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const player2 = createPlayer("p2", "Joueur 2", "N", "club1");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.1",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'a pas de licence");
  });

  it("devrait détecter un joueur d'un autre club", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const player2 = createPlayer("p2", "Joueur 2", "A", "club2");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.1",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("ne fait pas partie du club");
  });

  it("devrait accepter les joueurs de clubs en entente", () => {
    const team = createTeam("team1", ["club1", "club2"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const player2 = createPlayer("p2", "Joueur 2", "A", "club2");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs violations", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "N", "club2");
    const player2 = createPlayer("p2", "Joueur 2", "A", "club1");
    const teamComposition = createTeamComposition("team1", [player1, player2]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].message).toContain("n'a pas de licence");
    expect(violations[1].message).toContain("ne fait pas partie du club");
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const teamComposition = createTeamComposition("team1", [player1, null, null]);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = createTeam("team1", ["club1"]);
    const tournamentState = createTournamentState([team]);

    const player1 = createPlayer("p1", "Joueur 1", "A", "club1");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
