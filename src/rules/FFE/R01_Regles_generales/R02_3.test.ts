import { describe, it, expect } from "vitest";
import rule from "./R02_3";
import { TournamentState } from "../../../types";
import { PlayerFFE, TeamFFE, TeamCompositionFFE, ArbiterFFE } from "./types";

describe("R02-3 - Interdiction de jouer plusieurs parties simultanément", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamFFE[],
    history: Record<string, TeamCompositionFFE[]> = {},
  ): TournamentState<PlayerFFE, TeamFFE, any, ArbiterFFE, TeamCompositionFFE> => ({
    teams,
    history,
  });

  const createTeam = (id: string): TeamFFE => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: false,
    ruleset: mockRuleset,
  });

  const createPlayer = (id: string, name: string): PlayerFFE => ({
    id,
    name,
    licenseType: "A",
    club: "club1",
    federation: "FRA",
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerFFE | null)[],
    date: string,
  ): TeamCompositionFFE => ({
    teamId,
    players,
    date,
    arbiter: null,
  });

  it("devrait valider une équipe sans joueurs jouant ailleurs le même jour", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const teamComposition = createTeamComposition("team1", [player1, player2], "2025-01-01");

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur jouant dans deux équipes le même jour (currentTeams)", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const teamComposition1 = createTeamComposition("team1", [player1, player2], "2025-01-01");
    const teamComposition2 = createTeamComposition("team2", [player2, player3], "2025-01-01");

    const violations = rule.validate(
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R02-3",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("joue déjà dans une autre équipe");
    expect(violations[0].message).toContain("2025-01-01");
  });

  it("devrait détecter un joueur jouant dans l'historique et l'équipe actuelle", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const historyComposition = createTeamComposition("team2", [player2], "2025-01-01");
    const tournamentState = createTournamentState([team1, team2], { team2: [historyComposition] });

    const teamComposition1 = createTeamComposition("team1", [player1, player2], "2025-01-01");

    const violations = rule.validate(tournamentState, [teamComposition1], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R02-3",
      teamId: "team1",
      boardNumber: 2,
    });
  });

  it("ne devrait pas détecter de violation si les matchs sont à des dates différentes", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const teamComposition1 = createTeamComposition("team1", [player1, player2], "2025-01-01");
    const teamComposition2 = createTeamComposition("team2", [player2], "2025-01-02");

    const violations = rule.validate(
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs jouant simultanément", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const teamComposition1 = createTeamComposition(
      "team1",
      [player1, player2, player3],
      "2025-01-01",
    );
    const teamComposition2 = createTeamComposition("team2", [player2, player3], "2025-01-01");

    const violations = rule.validate(
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(2);
    expect(violations[1].boardNumber).toBe(3);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team1 = createTeam("team1");
    const team2 = createTeam("team2");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const teamComposition1 = createTeamComposition("team1", [player1, null, player2], "2025-01-01");
    const teamComposition2 = createTeamComposition("team2", [null, player2], "2025-01-01");

    const violations = rule.validate(
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], "2025-01-01");

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
