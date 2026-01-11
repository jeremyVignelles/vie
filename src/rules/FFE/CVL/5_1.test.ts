import { describe, expect, it } from "vitest";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "../A02_Championnat_france_clubs/types";
import {
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.fixtures";
import { makeArbiterFFE } from "../R01_Regles_generales/types.fixtures";
import rule from "./5_1";

describe("CVL-5.1 - Titre d'arbitre Régionales 1 & 2", () => {
  const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
  it("devrait accepter un arbitre stagiaire (AS) en R1", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AS" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre stagiaire (AS) en R2", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R2" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AS" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral club (AFC) en R1", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AFC" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral open 1 (AFO1) en R2", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R2" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AFO1" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral elite (AFE1) en R1", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AFE1" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre international (AI) en R2", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R2" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AI" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("devrait rejeter un arbitre fédéral jeune (AFJ) en R1", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AFJ" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: team.id,
      boardNumber: null,
    });
    expect(violations[0].message).toContain("AFJ");
  });

  it("devrait rejeter un arbitre sans titre en R2", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R2" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "NONE" as any }), // Titre non valide
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: team.id,
      boardNumber: null,
    });
  });

  it("devrait rejeter l'absence d'arbitre en R1", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: null,
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: team.id,
      boardNumber: null,
    });
    expect(violations[0].message).toContain("Aucun arbitre");
  });

  it("devrait rejeter l'absence d'arbitre en R2", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R2" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: null,
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: team.id,
      boardNumber: null,
    });
  });

  it("ne devrait pas appliquer de contraintes en R3", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R3" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: null,
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("ne devrait pas appliquer de contraintes en R4", () => {
    const team = makeTeamChampionnatFranceClub({ division: "R4" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: makeArbiterFFE({ arbiterTitle: "AFJ" }),
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });

  it("ne devrait pas appliquer de contraintes en divisions nationales", () => {
    const team = makeTeamChampionnatFranceClub({ division: "N1" });
    const composition = makeTeamCompositionChampionnatFranceClub({
      teamId: team.id,
      arbiter: null,
    });

    const violations = rule.validate([team], tournamentState, [composition], team.id);

    expect(violations).toEqual([]);
  });
});
