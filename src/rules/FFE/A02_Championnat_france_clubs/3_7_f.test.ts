import { describe, it, expect } from "vitest";
import rule, { makeCoreRuleValidator } from "./3_7_f";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-3.7.f - Noyau de l'équipe", () => {
  const mockRuleset = { name: "Test", rules: [] };

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
    history: Record<string, TeamCompositionChampionnatFranceClub[]> = {},
  ): TournamentState<
    PlayerChampionnatFranceClub,
    TeamChampionnatFranceClub,
    any,
    ArbiterFFE,
    TeamCompositionChampionnatFranceClub
  > => ({
    teams,
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

  const createPlayers = (count: number, startIndex: number = 1): PlayerChampionnatFranceClub[] => {
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      return createPlayer(`p${index}`, `Joueur ${index}`);
    });
  };

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
    roundNumber?: number,
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    roundNumber,
    arbiter: null,
  });

  it("ne devrait pas s'appliquer en ronde 1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const tournamentState = createTournamentState([team1], {});
    const teamComposition = createTeamComposition("team1", [player1, player2], 1);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en Top 16", () => {
    const team1 = createTeam("team1", "T16", "A");
    const players = createPlayers(16);

    const history = {
      team1: [createTeamComposition("team1", players.slice(0, 8), 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // All new players in round 2
    const teamComposition = createTeamComposition("team1", players.slice(8, 16), 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas s'appliquer en N4", () => {
    const team1 = createTeam("team1", "N4", "A");
    const players = createPlayers(16);

    const history = {
      team1: [createTeamComposition("team1", players.slice(0, 8), 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // All new players in round 2
    const teamComposition = createTeamComposition("team1", players.slice(8, 16), 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider une équipe avec exactement 4 joueurs du noyau en N1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const players = createPlayers(8);

    // Players 1, 2, 3, 4 played in round 1 (core)
    const history = {
      team1: [createTeamComposition("team1", players, 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 4 core players, 4 new players (team of 8)
    const newPlayers = createPlayers(4, 9);
    const teamComposition = createTeamComposition(
      "team1",
      [...players.slice(0, 4), ...newPlayers],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une équipe avec moins de 4 joueurs du noyau en N2", () => {
    const team1 = createTeam("team1", "N2", "A");
    const players = createPlayers(8);

    // Only players 1, 2, 3 played in round 1 (core)
    const history = {
      team1: [
        createTeamComposition("team1", [...players.slice(0, 3), null, null, null, null, null], 1),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 3 core players, 5 new players (need 4 core)
    const teamComposition = createTeamComposition("team1", players, 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe("A02-3.7.f");
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 3 ont déjà joué");
  });

  it("devrait retourner une violation quand seulement 1 joueur du noyau en N3", () => {
    const team1 = createTeam("team1", "N3", "A");
    const players = createPlayers(8);

    // Only player 1 is in the core
    const history = {
      team1: [createTeamComposition("team1", players, 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 1 core (p1), 7 non-core = need at least 4 core (team of 8)
    const newPlayers = createPlayers(7, 9);
    const teamComposition = createTeamComposition("team1", [players[0], ...newPlayers], 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations.length).toBe(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 1 ont déjà joué");
  });

  it("devrait compter correctement avec des null players", () => {
    const team1 = createTeam("team1", "N1", "A");
    const players = createPlayers(8);

    // Players 1-4 are in core
    const history = {
      team1: [createTeamComposition("team1", players, 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 4 core players (p1-p4), 4 non-core, nulls are ignored (8 positions)
    const newPlayers = createPlayers(3, 9);
    const teamComposition = createTeamComposition(
      "team1",
      [...players.slice(0, 4), ...newPlayers, null],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait détecter une violation quand 3 joueurs du noyau sur 8 en N1", () => {
    const team1 = createTeam("team1", "N1", "A");
    const players = createPlayers(8);

    // Only players 1-3 played at round 1
    const history = {
      team1: [
        createTeamComposition("team1", [...players.slice(0, 3), null, null, null, null, null], 1),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 8 players, only 3 from core (need 4)
    const teamComposition = createTeamComposition("team1", players, 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].boardNumber).toBe(null);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
  });

  it("devrait valider si tous les joueurs sont du noyau", () => {
    const team1 = createTeam("team1", "N2", "A");
    const players = createPlayers(8);

    const history = {
      team1: [createTeamComposition("team1", players, 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", players, 2);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider si plus de 4 joueurs du noyau", () => {
    const team1 = createTeam("team1", "N3", "A");
    const players = createPlayers(8);

    const history = {
      team1: [createTeamComposition("team1", players, 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    // 5 core players, 3 new players (team of 8)
    const newPlayers = createPlayers(3, 9);
    const teamComposition = createTeamComposition(
      "team1",
      [...players.slice(0, 5), ...newPlayers],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait retourner vide si roundNumber n'est pas défini", () => {
    const team1 = createTeam("team1", "N1", "A");
    const player1 = createPlayer("p1", "Joueur 1");
    const player2 = createPlayer("p2", "Joueur 2");

    const history = {
      team1: [createTeamComposition("team1", [player1], 1)],
    };

    const tournamentState = createTournamentState([team1], history);
    const teamComposition = createTeamComposition("team1", [player1, player2], undefined);

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lancer une erreur si l'équipe n'est pas trouvée", () => {
    const team1 = createTeam("team1", "N1", "A");
    const tournamentState = createTournamentState([team1]);

    const player1 = createPlayer("p1", "Joueur 1");
    const teamComposition = createTeamComposition("team1", [player1], 2);

    expect(() => {
      rule.validate(tournamentState, [teamComposition], "team999");
    }).toThrow("Équipe avec l'identifiant team999 non trouvée");
  });

  it("ne devrait pas être influencé par un joueur marqué comme forfeited", () => {
    const team1 = createTeam("team1", "N1", "A");
    const players = createPlayers(8);

    // Players 1-4 played in round 1, but player 4 was forfeited
    const history = {
      team1: [
        createTeamComposition(
          "team1",
          [
            players[0],
            players[1],
            players[2],
            { ...players[3], forfeited: true },
            players[4],
            players[5],
            players[6],
            players[7],
          ],
          1,
        ),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 4 core players including the one that was forfeited
    const newPlayers = createPlayers(4, 9);
    const teamComposition = createTeamComposition(
      "team1",
      [players[0], players[1], { ...players[2], forfeited: true }, players[3], ...newPlayers],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("ne devrait pas être influencé par une équipe marquée comme forfeited", () => {
    const team1 = createTeam("team1", "N2", "A");
    const players = createPlayers(8);

    // Team forfeited in round 1, but players still count as core
    const history = {
      team1: [
        {
          ...createTeamComposition("team1", players, 1),
          forfeited: true,
        },
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 2: 4 core players from forfeited round
    const newPlayers = createPlayers(4, 9);
    const teamComposition = createTeamComposition(
      "team1",
      [...players.slice(0, 4), ...newPlayers],
      2,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lever une erreur si les joueurs ont joué dans une autre équipe", () => {
    const team1 = createTeam("team1", "R1", "A");
    const team2 = createTeam("team2", "R2", "A");
    const players = createPlayers(8);

    // Players played for team2 in round 1
    const history = {
      team1: [createTeamComposition("team1", players.slice(0, 4), 1)],
      team2: [createTeamComposition("team2", players.slice(4, 8), 1)],
    };

    const tournamentState = createTournamentState([team1, team2], history);
    // Team1 tries to use these players in round 2
    const teamComposition = [
      createTeamComposition("team1", [players[0], players[4], players[5], players[6]], 2),
      createTeamComposition("team2", [players[1], players[7], null, null], 2),
    ];

    // Validateur, seule la R1 a une règle de noyau à 2 joueurs
    const validator = makeCoreRuleValidator({ R1: 2 });
    const violationsTeam1 = validator(tournamentState, teamComposition, "team1");
    const violationsTeam2 = validator(tournamentState, teamComposition, "team2");

    expect(violationsTeam1).toHaveLength(1);
    expect(violationsTeam1[0].message).toContain("au moins 2 joueurs du noyau");
    expect(violationsTeam1[0].message).toContain("seuls 1 ont déjà joué");

    expect(violationsTeam2).toEqual([]);
  });

  it("devrait construire le noyau à partir des rondes 1 et 2 pour la ronde 3", () => {
    const team1 = createTeam("team1", "N3", "A");
    const players = createPlayers(16);

    // Round 1: players 1-8
    // Round 2: players 3-10 (3,4,5,6,7,8 are from round 1, 9,10 are new)
    const history = {
      team1: [
        createTeamComposition("team1", players.slice(0, 8), 1),
        createTeamComposition("team1", players.slice(2, 10), 2),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 3: players 1,2 (from round 1), 9,10 (from round 2), and 4 new players
    // Core = 1,2,3,4,5,6,7,8,9,10 (10 players total)
    // Using 1,2,9,10 = 4 core players
    const teamComposition = createTeamComposition(
      "team1",
      [players[0], players[1], players[8], players[9], ...players.slice(10, 14)],
      3,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait lever une erreur à la ronde 3 si pas assez de joueurs du noyau (rondes 1 et 2)", () => {
    const team1 = createTeam("team1", "N1", "A");
    const players = createPlayers(16);

    // Round 1: players 1-8
    // Round 2: players 9-16 (all different)
    const history = {
      team1: [
        createTeamComposition("team1", players.slice(0, 8), 1),
        createTeamComposition("team1", players.slice(8, 16), 2),
      ],
    };

    const tournamentState = createTournamentState([team1], history);
    // Round 3: only 3 players from history (1,2,9), rest are new
    // Core = 1-16, using only 3 of them
    const newPlayers = createPlayers(5, 17);
    const teamComposition = createTeamComposition(
      "team1",
      [players[0], players[1], players[8], ...newPlayers],
      3,
    );

    const violations = rule.validate(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("au moins 4 joueurs du noyau");
    expect(violations[0].message).toContain("seuls 3 ont déjà joué");
  });

  describe("makeCoreRuleValidator avec noyau personnalisé", () => {
    it("devrait valider avec un noyau de 2 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ DIV: 2 });
      const team1 = { ...createTeam("team1", "DIV", "A"), division: "DIV" };
      const players = createPlayers(6);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 2 core players, 4 new
      const newPlayers = createPlayers(4, 7);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 2), ...newPlayers],
        2,
      );

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un noyau de 2 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ DIV: 2 });
      const team1 = { ...createTeam("team1", "DIV", "A"), division: "DIV" };
      const players = createPlayers(6);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // Only 1 core player, 5 new (need 2)
      const newPlayers = createPlayers(5, 7);
      const teamComposition = createTeamComposition("team1", [players[0], ...newPlayers], 2);

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("au moins 2 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 1 ont déjà joué");
    });

    it("devrait valider avec un noyau de 6 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ ELITE: 6 });
      const team1 = { ...createTeam("team1", "ELITE", "A"), division: "ELITE" };
      const players = createPlayers(8);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // 6 core players, 2 new
      const newPlayers = createPlayers(2, 9);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 6), ...newPlayers],
        2,
      );

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter une violation avec un noyau de 6 joueurs minimum", () => {
      const customValidator = makeCoreRuleValidator({ ELITE: 6 });
      const team1 = { ...createTeam("team1", "ELITE", "A"), division: "ELITE" };
      const players = createPlayers(8);

      const history = {
        team1: [createTeamComposition("team1", players, 1)],
      };

      const tournamentState = createTournamentState([team1], history);
      // Only 5 core players, 3 new (need 6)
      const newPlayers = createPlayers(3, 9);
      const teamComposition = createTeamComposition(
        "team1",
        [...players.slice(0, 5), ...newPlayers],
        2,
      );

      const violations = customValidator(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("au moins 6 joueurs du noyau");
      expect(violations[0].message).toContain("seuls 5 ont déjà joué");
    });
  });
});
