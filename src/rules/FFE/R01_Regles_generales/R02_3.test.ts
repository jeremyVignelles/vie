import { describe, it, expect } from "vitest";
import rule from "./R02_3";
import { TournamentState } from "../../../types";
import { TeamCompositionFFE } from "./types";
import { makePlayerFFE, makeTeamFFE, makeTeamCompositionFFE } from "./types.fixtures";

describe("R02-3 - Interdiction de jouer plusieurs parties simultanément", () => {
  it("devrait valider une équipe sans joueurs jouant ailleurs le même jour", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
      date: "2025-01-01",
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur jouant dans deux équipes le même jour (currentTeams)", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const team2 = makeTeamFFE({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();
    const player3 = makePlayerFFE();

    const teamComposition1 = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
      date: "2025-01-01",
    });
    const teamComposition2 = makeTeamCompositionFFE({
      teamId: "team2",
      players: [player2, player3],
      date: "2025-01-01",
    });

    const violations = rule.validate(
      [team1, team2],
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
    const team1 = makeTeamFFE({ id: "team1" });
    const team2 = makeTeamFFE({ id: "team2" });

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();

    const historyComposition = makeTeamCompositionFFE({
      teamId: "team2",
      players: [player2],
      date: "2025-01-01",
    });
    const tournamentState: TournamentState<TeamCompositionFFE> = {
      history: { team2: [historyComposition] },
    };

    const teamComposition1 = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
      date: "2025-01-01",
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition1], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R02-3",
      teamId: "team1",
      boardNumber: 2,
    });
  });

  it("ne devrait pas détecter de violation si les matchs sont à des dates différentes", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const team2 = makeTeamFFE({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();

    const teamComposition1 = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
      date: "2025-01-01",
    });
    const teamComposition2 = makeTeamCompositionFFE({
      teamId: "team2",
      players: [player2],
      date: "2025-01-02",
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs jouant simultanément", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const team2 = makeTeamFFE({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();
    const player3 = makePlayerFFE();

    const teamComposition1 = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2, player3],
      date: "2025-01-01",
    });
    const teamComposition2 = makeTeamCompositionFFE({
      teamId: "team2",
      players: [player2, player3],
      date: "2025-01-01",
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(2);
    expect(violations[1].boardNumber).toBe(3);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const team2 = makeTeamFFE({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE();

    const teamComposition1 = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, null, player2],
      date: "2025-01-01",
    });
    const teamComposition2 = makeTeamCompositionFFE({
      teamId: "team2",
      players: [null, player2],
      date: "2025-01-01",
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [teamComposition1, teamComposition2],
      "team1",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamFFE({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1],
      date: "2025-01-01",
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
