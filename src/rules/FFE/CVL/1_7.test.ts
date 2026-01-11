import { describe, it, expect } from "vitest";
import rule from "./1_7";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "../A02_Championnat_france_clubs/types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.fixtures";

describe("CVL-1.7 - Noyau de l'équipe (Nat. IV et Régionales)", () => {
  const createPlayers = (count: number) => {
    return Array.from({ length: count }, () => makePlayerChampionnatFranceClub());
  };

  describe("Nationale IV - Noyau de 3 joueurs minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(4);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
        roundNumber: 1,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec exactement 3 joueurs du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 4),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // 3 core players, 3 new players
      const newPlayers = createPlayers(3);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 3), ...newPlayers],
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe avec seulement 2 joueurs du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 4),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // Only 2 core players, 4 new players (need 3)
      const newPlayers = createPlayers(4);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 2), ...newPlayers],
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 3 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 2 ont déjà joué");
    });

    it("devrait valider avec plus de 3 joueurs du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
      const players = createPlayers(6);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 5),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // 5 core players, 1 new player
      const newPlayers = createPlayers(1);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 5), ...newPlayers],
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 1 - Noyau de 1 joueur minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
        roundNumber: 1,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 2),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // 1 core player, 3 new players
      const newPlayers = createPlayers(3);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [players[0], ...newPlayers],
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe sans joueur du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 2),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // All new players (need at least 1)
      const newPlayers = createPlayers(4);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: newPlayers,
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 1 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 0 ont déjà joué");
    });

    it("devrait valider avec plusieurs joueurs du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
      const players = createPlayers(4);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players,
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // All core players
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  describe("Régionale 2 - Noyau de 1 joueur minimum", () => {
    it("ne devrait pas s'appliquer en ronde 1", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
      const players = createPlayers(4);

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players,
        roundNumber: 1,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider une équipe avec 1 joueur du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
      const players = createPlayers(4);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 2),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // 1 core player, 3 new players
      const newPlayers = createPlayers(3);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [players[0], ...newPlayers],
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une équipe sans joueur du noyau", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
      const players = createPlayers(4);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: players.slice(0, 2),
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // All new players (need at least 1)
      const newPlayers = createPlayers(4);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: newPlayers,
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("CVL-1.7");
      expect(violations[0].boardNumber).toBe(null);
      expect(violations[0].message).toContain("au moins 1 joueurs du noyau");
    });
  });

  describe("Autres divisions", () => {
    it("ne devrait pas s'appliquer en N1", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1", groupId: "A" });
      const players = createPlayers(8);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players,
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // All new players in round 2
      const newPlayers = createPlayers(8);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: newPlayers,
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("ne devrait pas s'appliquer en Top 16", () => {
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16", groupId: "A" });
      const players = createPlayers(8);

      const history = {
        team1: [
          makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players,
            roundNumber: 1,
          }),
        ],
      };

      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
      // All new players in round 2
      const newPlayers = createPlayers(8);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: newPlayers,
        roundNumber: 2,
      });

      const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  it("devrait gérer correctement les joueurs null en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
    const players = createPlayers(6);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 4),
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // 3 core players, 2 new players, 1 null
    const newPlayers = createPlayers(2);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [...players.slice(0, 3), ...newPlayers, null],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas être influencé par un joueur forfeited en R1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const players = createPlayers(4);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [{ ...players[0], forfeited: true }, players[1]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Player 0 (who was forfeited) still counts as core
    const newPlayers = createPlayers(3);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [{ ...players[0], forfeited: false }, ...newPlayers],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait construire le noyau à partir des rondes précédentes en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4", groupId: "A" });
    const players = createPlayers(12);

    // Round 1: players 0-5
    // Round 2: players 3-8 (3,4,5 from round 1, 6,7,8 new)
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 6),
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(3, 9),
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Round 3: 3 players from history, 3 new players
    // Core = 0-8, using players 0, 6, 8 = 3 core players
    const newPlayers = createPlayers(3);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0], players[6], players[8], ...newPlayers],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });
});
