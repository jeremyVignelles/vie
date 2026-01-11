import { describe, it, expect } from "vitest";
import rule, { makeCoreRuleValidator } from "./3_7_f";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";

describe("A02-3.7.f - Noyau de l'équipe", () => {
  const createPlayers = (count: number) => {
    return Array.from({ length: count }, () => makePlayerChampionnatFranceClub());
  };

  it("ne devrait pas s'appliquer en ronde 1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = createPlayers(2);

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: 1,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en Top 16", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "T16" });
    const players = createPlayers(16);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 8),
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: players.slice(8, 16),
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N4", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
    const players = createPlayers(16);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 8),
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: players.slice(8, 16),
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec exactement 4 joueurs du noyau en N1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
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
    const newPlayers = createPlayers(4);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [...players.slice(0, 4), ...newPlayers],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une équipe avec moins de 4 joueurs du noyau en N2", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const players = createPlayers(8);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [...players.slice(0, 3), null, null, null, null, null],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe("A02-3.7.f");
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 3 ont déjà joué");
  });

  it("devrait retourner une violation quand seulement 1 joueur du noyau en N3", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
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
    const newPlayers = createPlayers(7);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0], ...newPlayers],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 1 ont déjà joué");
  });

  it("devrait compter correctement avec des null players", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
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
    const newPlayers = createPlayers(3);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [...players.slice(0, 4), ...newPlayers, null],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une violation quand 3 joueurs du noyau sur 8 en N1", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = createPlayers(8);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [...players.slice(0, 3), null, null, null, null, null],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
  });

  it("devrait valider si tous les joueurs sont du noyau", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
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
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider si plus de 4 joueurs du noyau", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
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
    const newPlayers = createPlayers(3);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [...players.slice(0, 5), ...newPlayers],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait retourner vide si roundNumber n'est pas défini", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = createPlayers(2);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [players[0]],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: undefined,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };

    const players = createPlayers(1);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players,
      roundNumber: 2,
    });

    expect(() => {
      rule.validate([team1], tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });

  it("ne devrait pas être influencé par un joueur marqué comme forfeited", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = createPlayers(8);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: [
            players[0],
            players[1],
            players[2],
            { ...players[3], forfeited: true },
            players[4],
            players[5],
            players[6],
            players[7],
          ],
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const newPlayers = createPlayers(4);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [
        players[0],
        players[1],
        { ...players[2], forfeited: true },
        players[3],
        ...newPlayers,
      ],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas être influencé par une équipe marquée comme forfeited", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
    const players = createPlayers(8);

    const history = {
      team1: [
        {
          ...makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players,
            roundNumber: 1,
          }),
          forfeited: true,
        },
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const newPlayers = createPlayers(4);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [...players.slice(0, 4), ...newPlayers],
      roundNumber: 2,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lever une erreur si les joueurs ont joué dans une autre équipe", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "R1" });
    const team2 = makeTeamChampionnatFranceClub({ id: "team2", division: "R2" });
    const players = createPlayers(8);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 4),
          roundNumber: 1,
        }),
      ],
      team2: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team2",
          players: players.slice(4, 8),
          roundNumber: 1,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = [
      makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [players[0], players[4], players[5], players[6]],
        roundNumber: 2,
      }),
      makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [players[1], players[7], null, null],
        roundNumber: 2,
      }),
    ];

    const validator = makeCoreRuleValidator({ R1: 2 });
    const violationsTeam1 = validator([team1, team2], tournamentState, teamComposition, "team1");
    const violationsTeam2 = validator([team1, team2], tournamentState, teamComposition, "team2");

    expect(violationsTeam1).toHaveLength(1);
    expect(violationsTeam1[0].message).toContain("au moins 2 joueurs du noyau");
    expect(violationsTeam1[0].message).toContain("seuls 1 ont déjà joué");

    expect(violationsTeam2).toEqual([]);
  });

  it("devrait construire le noyau à partir des rondes 1 et 2 pour la ronde 3", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
    const players = createPlayers(16);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 8),
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(2, 10),
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0], players[1], players[8], players[9], ...players.slice(10, 14)],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lever une erreur à la ronde 3 si pas assez de joueurs du noyau (rondes 1 et 2)", () => {
    const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const players = createPlayers(16);

    const history = {
      team1: [
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(0, 8),
          roundNumber: 1,
        }),
        makeTeamCompositionChampionnatFranceClub({
          teamId: "team1",
          players: players.slice(8, 16),
          roundNumber: 2,
        }),
      ],
    };

    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history };
    const newPlayers = createPlayers(5);
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [players[0], players[1], players[8], ...newPlayers],
      roundNumber: 3,
    });

    const violations = rule.validate([team1], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 3 ont déjà joué");
  });

  describe("makeCoreRuleValidator avec noyau personnalisé", () => {
    it("devrait valider avec un noyau de 2 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ DIV: 2 });
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "DIV" });
      const players = createPlayers(6);

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
      const newPlayers = createPlayers(4);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 2), ...newPlayers],
        roundNumber: 2,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un noyau de 2 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ DIV: 2 });
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "DIV" });
      const players = createPlayers(6);

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
      const newPlayers = createPlayers(5);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [players[0], ...newPlayers],
        roundNumber: 2,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("au moins 2 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 1 ont déjà joué");
    });

    it("devrait valider avec un noyau de 6 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ ELITE: 6 });
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "ELITE" });
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
      const newPlayers = createPlayers(2);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 6), ...newPlayers],
        roundNumber: 2,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un noyau de 6 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ ELITE: 6 });
      const team1 = makeTeamChampionnatFranceClub({ id: "team1", division: "ELITE" });
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
      const newPlayers = createPlayers(3);
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [...players.slice(0, 5), ...newPlayers],
        roundNumber: 2,
      });

      const violations = customValidator([team1], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("au moins 6 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 5 ont déjà joué");
    });
  });
});
