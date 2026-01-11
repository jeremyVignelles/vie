import { describe, it, expect } from "vitest";
import rule, { makeQualifiedRuleValidator } from "./3_7_h";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.7.h - Nationalité étrangère", () => {
  it("devrait valider une équipe avec 5 joueurs qualifiés (équipe de plus de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 4 étrangers (équipe de 8, besoin de 5 qualifiés)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 5 joueurs");
  });

  it("devrait valider une équipe avec 4 joueurs qualifiés (équipe de 6)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un dépassement avec 3 étrangers (équipe de 6, besoin de 4 qualifiés)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs");
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
  });

  it("devrait accepter les résidents UE et long terme comme qualifiés", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const players = [
      makePlayerChampionnatFranceClub(),
      null,
      makePlayerChampionnatFranceClub(),
      null,
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBeGreaterThan(0);
  });

  it("devrait valider une équipe avec tous les joueurs qualifiés", () => {
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

    const players = [makePlayerChampionnatFranceClub({ isQualifiedResident: true })];
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});

describe("makeQualifiedRuleValidator - Validateur personnalisé", () => {
  it("devrait utiliser un nombre fixe de joueurs qualifiés requis (3)", () => {
    const customValidator = makeQualifiedRuleValidator(() => 3, "CUSTOM-RULE");

    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(0);
  });

  it("devrait détecter une violation avec nombre fixe de joueurs qualifiés (3 requis, 2 fournis)", () => {
    const customValidator = makeQualifiedRuleValidator(() => 3, "CUSTOM-RULE");

    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("CUSTOM-RULE");
    expect(violations[0].message).toContain("2 sur 3 requis");
  });

  it("devrait appliquer un filtre de division", () => {
    const customValidator = makeQualifiedRuleValidator(
      () => 3,
      "CUSTOM-RULE",
      (division) => ["N4", "R1"].includes(division),
    );

    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const teamComposition1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });
    const teamComposition2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players,
    });

    const violations1 = customValidator(
      [team1, team2],
      tournamentState,
      [teamComposition1],
      "team1",
    );
    expect(violations1).toHaveLength(1);

    const violations2 = customValidator(
      [team1, team2],
      tournamentState,
      [teamComposition2],
      "team2",
    );
    expect(violations2).toHaveLength(0);
  });

  it("devrait utiliser la division dans le calcul du nombre minimum", () => {
    const customValidator = makeQualifiedRuleValidator(
      (teamSize, division) => (division === "N4" ? 4 : 3),
      "CUSTOM-RULE",
    );

    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = [
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub(),
      makePlayerChampionnatFranceClub({ isFrench: false, isQualifiedResident: false }),
    ];

    const teamComposition1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });
    const teamComposition2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players,
    });

    const violations1 = customValidator(
      [team1, team2],
      tournamentState,
      [teamComposition1],
      "team1",
    );
    expect(violations1).toHaveLength(1);
    expect(violations1[0].message).toContain("3 sur 4 requis");

    const violations2 = customValidator(
      [team1, team2],
      tournamentState,
      [teamComposition2],
      "team2",
    );
    expect(violations2).toHaveLength(0);
  });
});
