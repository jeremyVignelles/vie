import { describe, it, expect } from "vitest";
import rule from "./3_7_c";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.test";

describe("A02-3.7.c - Participation dans plusieurs équipes", () => {
  it("devrait valider un joueur qui n'a jamais joué dans une équipe plus forte", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait valider un joueur qui a joué 2 fois dans une équipe plus forte", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();

    const historyComposition1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const historyComposition2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition1, historyComposition2] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué 3 fois dans une équipe plus forte", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub({ name: "Joueur 1" });
    const player2 = makePlayerChampionnatFranceClub();

    const historyComposition1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const historyComposition2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const historyComposition3 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition1, historyComposition2, historyComposition3] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.c",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 3 fois");
    expect(violations[0].message).toContain("Joueur 1");
  });

  it("devrait détecter un joueur qui a joué plus de 3 fois dans une équipe plus forte", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyCompositions = [
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
    ];
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: historyCompositions },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.c",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué 5 fois");
  });

  it("devrait compter les participations dans plusieurs équipes plus fortes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyTeam1_1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const historyTeam1_2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const historyTeam2_1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {
        team1: [historyTeam1_1, historyTeam1_2],
        team2: [historyTeam2_1],
      },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [player1],
    });

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [teamComposition],
      "team3",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 fois");
  });

  it("devrait ignorer les équipes plus faibles", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyTeam3_1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [player1],
    });
    const historyTeam3_2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [player1],
    });
    const historyTeam3_3 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [player1],
    });

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team3: [historyTeam3_1, historyTeam3_2, historyTeam3_3] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();

    const historyCompositions = [
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1, player2] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1, player2] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1, player2] }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: historyCompositions },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1, player2, player3],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait ignorer les positions null dans l'historique", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyCompositions = [
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1, null] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [null, player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: historyCompositions },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué 3 fois");
  });

  it("devrait ignorer les positions null dans la composition actuelle", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyCompositions = [
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: historyCompositions },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [null, player1, null],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("ne devrait pas vérifier la première équipe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait gérer une équipe plus forte sans historique", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait vérifier l'identité du joueur par ID", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2" });

    const player1 = makePlayerChampionnatFranceClub({ id: "p1", name: "Joueur 1" });
    const player2 = makePlayerChampionnatFranceClub({ id: "p2", name: "Joueur 1" });

    const historyCompositions = [
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
      makeTeamCompositionChampionnatFranceClub({ teamId: "team1", players: [player1] }),
    ];

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: historyCompositions },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
