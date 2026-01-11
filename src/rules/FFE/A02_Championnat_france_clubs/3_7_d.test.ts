import { describe, it, expect } from "vitest";
import rule from "./3_7_d";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.7.d - Participation dans un même groupe", () => {
  it("devrait valider un joueur qui n'a jamais joué dans une autre équipe du même groupe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const player1 = makePlayerChampionnatFranceClub();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué dans une autre équipe du même groupe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "A02-3.7.d",
      teamId: "team2",
      boardNumber: 1,
    });
    expect(violations[0].message).toContain("a déjà joué dans une autre équipe du même groupe");
    expect(violations[0].message).toContain(player1.name);
  });

  it("devrait autoriser un joueur à jouer dans des équipes de groupes différents", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "B" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait autoriser un joueur à jouer dans des équipes de divisions différentes", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "N2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter plusieurs joueurs en infraction", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();
    const player3 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1, player2],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
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

  it("devrait vérifier dans plusieurs équipes du même groupe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub();

    const historyComposition1 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const historyComposition2 = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {
        team1: [historyComposition1],
        team2: [historyComposition2],
      },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [player1, player2],
    });

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [teamComposition],
      "team3",
    );

    expect(violations).toHaveLength(2);
  });

  it("devrait détecter même après une seule apparition", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
  });

  it("ne devrait détecter qu'une seule violation par joueur même avec plusieurs apparitions", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

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
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait ignorer les positions null dans l'historique", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [null, player1, null],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
  });

  it("devrait ignorer les positions null dans la composition actuelle", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [null, player1, null],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(2);
  });

  it("devrait gérer une équipe sans historique", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });
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
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();
    const player2 = makePlayerChampionnatFranceClub({ name: player1.name }); // Même nom mais ID différent

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team1: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player2],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait vérifier dans toutes les équipes du même groupe, pas seulement la sienne", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", groupId: "A" });

    const player1 = makePlayerChampionnatFranceClub();

    const historyComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: { team2: [historyComposition] },
    };

    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player1],
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
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
