import { describe, it, expect } from "vitest";
import rule, { makeTransferredRuleValidator } from "./3_7_g";
import { TournamentState } from "../../../types";
import {
  TeamCompositionChampionnatFranceClub,
} from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.g - Joueuses et joueurs mutés", () => {

  it("devrait valider une équipe avec 3 joueurs mutés ou moins (équipe de plus de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 4 joueurs mutés (équipe de plus de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 3 joueurs mutés");
  });

  it("devrait valider une équipe avec 2 joueurs mutés ou moins (équipe de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 3 joueurs mutés (équipe de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
  });

  it("devrait retourner une seule violation d'équipe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub({ transferred: true }),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("dépassé le quota de 2 joueurs mutés");
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub({ transferred: true }),
      null,
      makePlayerChampionnatFranceClub({ transferred: true }),
      null,
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe sans joueurs mutés", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = [makePlayerChampionnatFranceClub({ transferred: true })];
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });

  describe("makeTransferredRuleValidator avec configurations personnalisées", () => {
    it("devrait permettre de créer un validateur avec un quota fixe", () => {
      const customValidator = makeTransferredRuleValidator(() => 1, "CUSTOM-RULE");
      const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
      const players = [
        makePlayerChampionnatFranceClub({ transferred: true }),
        makePlayerChampionnatFranceClub(),
        makePlayerChampionnatFranceClub(),
        makePlayerChampionnatFranceClub(),
      ];

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un quota fixe dépassé", () => {
      const customValidator = makeTransferredRuleValidator(() => 1, "CUSTOM-RULE");
      const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
      const players = [
        makePlayerChampionnatFranceClub({ transferred: true }),
        makePlayerChampionnatFranceClub({ transferred: true }),
        makePlayerChampionnatFranceClub(),
        makePlayerChampionnatFranceClub(),
      ];

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CUSTOM-RULE");
    });

    it("devrait permettre de filtrer par division", () => {
      const customValidator = makeTransferredRuleValidator(
        () => 0,
        "DIVISION-SPECIFIC",
        (division) => division === "N1",
      );
      const team1N1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
      const team2N2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N2" });
      const players = [
        makePlayerChampionnatFranceClub({ transferred: true }),
        makePlayerChampionnatFranceClub(),
      ];

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
      const teamComposition1 = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });
      const teamComposition2 = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players,
      });

      const violations1 = customValidator([team1N1, team2N2], tournamentState, [teamComposition1], "team1");
      expect(violations1).toHaveLength(1);

      const violations2 = customValidator([team1N1, team2N2], tournamentState, [teamComposition2], "team2");
      expect(violations2).toEqual([]);
    });
  });
});
