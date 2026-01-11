import { describe, it, expect } from "vitest";
import rule from "./1_6";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "../A02_Championnat_france_clubs/types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types.fixtures";

describe("CVL-1.6 - Interdiction de jouer dans plusieurs équipes de même division", () => {
  const createPlayers = (count: number) => {
    return Array.from({ length: count }, () => makePlayerChampionnatFranceClub());
  };

  it("devrait valider un joueur qui n'a jamais joué dans une autre équipe de la même division", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1", groupId: "B" });
    const players = createPlayers(4);

    // Players 0-1 played for team1 in round 1
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[1]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team2 uses different players (2-3)
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[2], players[3]],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur qui a joué dans une autre équipe de la même division", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1", groupId: "B" });
    const players = createPlayers(4);
    players[0] = makePlayerChampionnatFranceClub({ name: "Joueur 1" });

    // Player 0 played for team1 in round 1
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[1]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team2 tries to use player 0 in round 2
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[0], players[2], players[3]],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("CVL-1.6");
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[0].message).toContain("Joueur 1");
    expect(violations[0].message).toContain(
      "a déjà joué dans une autre équipe de la même division",
    );
  });

  it("devrait détecter plusieurs joueurs ayant joué dans une autre équipe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R2", groupId: "B" });
    const players = createPlayers(6);

    // Players 0-3 played for team1
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
    // Team2 tries to use players 0 and 1
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[0], players[1], players[4], players[5]],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait autoriser un joueur à jouer dans une autre équipe d'une division différente", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R2", groupId: "A" });
    const players = createPlayers(4);

    // Player 0 played for team1 in R1
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[1]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team2 (R2) uses player 0 - this should be allowed (different division)
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[0], players[2], players[3]],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait autoriser un joueur à jouer dans la même équipe à plusieurs reprises", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const players = createPlayers(4);

    // Player 0 played for team1 in rounds 1 and 2
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[1]],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[2]],
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Player 0 plays again for team1 in round 3
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0], players[3]],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait gérer correctement les joueurs null", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1", groupId: "B" });
    const players = createPlayers(2);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], null],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team2 with null players
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [null, players[1], null],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toEqual([]);
  });

  it("devrait détecter un joueur même s'il a joué dans plusieurs rondes de l'autre équipe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1", groupId: "B" });
    const players = createPlayers(4);

    // Player 0 played for team1 in rounds 1 and 2
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[1]],
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[2]],
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team2 tries to use player 0 in round 3
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[0], players[3]],
      roundNumber: 3,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(1);
  });

  it("devrait vérifier parmi toutes les équipes de la même division", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R2", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R2", groupId: "B" });
    const team3 = makeTeamChampionnatFranceClub({ id: "team3", division: "R2", groupId: "C" });
    const players = createPlayers(6);

    // Player 0 played for team1, player 1 played for team2
    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0], players[3]],
          roundNumber: 1,
        }),
      ],
      team2: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team2",
          players: [players[1], players[4]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    // Team3 tries to use players 0 and 1
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team3",
      players: [players[0], players[1], players[5]],
      roundNumber: 2,
    });

    const violations = rule.validate(
      [team1, team2, team3],
      tournamentState,
      [teamComposition],
      "team3",
    );

    expect(violations).toHaveLength(2);
    expect(violations[0].boardNumber).toBe(1);
    expect(violations[1].boardNumber).toBe(2);
  });

  it("devrait détecter une violation même si le joueur était forfeited", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R1", groupId: "B" });
    const players = createPlayers(2);

    // Player 0 played for team1 but was forfeited
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
    // Team2 tries to use player 0
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [players[0]],
      roundNumber: 2,
    });

    const violations = rule.validate([team1, team2], tournamentState, [teamComposition], "team2");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("a déjà joué dans une autre équipe");
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1", groupId: "A" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = createPlayers(1);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0]],
      roundNumber: 2,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });
});
