import { describe, it, expect } from "vitest";
import rule from "./3_7_k";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.7.k - Matchs de barrage", () => {
  it("ne devrait pas s'appliquer aux matchs non-playoff", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub();

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: false,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué dans la même division", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué dans une division inférieure", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N3" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team2: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team2",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui n'a jamais joué dans la nationale concernée ou inférieure", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.k",
      teamId: "team1",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("n'a pas joué au moins une fois");
  });

  it("devrait détecter un joueur qui a seulement joué dans une division supérieure", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N1" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team2: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team2",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("n'a pas joué au moins une fois");
  });

  it("devrait valider un joueur dans un playoff de T16 qui a joué en T16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur dans un playoff de N4 qui a joué en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs non éligibles", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player3],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2, player3],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait gérer les joueurs null correctement", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [null, player1, null],
      playoff: true,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait compter les apparitions dans toutes les équipes de la division ou inférieure", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N2", groupId: "B" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "N3" });
    const player1 = makePlayerChampionnatFranceClub();

    const history = {
      team3: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team3",
          players: [player1],
          playoff: false,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [teamComposition],
      "team1",
    );

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
      playoff: true,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
