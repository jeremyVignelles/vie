import { describe, it, expect } from "vitest";
import rule from "./1_4";
import { TournamentState } from "../../../types";
import { TeamCompositionFFE } from "./types";
import { makePlayerFFE, makeTeamFFE, makeTeamCompositionFFE } from "./types.fixtures";

describe("R01-1.4 - Licence A pour cadence >= 60 minutes", () => {
  it("devrait valider des joueurs avec licence A en cadence >= 60 minutes", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "A" });
    const player2 = makePlayerFFE({ licenseType: "A" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur avec licence B en cadence >= 60 minutes", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "A" });
    const player2 = makePlayerFFE({ licenseType: "B" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.4",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'a pas une licence de type A");
  });

  it("devrait détecter un joueur sans licence en cadence >= 60 minutes", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "A" });
    const player2 = makePlayerFFE({ licenseType: "N" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("n'a pas une licence de type A");
  });

  it("ne devrait pas vérifier la licence en cadence < 60 minutes", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: false });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "B" });
    const player2 = makePlayerFFE({ licenseType: "N" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs sans licence A", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "B" });
    const player2 = makePlayerFFE({ licenseType: "N" });
    const player3 = makePlayerFFE({ licenseType: "A" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "A" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, null, null],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = makeTeamFFE({ id: "team1", hasAtLeast60Minutes: true });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "A" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
