import { describe, it, expect } from "vitest";
import rule from "./3_8";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.8 - Forfaits sportifs", () => {
  describe("Top 16", () => {
    it("devrait sanctionner chaque forfait", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const player1 = makePlayerChampionnatFranceClub({ rating: 2500, forfeited: true });
      const player2 = makePlayerChampionnatFranceClub({ rating: 2400, forfeited: false });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player1, player2],
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
    });

    it("devrait sanctionner plusieurs forfaits", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2500, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2400, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2300, forfeited: false }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[1].message).toContain("échiquier 2");
    });

    it("ne devrait pas sanctionner sans forfait", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2500 }),
        makePlayerChampionnatFranceClub({ rating: 2400 }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait sanctionner un joueur null comme forfait", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const player1 = makePlayerChampionnatFranceClub({ rating: 2500 });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player1, null],
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 2");
    });
  });

  describe("N1", () => {
    it("devrait sanctionner chaque forfait", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2300, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2200, forfeited: false }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
    });

    it("devrait sanctionner plusieurs forfaits", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2300, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2200, forfeited: true }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[1].message).toContain("échiquier 2");
    });
  });

  describe("N2", () => {
    it("ne devrait pas sanctionner les 3 premiers forfaits", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });

      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000 }),
            ],
          }),
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000 }),
            ],
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2000 }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait sanctionner à partir du 4e forfait de 100€", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });

      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000 }),
            ],
          }),
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
            ],
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2000 }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-3.8",
        teamId: "team1",
        boardNumber: 1,
      });
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[0].message).toContain("4e forfait");
      expect(violations[0].message).toContain("N2");
    });

    it("devrait sanctionner plusieurs forfaits au-delà du 4e", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });

      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
            ],
          }),
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
            ],
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2100, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[1].boardNumber).toBe(2);
      expect(violations[0].message).toContain("5e forfait");
      expect(violations[1].message).toContain("6e forfait");
    });

    it("devrait compter les joueurs null dans l'historique", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });

      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [null, makePlayerChampionnatFranceClub({ rating: 2000 })],
          }),
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [null, makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true })],
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };

      const player2 = makePlayerChampionnatFranceClub({ rating: 2000 });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [null, player2],
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[0].message).toContain("4e forfait");
    });
  });

  describe("N3", () => {
    it("devrait appliquer les mêmes règles que N2", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });

      const history: Record<string, TeamCompositionChampionnatFranceClub[]> = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [
              makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 1900, forfeited: true }),
              makePlayerChampionnatFranceClub({ rating: 1800, forfeited: true }),
            ],
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };

      const player1 = makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player1],
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].boardNumber).toBe(1);
      expect(violations[0].message).toContain("échiquier 1");
      expect(violations[0].message).toContain("4e forfait");
      expect(violations[0].message).toContain("N3");
    });

    it("ne devrait pas sanctionner avant le 4e forfait", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const players = [
        makePlayerChampionnatFranceClub({ rating: 2000, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 1900, forfeited: true }),
        makePlayerChampionnatFranceClub({ rating: 1800, forfeited: true }),
      ];
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait rien faire pour les divisions N4 ou autres", () => {
      const team = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };

      const player1 = makePlayerChampionnatFranceClub({ rating: 1800, forfeited: true });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player1],
      });

      const violations = rule.validate([team], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });
});
