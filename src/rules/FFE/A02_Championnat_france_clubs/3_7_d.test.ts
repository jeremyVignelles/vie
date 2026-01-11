import { describe, it, expect } from "vitest";
import rule from "./3_7_d";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.d - Participation dans un même groupe", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<TeamCompositionChampionnatFranceClub
  > => ({
    history,
  });

  const createTeam = (
    id: string,
    division: string = "N1",
    groupId: string = "A",
  ): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId,
    ruleset: mockRuleset,
  });

  const createPlayer = (
    id: string,
    name: string,
    rating: number = 2400,
  ): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter: null,
  });

  it("devrait valider un joueur qui n'a jamais joué dans une autre équipe du même groupe", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué dans une autre équipe du même groupe", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const historyComposition = createTeamComposition("team1", [player1, player2]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.d",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué dans une autre équipe du même groupe");
    expect(violations[0].message).toContain("Joueur 1");
  });

  it("devrait autoriser un joueur à jouer dans des équipes de groupes différents", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "B");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team1", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait autoriser un joueur à jouer dans des équipes de divisions différentes", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N2", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team1", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");
    const player3 = createPlayer("p3", "Joueur 3");

    const historyComposition = createTeamComposition("team1", [player1, player2]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1, player2, player3]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait vérifier dans plusieurs équipes du même groupe", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");
    const team3 = createTeam("team3", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const historyComposition1 = createTeamComposition("team1", [player1]);
    const historyComposition2 = createTeamComposition("team2", [player2]);
    const tournamentState = createTournamentState([team1, team2, team3], {
      team1: [historyComposition1],
      team2: [historyComposition2],
    });

    const teamComposition = createTeamComposition("team3", [player1, player2]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team3");

    expect(violations).toHaveLength(2);
  });

  it("devrait détecter même après une seule apparition", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team1", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
  });

  it("ne devrait détecter qu'une seule violation par joueur même avec plusieurs apparitions", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyCompositions = [
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
      createTeamComposition("team1", [player1]),
    ];
    const tournamentState = createTournamentState([team1, team2], { team1: historyCompositions });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait ignorer les positions null dans l'historique", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team1", [null, player1, null]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
  });

  it("devrait ignorer les positions null dans la composition actuelle", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team1", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [null, player1, null]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("devrait gérer une équipe sans historique", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");
    const tournamentState = createTournamentState([team1, team2]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait vérifier l'identité du joueur par ID", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 1"); // Même nom mais ID différent

    const historyComposition = createTeamComposition("team1", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team1: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player2]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait vérifier dans toutes les équipes du même groupe, pas seulement la sienne", () => {
    const team1 = createTeam("team1", "N1", "A");
    const team2 = createTeam("team2", "N1", "A");

    const player1 = createPlayer("p1", "Joueur 1");

    const historyComposition = createTeamComposition("team2", [player1]);
    const tournamentState = createTournamentState([team1, team2], { team2: [historyComposition] });

    const teamComposition = createTeamComposition("team2", [player1]);

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1]);

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
