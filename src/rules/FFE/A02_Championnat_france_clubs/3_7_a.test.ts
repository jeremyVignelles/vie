import { describe, it, expect } from "vitest";
import rule from "./3_7_a";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.7.a - Règles Top 16", () => {
  it("devrait ignorer les équipes qui ne sont pas en Top 16", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 1800 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une composition Top 16 correcte", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500, gender: "M", isFrench: true });
    const player2 = makePlayerChampionnatFranceClub({ rating: 1800, gender: "F", isFrench: true });
    const player3 = makePlayerChampionnatFranceClub({
      rating: 2300,
      gender: "M",
      isFrench: false,
      federation: "GER",
    });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur avec Elo < 2000 (non joueuse française obligatoire)", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500, gender: "M", isFrench: true });
    const player2 = makePlayerChampionnatFranceClub({ rating: 1800, gender: "F", isFrench: true });
    const player3 = makePlayerChampionnatFranceClub({
      rating: 1900,
      gender: "M",
      isFrench: false,
      federation: "GER",
    });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.a",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("n'a pas le classement Elo minimum requis de 2000");
  });

  it("devrait accepter la meilleure joueuse française avec Elo < 2000 comme joueuse obligatoire", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500, gender: "M", isFrench: true });
    const player2 = makePlayerChampionnatFranceClub({ rating: 1800, gender: "F", isFrench: true });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait sanctionner une deuxième joueuse française avec Elo < 2000", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500, gender: "M", isFrench: true });
    const player2 = makePlayerChampionnatFranceClub({
      name: "Joueuse 2",
      rating: 2100,
      gender: "F",
      isFrench: true,
    });
    const player3 = makePlayerChampionnatFranceClub({
      name: "Joueuse 3",
      rating: 1800,
      gender: "F",
      isFrench: true,
    });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.a",
      teamId: "team1",
      boardNumber: 3,
    });
    expect(violations[0].message).toContain("Joueuse 3");
  });

  it("devrait détecter plusieurs violations", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({
      rating: 1900,
      gender: "M",
      isFrench: false,
      federation: "GER",
    });
    const player2 = makePlayerChampionnatFranceClub({
      rating: 1800,
      gender: "F",
      isFrench: false,
      federation: "GER",
    });
    const player3 = makePlayerChampionnatFranceClub({
      rating: 1700,
      gender: "M",
      isFrench: false,
      federation: "GER",
    });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    // 3 violations pour les Elo < 2000
    expect(violations).toHaveLength(3);
  });

  it("devrait gérer les positions vides (null)", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500, gender: "M", isFrench: true });
    const player2 = makePlayerChampionnatFranceClub({ rating: 1800, gender: "F", isFrench: true });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2],
    });

    const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
