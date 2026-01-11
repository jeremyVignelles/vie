import { describe, it, expect } from "vitest";
import rule from "./1_5";
import { TournamentState } from "../../../types";
import { TeamCompositionFFE } from "./types";
import { makePlayerFFE, makeTeamCompositionFFE } from "./types.fixtures";

describe("R01-1.5 - Interdiction joueurs RUS et BLR", () => {
  it("devrait valider des joueurs de fédérations autorisées", () => {
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "FRA" });
    const player2 = makePlayerFFE({ federation: "USA" });
    const player3 = makePlayerFFE({ federation: "GER" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur russe (RUS)", () => {
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "FRA" });
    const player2 = makePlayerFFE({ federation: "RUS" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

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
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "FRA" });
    const player2 = makePlayerFFE({ federation: "BLR" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

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
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "RUS" });
    const player2 = makePlayerFFE({ federation: "BLR" });
    const player3 = makePlayerFFE({ federation: "FRA" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "FRA" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, null, null],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée dans currentTeams", () => {
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ federation: "FRA" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
