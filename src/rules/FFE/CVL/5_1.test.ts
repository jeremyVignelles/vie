import { describe, expect, it } from "vitest";
import { TournamentState } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import rule from "./5_1";

const mockRuleset = { name: "Test", rules: [] };

const createTournamentState = (): TournamentState<TeamCompositionChampionnatFranceClub> => ({
  history: {},
});

const createTeamInfo = (division: string): TeamChampionnatFranceClub => ({
  id: "team1",
  name: "Équipe 1",
  clubs: ["Club A"],
  division,
  groupId: "groupe1",
  hasAtLeast60Minutes: true,
  ruleset: mockRuleset,
});

const createComposition = (
  arbiterTitle: ArbiterFFE["arbiterTitle"] | null,
): TeamCompositionChampionnatFranceClub[] => [
  {
    teamId: "team1",
    arbiter: arbiterTitle
      ? {
          id: "arbiter1",
          name: "Arbitre Test",
          arbiterTitle,
        }
      : null,
    players: [],
    playoff: false,
    date: "2025-01-01",
  },
];

describe("CVL-5.1 - Titre d'arbitre Régionales 1 & 2", () => {
  it("devrait accepter un arbitre stagiaire (AS) en R1", () => {
    const teamInfo = createTeamInfo("R1");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AS");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre stagiaire (AS) en R2", () => {
    const teamInfo = createTeamInfo("R2");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AS");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral club (AFC) en R1", () => {
    const teamInfo = createTeamInfo("R1");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AFC");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral open 1 (AFO1) en R2", () => {
    const teamInfo = createTeamInfo("R2");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AFO1");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre fédéral elite (AFE1) en R1", () => {
    const teamInfo = createTeamInfo("R1");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AFE1");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter un arbitre international (AI) en R2", () => {
    const teamInfo = createTeamInfo("R2");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AI");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("devrait rejeter un arbitre fédéral jeune (AFJ) en R1", () => {
    const teamInfo = createTeamInfo("R1");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AFJ");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("AFJ");
  });

  it("devrait rejeter un arbitre sans titre en R2", () => {
    const teamInfo = createTeamInfo("R2");
    const tournamentState = createTournamentState();
    const compositions: TeamCompositionChampionnatFranceClub[] = [
      {
        teamId: "team1",
        arbiter: {
          id: "arbiter1",
          name: "Arbitre Test",
          arbiterTitle: "NONE" as any, // Titre non valide
        },
        players: [],
        playoff: false,
        date: "2025-01-01",
      },
    ];

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: "team1",
      boardNumber: null,
    });
  });

  it("devrait rejeter l'absence d'arbitre en R1", () => {
    const teamInfo = createTeamInfo("R1");
    const tournamentState = createTournamentState();
    const compositions = createComposition(null);

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("Aucun arbitre");
  });

  it("devrait rejeter l'absence d'arbitre en R2", () => {
    const teamInfo = createTeamInfo("R2");
    const tournamentState = createTournamentState();
    const compositions = createComposition(null);

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "CVL-5.1",
      teamId: "team1",
      boardNumber: null,
    });
  });

  it("ne devrait pas appliquer de contraintes en R3", () => {
    const teamInfo = createTeamInfo("R3");
    const tournamentState = createTournamentState();
    const compositions = createComposition(null);

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas appliquer de contraintes en R4", () => {
    const teamInfo = createTeamInfo("R4");
    const tournamentState = createTournamentState();
    const compositions = createComposition("AFJ");

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas appliquer de contraintes en divisions nationales", () => {
    const teamInfo = createTeamInfo("N1");
    const tournamentState = createTournamentState();
    const compositions = createComposition(null);

    const violations = rule.validate([teamInfo], tournamentState, compositions, "team1");

    expect(violations).toEqual([]);
  });
});
