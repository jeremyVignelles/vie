import { describe, it, expect } from "vitest";
import rule from "./3_7_j";
import { TournamentState } from "../../../types";
import {
  TeamCompositionChampionnatFranceClub,
} from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.j - Elo en N4 et division inferieure", () => {
  it("ne devrait pas s'appliquer en T16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N3", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur avec Elo <= 2400 en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club1"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2400 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2300 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur avec Elo > 2400 en N4 (avec 2+ équipes en divisions supérieures)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club1"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2401 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2300 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.j",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("Elo supérieur à 2400");
  });

  it("ne devrait pas s'appliquer si moins de 2 équipes en divisions supérieures", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer si aucune équipe en divisions supérieures", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait sanctionner tous les échiquiers suivants", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club1"] });

    const players = [
      makePlayerChampionnatFranceClub({ rating: 2300 }),
      makePlayerChampionnatFranceClub({ rating: 2450 }),
      makePlayerChampionnatFranceClub({ rating: 2300 }),
      makePlayerChampionnatFranceClub({ rating: 2350 }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("devrait considérer les équipes d'entente (clubs multiples)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1", "club2"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club2"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2450 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBeGreaterThan(0);
  });

  it("devrait compter toutes les équipes des divisions supérieures", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club2"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club3"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", clubs: ["club1"] });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1", clubs: ["club1"] });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N2", clubs: ["club1"] });

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const player2 = makePlayerChampionnatFranceClub({ rating: 2450 });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, null, player2, null],
    });

    const violations = rule.validate([team1, team2, team3], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(3);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub({ rating: 2300 });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
