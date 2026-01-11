import { describe, it, expect } from "vitest";
import rule from "./2_5_arbitre_joueur";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";
import { makeArbiterFFE } from "../R01_Regles_generales/types.fixtures";

describe("A02-2.5-arbitre-joueur - Règles arbitre/joueur", () => {
  it("devrait valider quand il n'y a pas d'arbitre désigné", () => {
    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub()],
      arbiter: null,
    });

    const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait valider quand l'arbitre ne joue pas", () => {
    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = { history: {} };
    const arbiter = makeArbiterFFE();
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub()],
      arbiter,
    });

    const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  describe("Règle N1", () => {
    it("devrait détecter un arbitre qui joue en N1", () => {
      const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player],
        arbiter,
      });

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
      const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
      const team2Info = makeTeamChampionnatFranceClub({ id: "team2", division: "N2" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

      const team1Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });
      const team2Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [player],
      });

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
      const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N2" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player],
        arbiter,
      });

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("En N2");
      expect(violations[0].message).toContain("ne peut pas être joueur");
    });
  });

  describe("Règle N3", () => {
    it("devrait valider quand l'arbitre joue dans le match qu'il arbitre", () => {
      const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player],
        arbiter,
      });

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait détecter un arbitre qui joue dans un autre match en N3", () => {
      const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
      const team2Info = makeTeamChampionnatFranceClub({ id: "team2", division: "N3" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

      const team1Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });
      const team2Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [player],
      });

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
      const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
      const team2Info = makeTeamChampionnatFranceClub({ id: "team2", division: "N4" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

      const team1Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player],
        arbiter,
      });
      const team2Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });

      const violations = rule.validate(
        [team1Info, team2Info],
        tournamentState,
        [team1Composition, team2Composition],
        "team1",
      );

      expect(violations).toEqual([]);
    });

    it("devrait détecter un arbitre qui arbitre plus de 2 matches en N4", () => {
      const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N4" });
      const team2Info = makeTeamChampionnatFranceClub({ id: "team2", division: "N4" });
      const team3Info = makeTeamChampionnatFranceClub({ id: "team3", division: "N4" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

      const team1Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [player],
        arbiter,
      });
      const team2Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });
      const team3Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team3",
        players: [makePlayerChampionnatFranceClub({ id: "p2", name: "Player 2" })],
        arbiter,
      });

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
      const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N3" });
      const team2Info = makeTeamChampionnatFranceClub({ id: "team2", division: "N4" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
      const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

      // L'arbitre joue en N4 (team2) mais arbitre un match en N3 (team1)
      const team1Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });
      const team2Composition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team2",
        players: [player],
      });

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
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [],
    });

    expect(() => {
      rule.validate([], tournamentState, [teamComposition], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });

  it("devrait lever une erreur si la composition de l'équipe n'est pas trouvée", () => {
    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    expect(() => {
      rule.validate([teamInfo], tournamentState, [], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });

  it("devrait détecter une division introuvable pour l'équipe dans laquelle l'arbitre joue", () => {
    const team1Info = makeTeamChampionnatFranceClub({ id: "team1", division: "N1" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1" });
    const player = makePlayerChampionnatFranceClub({ id: "a1", name: "Arbitre 1" });

    const team1Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      arbiter,
    });
    const team2Composition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [player],
    });

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
