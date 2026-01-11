import { describe, it, expect } from "vitest";
import rule from "./1_1";
import { TournamentState } from "../../../types";
import { makePlayerFFE, makeTeamFFE, makeTeamCompositionFFE } from "./types.test";
import { TeamCompositionFFE } from "./types";

describe("R01-1.1 - Licence et club", () => {
  it("devrait valider une équipe avec des joueurs licenciés du même club", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club1"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ club: "club1" });
    const player2 = makePlayerFFE({ club: "club1", licenseType: "B" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur non licencié (type N)", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club-test"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const player2 = makePlayerFFE({ licenseType: "N" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.1",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("n'a pas de licence");
  });

  it("devrait détecter un joueur d'un autre club", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club1"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ club: "club1" });
    const player2 = makePlayerFFE({ club: "club2" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "R01-1.1",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("ne fait pas partie du club");
  });

  it("devrait accepter les joueurs de clubs en entente", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club1", "club2"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ club: "club1" });
    const player2 = makePlayerFFE({ club: "club2" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs violations", () => {
    const team = makeTeamFFE({ id: "team1", clubs: ["club1"] });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE({ licenseType: "N", club: "club2" });
    const player2 = makePlayerFFE({ club: "club1" });
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].message).toContain("n'a pas de licence");
    expect(violations[1].message).toContain("ne fait pas partie du club");
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team = makeTeamFFE({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const teamComposition = makeTeamCompositionFFE({
      teamId: "team1",
      players: [player1, null, null],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = makeTeamFFE({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionFFE> = { history: {} };

    const player1 = makePlayerFFE();
    const teamComposition = makeTeamCompositionFFE({ teamId: "team1", players: [player1] });

    expect(() => {
      rule.validate([team], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
