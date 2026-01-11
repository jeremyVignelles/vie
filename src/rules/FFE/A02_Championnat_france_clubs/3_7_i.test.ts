import { describe, it, expect } from "vitest";
import rule from "./3_7_i";
import { TournamentState } from "../../../types";
import {
  TeamCompositionChampionnatFranceClub,
} from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.i - Nationalité française", () => {

  it("devrait valider une équipe avec un joueur français et une joueuse française en T16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F" });
    const player3 = makePlayerChampionnatFranceClub({ gender: "M", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec un joueur français et une joueuse française en N1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F" });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec un joueur français et une joueuse française en N2", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F" });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N3", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M", isFrench: false });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M", isFrench: false });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter l'absence de joueur français", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "F" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "M", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.i",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("au moins un joueur de nationalité française");
  });

  it("devrait détecter l'absence de joueuse française", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.i",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("au moins une joueuse de nationalité française");
  });

  it("devrait détecter l'absence des deux (joueur et joueuse français)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M", isFrench: false });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F", isFrench: false });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].message).toContain("joueur de nationalité française");
    expect(violations[1].message).toContain("joueuse de nationalité française");
  });

  it("devrait sanctionner au dernier échiquier", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = [
      makePlayerChampionnatFranceClub({ gender: "M", isFrench: false }),
      makePlayerChampionnatFranceClub({ gender: "M", isFrench: false }),
      makePlayerChampionnatFranceClub({ gender: "M", isFrench: false }),
      makePlayerChampionnatFranceClub({ gender: "M", isFrench: false }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[1].boardNumber).toBe(null);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const player2 = makePlayerChampionnatFranceClub({ gender: "F" });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2, null],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait accepter plusieurs joueurs et joueuses français", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const players = [
      makePlayerChampionnatFranceClub({ gender: "M" }),
      makePlayerChampionnatFranceClub({ gender: "M" }),
      makePlayerChampionnatFranceClub({ gender: "F" }),
      makePlayerChampionnatFranceClub({ gender: "F" }),
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
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub({ gender: "M" });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
