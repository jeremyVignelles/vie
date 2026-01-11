import { describe, it, expect } from "vitest";
import rule from "./3_6_a";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.6.a - Pas de trous dans la composition", () => {
  it("devrait valider une composition sans trous", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition avec des positions vides à la fin", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, null, null],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un trou dans la composition", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.a",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("trou dans la composition");
  });

  it("devrait détecter un trou avec plusieurs joueurs après", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2, player3],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait détecter le premier joueur après un trou", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, null, null, player2],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(5);
  });

  it("devrait valider une équipe vide", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [null, null, null],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition qui commence par des positions vides", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [null, null, null],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un trou après plusieurs joueurs", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();
    const player4 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3, null, player4],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(5);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
