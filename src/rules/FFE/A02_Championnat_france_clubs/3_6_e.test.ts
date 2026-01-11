import { describe, it, expect } from "vitest";
import rule from "./3_6_e";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.6.e - Ordre des joueurs par Elo", () => {
  it("devrait valider une composition avec joueurs en ordre décroissant", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player3 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider des joueurs avec même Elo", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player3 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une différence de 100 points exactement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2100 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player3 = makePlayerChampionnatFranceClub({ rating: 2000 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une différence de plus de 100 points mais avec des joueurs non continus", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2100 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player3 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.e",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("plus de 100 points d'écart");
    expect(violations[0].message).toContain("2100");
    expect(violations[0].message).toContain("2300");
  });

  it("devrait détecter un joueur avec un Elo trop élevé par rapport au précédent", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2450 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.6.e",
      teamId: "team1",
      boardNumber: 2,
    });
    expect(violations[0].message).toContain("plus de 100 points d'écart");
    expect(violations[0].message).toContain("2450");
    expect(violations[0].message).toContain("2300");
  });

  it("devrait détecter plusieurs violations d'ordre", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2350 });
    const player3 = makePlayerChampionnatFranceClub({ rating: 2500 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(2);
    expect(violations[1].boardNumber).toBe(3);
  });

  it("devrait ignorer les positions sans joueur (null)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2200 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait continuer à vérifier après une position vide", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2450 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2],
    });

    const violations = rule.validate([], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
