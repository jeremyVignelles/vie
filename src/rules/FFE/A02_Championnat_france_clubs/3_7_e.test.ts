import { describe, it, expect } from "vitest";
import rule from "./3_7_e";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.e - Nombre de parties", () => {
  it("devrait valider un joueur qui n'a pas dépassé la limite de rondes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    // History: player1 has played 2 rounds
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 4,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a dépassé la limite en N2 (round 3, already played 3)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    // History: player1 has already played 3 rounds
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 2,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 3,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.e",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 3 rondes");
  });

  it("devrait appliquer la limite de 11 rondes pour le Top 16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub();

    // History: player1 has played 11 rounds
    const history = {
      team1: Array.from({ length: 11 }, (_, i) =>
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: i + 1,
        }),
      ),
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 12,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.e",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 11 rondes");
  });

  it("devrait valider un joueur avec exactement 10 rondes en Top 16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub();

    // History: player1 has played 10 rounds
    const history = {
      team1: Array.from({ length: 10 }, (_, i) =>
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: i + 1,
        }),
      ),
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 11,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait compter les rondes jouées dans toutes les équipes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    // History: player1 has played 2 rounds in team1 and 1 in team2 = 3 total
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 2,
        }),
      ],
      team2: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team2",
          players: [player1],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Trying to play round 3 with 3 rounds already played
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 3,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 rondes");
  });

  it("devrait ignorer les joueurs null", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [null, player1],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait retourner vide si le roundNumber n'est pas défini", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: undefined,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();

    // Both players have played 3 rounds, trying to play round 3
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1, player2],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1, player2],
          roundNumber: 2,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1, player2],
          roundNumber: 3,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      roundNumber: 1,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
