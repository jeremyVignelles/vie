import { describe, it, expect } from "vitest";
import rule from "./3_7_b";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.b - Force des équipes", () => {
  it("devrait valider une équipe plus faible qu'une équipe précédente", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const strongPlayer1 = makePlayerChampionnatFranceClub({ rating: 2500 });
    const strongPlayer2 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const weakPlayer1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const weakPlayer2 = makePlayerChampionnatFranceClub({ rating: 2200 });

    const strongTeamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [strongPlayer1, strongPlayer2],
    });
    const weakTeamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [weakPlayer1, weakPlayer2],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [strongTeamComposition, weakTeamComposition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait détecter une équipe plus forte qu'une équipe censée être plus forte", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const weakPlayer1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const weakPlayer2 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const strongPlayer1 = makePlayerChampionnatFranceClub({ rating: 2500 });
    const strongPlayer2 = makePlayerChampionnatFranceClub({ rating: 2400 });

    const weakTeamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [weakPlayer1, weakPlayer2],
    });
    const strongTeamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [strongPlayer1, strongPlayer2],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [weakTeamComposition, strongTeamComposition],
      "team2",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.b",
      teamId: "team2",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("censée être plus faible");
    expect(violations[0].message).toContain("team1");
  });

  it("devrait valider des équipes avec des Elo identiques", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1a = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2300 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b],
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer les forfaits comme Elo = 0", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1a = makePlayerChampionnatFranceClub({ rating: 2400, forfeited: true });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2100 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b],
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer les positions null comme Elo = 0", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1a = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2100 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, null],
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait comparer avec l'historique si l'équipe plus forte n'est pas dans currentTeams", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1a = makePlayerChampionnatFranceClub({ rating: 2500 });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2200 });

    const team1HistoryComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [team1HistoryComposition] },
    };

    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait utiliser la dernière composition de l'historique", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1a = makePlayerChampionnatFranceClub({ rating: 2500 });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2200 });

    const oldComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player2a, player2b],
    });
    const latestComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [oldComposition, latestComposition] },
    };

    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait signaler une erreur si l'équipe plus forte n'a pas de composition", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player2a = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2200 });

    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate([team1, team2], tournamentState, [team2Composition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.b",
      teamId: "team2",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("composition de l'équipe plus forte");
    expect(violations[0].message).toContain("team1");
  });

  it("ne devrait pas vérifier la première équipe du tournoi", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1a = makePlayerChampionnatFranceClub({ rating: 2500 });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2400 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b],
    });

    const violations = rule.validate([team1], tournamentState, [team1Composition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait comparer avec plusieurs équipes plus fortes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const strongPlayer1 = makePlayerChampionnatFranceClub({ rating: 2500 });
    const strongPlayer2 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const mediumPlayer1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const mediumPlayer2 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const weakPlayer1 = makePlayerChampionnatFranceClub({ rating: 2100 });
    const weakPlayer2 = makePlayerChampionnatFranceClub({ rating: 2000 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [strongPlayer1, strongPlayer2],
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [mediumPlayer1, mediumPlayer2],
    });
    const team3Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [weakPlayer1, weakPlayer2],
    });

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [team1Composition, team2Composition, team3Composition],
      "team3",
    );

    expect(violations).toEqual([]);
  });

  it("devrait gérer différentes longueurs d'équipes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1a = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player1b = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player1c = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player2a = makePlayerChampionnatFranceClub({ rating: 2100 });
    const player2b = makePlayerChampionnatFranceClub({ rating: 2000 });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1a, player1b, player1c],
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2a, player2b],
    });

    const violations = rule.validate(
      [team1, team2],
      tournamentState,
      [team1Composition, team2Composition],
      "team2",
    );

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
