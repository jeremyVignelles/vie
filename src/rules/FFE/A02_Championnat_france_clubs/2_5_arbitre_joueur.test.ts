import { describe, it, expect } from "vitest";
import rule from "./2_5_arbitre_joueur";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-2.5-arbitre-joueur - Règles arbitre/joueur", () => {
  const createPlayer = (id: string, name: string): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating: 1500,
    gender: "M",
    licenseType: "A",
    club: "club1",
    federation: "FRA",
  });

  const createArbiter = (id: string, name: string): ArbiterFFE => ({
    id,
    name,
    arbiterTitle: "AFC",
  });

  const createTeamInfo = (id: string, division: string): TeamChampionnatFranceClub => ({
    id,
    name: `Team ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId: "group1",
    ruleset: { name: "Test", rules: [] },
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
    arbiter: ArbiterFFE | null = null,
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    arbiter,
    date: "2024-01-01",
  });

  const createTournamentState = (): TournamentState<TeamCompositionChampionnatFranceClub> => ({
    history: {},
  });

  it("devrait valider quand il n'y a pas d'arbitre désigné", () => {
    const teamInfo = createTeamInfo("team1", "N1");
    const tournamentState = createTournamentState();
    const teamComposition = createTeamComposition("team1", [createPlayer("p1", "Player 1")], null);

    const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider quand l'arbitre ne joue pas", () => {
    const teamInfo = createTeamInfo("team1", "N1");
    const tournamentState = createTournamentState();
    const arbiter = createArbiter("a1", "Arbitre 1");
    const teamComposition = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiter,
    );

    const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  describe("Règle N1", () => {
    it("devrait détecter un arbitre qui joue en N1", () => {
      const teamInfo = createTeamInfo("team1", "N1");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };
      const teamComposition = createTeamComposition("team1", [player], arbiter);

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        ruleId: "A02-2.5-arbitre-joueur",
        teamId: "team1",
        boardNumber: null,
      });
      expect(violations[0].message).toContain("En N1");
      expect(violations[0].message).toContain("ne peut pas être joueur");
    });

    it("devrait détecter un arbitre qui joue dans une autre division en N1", () => {
      const team1Info = createTeamInfo("team1", "N1");
      const team2Info = createTeamInfo("team2", "N2");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

      const team1Composition = createTeamComposition(
        "team1",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );
      const team2Composition = createTeamComposition("team2", [player], null);

      const violations = rule.validate(
        [team1Info, team2Info],
        tournamentState,
        [team1Composition, team2Composition],
        "team1",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("En N2");
      expect(violations[0].message).toContain("ne peut pas être joueur");
    });
  });

  describe("Règle N2", () => {
    it("devrait détecter un arbitre qui joue en N2", () => {
      const teamInfo = createTeamInfo("team1", "N2");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };
      const teamComposition = createTeamComposition("team1", [player], arbiter);

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("En N2");
      expect(violations[0].message).toContain("ne peut pas être joueur");
    });
  });

  describe("Règle N3", () => {
    it("devrait valider quand l'arbitre joue dans le match qu'il arbitre", () => {
      const teamInfo = createTeamInfo("team1", "N3");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };
      const teamComposition = createTeamComposition("team1", [player], arbiter);

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un arbitre qui joue dans un autre match en N3", () => {
      const team1Info = createTeamInfo("team1", "N3");
      const team2Info = createTeamInfo("team2", "N3");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

      const team1Composition = createTeamComposition(
        "team1",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );
      const team2Composition = createTeamComposition("team2", [player], null);

      const violations = rule.validate(
        [team1Info, team2Info],
        tournamentState,
        [team1Composition, team2Composition],
        "team1",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("En N3");
      expect(violations[0].message).toContain("ne peut jouer que dans le match qu'il/elle arbitre");
    });
  });

  describe("Règle N4", () => {
    it("devrait valider quand l'arbitre joue en N4 et arbitre max 2 matches", () => {
      const team1Info = createTeamInfo("team1", "N4");
      const team2Info = createTeamInfo("team2", "N4");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

      const team1Composition = createTeamComposition("team1", [player], arbiter);
      const team2Composition = createTeamComposition(
        "team2",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );

      const violations = rule.validate(
        [team1Info, team2Info],
        tournamentState,
        [team1Composition, team2Composition],
        "team1",
      );

      expect(violations).toEqual([]);
    });

    it("devrait détecter un arbitre qui arbitre plus de 2 matches en N4", () => {
      const team1Info = createTeamInfo("team1", "N4");
      const team2Info = createTeamInfo("team2", "N4");
      const team3Info = createTeamInfo("team3", "N4");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

      const team1Composition = createTeamComposition("team1", [player], arbiter);
      const team2Composition = createTeamComposition(
        "team2",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );
      const team3Composition = createTeamComposition(
        "team3",
        [createPlayer("p2", "Player 2")],
        arbiter,
      );

      const violations = rule.validate(
        [team1Info, team2Info, team3Info],
        tournamentState,
        [team1Composition, team2Composition, team3Composition],
        "team1",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("ne peut arbitrer que 2 matches au maximum");
      expect(violations[0].message).toContain("actuellement: 3");
    });

    it("devrait détecter un arbitre qui joue dans une division supérieure à N4", () => {
      const team1Info = createTeamInfo("team1", "N3");
      const team2Info = createTeamInfo("team2", "N4");
      const tournamentState = createTournamentState();
      const arbiter = createArbiter("a1", "Arbitre 1");
      const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

      // L'arbitre joue en N4 (team2) mais arbitre un match en N3 (team1)
      const team1Composition = createTeamComposition(
        "team1",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );
      const team2Composition = createTeamComposition("team2", [player], null);

      const violations = rule.validate(
        [team1Info, team2Info],
        tournamentState,
        [team1Composition, team2Composition],
        "team1",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("ne peut pas jouer dans une division supérieure");
      expect(violations[0].message).toContain("N3");
    });
  });

  it("devrait lever une erreur si l'équipe n'est pas trouvée dans tournamentState", () => {
    const tournamentState = createTournamentState();
    const teamComposition = createTeamComposition("team1", [], null);

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });

  it("devrait lever une erreur si la composition de l'équipe n'est pas trouvée", () => {
    const teamInfo = createTeamInfo("team1", "N1");
    const tournamentState = createTournamentState();

    expect(() => {
      rule.validate([teamInfo], tournamentState, [], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });

  it("devrait détecter une division introuvable pour l'équipe dans laquelle l'arbitre joue", () => {
    const team1Info = createTeamInfo("team1", "N1");
    const tournamentState = createTournamentState();
    const arbiter = createArbiter("a1", "Arbitre 1");
    const player = { ...createPlayer("a1", "Arbitre 1"), id: "a1" };

    const team1Composition = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiter,
    );
    const team2Composition = createTeamComposition("team2", [player], null);

    const violations = rule.validate(
      [team1Info],
      tournamentState,
      [team1Composition, team2Composition],
      "team1",
    );

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("Division introuvable");
  });
});
