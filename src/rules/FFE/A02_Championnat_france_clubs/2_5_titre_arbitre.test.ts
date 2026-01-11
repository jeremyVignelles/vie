import { describe, it, expect } from "vitest";
import rule, { makeArbiterTitleValidator } from "./2_5_titre_arbitre";
import { TournamentState } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";
import { ArbiterFFE } from "../R01_Regles_generales/types";

describe("A02-2.5-titre-arbitre - Titre de l'arbitre", () => {
  const createPlayer = (id: string, name: string): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating: 1500,
    gender: "M",
    licenseType: "A",
    club: "club1",
    federation: "FRA",
  });

  const createArbiter = (
    id: string,
    name: string,
    arbiterTitle: ArbiterFFE["arbiterTitle"],
  ): ArbiterFFE => ({
    id,
    name,
    arbiterTitle,
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

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
  ): TournamentState<TeamCompositionChampionnatFranceClub> => ({
    history: {},
  });

  const validTitles: ArbiterFFE["arbiterTitle"][] = [
    "AFC",
    "AFO1",
    "AFO2",
    "AFE1",
    "AFE2",
    "AF",
    "AI",
  ];
  const invalidTitles: ArbiterFFE["arbiterTitle"][] = ["AS", "AFJ"];
  const nationalDivisions = ["T16", "N1", "N2", "N3", "N4"];

  describe("Divisions nationales (T16, N1, N2, N3, N4)", () => {
    nationalDivisions.forEach((division) => {
      describe(division, () => {
        validTitles.forEach((title) => {
          it(`devrait valider un arbitre ${title}`, () => {
            const teamInfo = createTeamInfo("team1", division);
            const tournamentState = createTournamentState([teamInfo]);
            const arbiter = createArbiter("a1", "Arbitre 1", title);
            const teamComposition = createTeamComposition(
              "team1",
              [createPlayer("p1", "Player 1")],
              arbiter,
            );

            const violations = rule.validate(
              [teamInfo],
              tournamentState,
              [teamComposition],
              "team1",
            );

            expect(violations).toEqual([]);
          });
        });

        invalidTitles.forEach((title) => {
          it(`devrait rejeter un arbitre ${title}`, () => {
            const teamInfo = createTeamInfo("team1", division);
            const tournamentState = createTournamentState([teamInfo]);
            const arbiter = createArbiter("a1", "Arbitre 1", title);
            const teamComposition = createTeamComposition(
              "team1",
              [createPlayer("p1", "Player 1")],
              arbiter,
            );

            const violations = rule.validate(
              [teamInfo],
              tournamentState,
              [teamComposition],
              "team1",
            );

            expect(violations).toHaveLength(1);
            expect(violations[0]).toMatchObject({
              ruleId: "A02-2.5-titre-arbitre",
              teamId: "team1",
              boardNumber: null,
            });
            expect(violations[0].message).toContain("arbitre fédéral Elite, d'Open ou de Club");
            expect(violations[0].message).toContain(title);
          });
        });

        it("devrait détecter l'absence d'arbitre", () => {
          const teamInfo = createTeamInfo("team1", division);
          const tournamentState = createTournamentState([teamInfo]);
          const teamComposition = createTeamComposition(
            "team1",
            [createPlayer("p1", "Player 1")],
            null,
          );

          const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

          expect(violations).toHaveLength(1);
          expect(violations[0].message).toContain("Aucun arbitre n'est sélectionné");
        });
      });
    });
  });

  describe("Divisions non concernées", () => {
    it("ne devrait pas exiger d'arbitre dans les divisions non nationales", () => {
      const teamInfo = createTeamInfo("team1", "R1");
      const tournamentState = createTournamentState([teamInfo]);
      const teamComposition = createTeamComposition(
        "team1",
        [createPlayer("p1", "Player 1")],
        null,
      );

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider n'importe quel arbitre dans les divisions non nationales", () => {
      const teamInfo = createTeamInfo("team1", "R1");
      const tournamentState = createTournamentState([teamInfo]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AS");
      const teamComposition = createTeamComposition(
        "team1",
        [createPlayer("p1", "Player 1")],
        arbiter,
      );

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
  });

  it("devrait lever une erreur si l'équipe n'est pas trouvée dans tournamentState", () => {
    const tournamentState = createTournamentState([]);
    const teamComposition = createTeamComposition("team1", [], null);
    const teamInfo = createTeamInfo("team1", "R1");

    expect(() => {
      rule.validate([teamInfo], tournamentState, [teamComposition], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });

  it("devrait lever une erreur si la composition de l'équipe n'est pas trouvée", () => {
    const teamInfo = createTeamInfo("team1", "N1");
    const tournamentState = createTournamentState([teamInfo]);

    expect(() => {
      rule.validate([teamInfo], tournamentState, [], "team1");
    }).toThrow("Équipe avec l'identifiant team1 non trouvée");
  });
});

describe("makeArbiterTitleValidator - Fonction utilitaire", () => {
  const createPlayer = (id: string, name: string): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating: 1500,
    gender: "M",
    licenseType: "A",
    club: "club1",
    federation: "FRA",
  });

  const createArbiter = (
    id: string,
    name: string,
    arbiterTitle: ArbiterFFE["arbiterTitle"],
  ): ArbiterFFE => ({
    id,
    name,
    arbiterTitle,
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

  const createTournamentState = (
    teams: TeamChampionnatFranceClub[],
  ): TournamentState<TeamCompositionChampionnatFranceClub> => ({
    history: {},
  });

  it("devrait créer un validateur qui accepte les titres spécifiés", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "test-rule",
    );

    const teamInfo = createTeamInfo("team1", "TEST");
    const tournamentState = createTournamentState([teamInfo]);
    const arbiter = createArbiter("a1", "Arbitre 1", "AF");
    const teamComposition = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiter,
    );

    const violations = validator(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait créer un validateur qui rejette les titres non spécifiés", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "test-rule",
    );

    const teamInfo = createTeamInfo("team1", "TEST");
    const tournamentState = createTournamentState([teamInfo]);
    const arbiter = createArbiter("a1", "Arbitre 1", "AFC");
    const teamComposition = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiter,
    );

    const violations = validator(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("test-rule");
  });

  it("devrait créer un validateur qui ne valide rien si la fonction retourne null", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF"] : null),
      "test-rule",
    );

    const teamInfo = createTeamInfo("team1", "OTHER");
    const tournamentState = createTournamentState([teamInfo]);
    const arbiter = createArbiter("a1", "Arbitre 1", "AS");
    const teamComposition = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiter,
    );

    const violations = validator(tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait utiliser le ruleId par défaut si non spécifié", () => {
    const validator = makeArbiterTitleValidator((division) =>
      division === "TEST" ? ["AF"] : null,
    );

    const teamInfo = createTeamInfo("team1", "TEST");
    const tournamentState = createTournamentState([teamInfo]);
    const teamComposition = createTeamComposition("team1", [createPlayer("p1", "Player 1")], null);

    const violations = validator(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("A02-2.5-titre-arbitre");
  });

  it("devrait détecter l'absence d'arbitre quand la fonction retourne des titres valides", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "custom-rule",
    );

    const teamInfo = createTeamInfo("team1", "TEST");
    const tournamentState = createTournamentState([teamInfo]);
    const teamComposition = createTeamComposition("team1", [createPlayer("p1", "Player 1")], null);

    const violations = validator(tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      ruleId: "custom-rule",
      teamId: "team1",
      boardNumber: null,
    });
    expect(violations[0].message).toContain("Aucun arbitre n'est sélectionné");
  });

  it("devrait permettre différentes validations selon la division", () => {
    const validator = makeArbiterTitleValidator((division) => {
      if (division === "PRO") return ["AF", "AI"];
      if (division === "AMATEUR") return ["AFC", "AFO1", "AFO2"];
      return null;
    }, "flexible-rule");

    const teamInfoPro = createTeamInfo("team1", "PRO");
    const teamInfoAmateur = createTeamInfo("team2", "AMATEUR");
    const tournamentState = createTournamentState([teamInfoPro, teamInfoAmateur]);

    const arbiterAF = createArbiter("a1", "Arbitre Pro", "AF");
    const arbiterAFC = createArbiter("a2", "Arbitre Amateur", "AFC");

    const teamCompoPro = createTeamComposition(
      "team1",
      [createPlayer("p1", "Player 1")],
      arbiterAF,
    );
    const teamCompoAmateur = createTeamComposition(
      "team2",
      [createPlayer("p2", "Player 2")],
      arbiterAFC,
    );

    const violationsPro = validator(tournamentState, [teamCompoPro], "team1");
    const violationsAmateur = validator(tournamentState, [teamCompoAmateur], "team2");

    expect(violationsPro).toEqual([]);
    expect(violationsAmateur).toEqual([]);
  });
});
