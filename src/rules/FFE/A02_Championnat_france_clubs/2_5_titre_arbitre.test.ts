import { describe, it, expect } from "vitest";
import rule, { makeArbiterTitleValidator } from "./2_5_titre_arbitre";
import { TournamentState } from "../../../types";
import { TeamCompositionChampionnatFranceClub } from "./types";
import {
  makePlayerChampionnatFranceClub,
  makeTeamChampionnatFranceClub,
  makeTeamCompositionChampionnatFranceClub,
} from "./types.fixtures";
import { makeArbiterFFE } from "../R01_Regles_generales/types.fixtures";

describe("A02-2.5-titre-arbitre - Titre de l'arbitre", () => {
  const validTitles = ["AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"] as const;
  const invalidTitles = ["AS", "AFJ"] as const;
  const nationalDivisions = ["T16", "N1", "N2", "N3", "N4"];

  describe("Divisions nationales (T16, N1, N2, N3, N4)", () => {
    nationalDivisions.forEach((division) => {
      describe(division, () => {
        validTitles.forEach((title) => {
          it(`devrait valider un arbitre ${title}`, () => {
            const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division });
            const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
              history: {},
            };
            const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: title });
            const teamComposition = makeTeamCompositionChampionnatFranceClub({
              teamId: "team1",
              players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
              arbiter,
            });

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
            const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division });
            const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
              history: {},
            };
            const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: title });
            const teamComposition = makeTeamCompositionChampionnatFranceClub({
              teamId: "team1",
              players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
              arbiter,
            });

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
          const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division });
          const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
            history: {},
          };
          const teamComposition = makeTeamCompositionChampionnatFranceClub({
            teamId: "team1",
            players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
          });

          const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

          expect(violations).toHaveLength(1);
          expect(violations[0].message).toContain("Aucun arbitre n'est sélectionné");
        });
      });
    });
  });

  describe("Divisions non concernées", () => {
    it("ne devrait pas exiger d'arbitre dans les divisions non nationales", () => {
      const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "R1" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      });

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });

    it("devrait valider n'importe quel arbitre dans les divisions non nationales", () => {
      const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "R1" });
      const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
        history: {},
      };
      const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: "AS" });
      const teamComposition = makeTeamCompositionChampionnatFranceClub({
        teamId: "team1",
        players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
        arbiter,
      });

      const violations = rule.validate([teamInfo], tournamentState, [teamComposition], "team1");

      expect(violations).toEqual([]);
    });
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
});

describe("makeArbiterTitleValidator - Fonction utilitaire", () => {
  it("devrait créer un validateur qui accepte les titres spécifiés", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "test-rule",
    );

    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "TEST" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: "AF" });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      arbiter,
    });

    const violations = validator([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait créer un validateur qui rejette les titres non spécifiés", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "test-rule",
    );

    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "TEST" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: "AFC" });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      arbiter,
    });

    const violations = validator([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("test-rule");
  });

  it("devrait créer un validateur qui ne valide rien si la fonction retourne null", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF"] : null),
      "test-rule",
    );

    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "OTHER" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const arbiter = makeArbiterFFE({ id: "a1", name: "Arbitre 1", arbiterTitle: "AS" });
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      arbiter,
    });

    const violations = validator([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toEqual([]);
  });

  it("devrait utiliser le ruleId par défaut si non spécifié", () => {
    const validator = makeArbiterTitleValidator((division) =>
      division === "TEST" ? ["AF"] : null,
    );

    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "TEST" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
    });

    const violations = validator([teamInfo], tournamentState, [teamComposition], "team1");

    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("A02-2.5-titre-arbitre");
  });

  it("devrait détecter l'absence d'arbitre quand la fonction retourne des titres valides", () => {
    const validator = makeArbiterTitleValidator(
      (division) => (division === "TEST" ? ["AF", "AI"] : null),
      "custom-rule",
    );

    const teamInfo = makeTeamChampionnatFranceClub({ id: "team1", division: "TEST" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };
    const teamComposition = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
    });

    const violations = validator([teamInfo], tournamentState, [teamComposition], "team1");

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

    const teamInfoPro = makeTeamChampionnatFranceClub({ id: "team1", division: "PRO" });
    const teamInfoAmateur = makeTeamChampionnatFranceClub({ id: "team2", division: "AMATEUR" });
    const tournamentState: TournamentState<TeamCompositionChampionnatFranceClub> = {
      history: {},
    };

    const arbiterAF = makeArbiterFFE({ id: "a1", name: "Arbitre Pro", arbiterTitle: "AF" });
    const arbiterAFC = makeArbiterFFE({ id: "a2", name: "Arbitre Amateur", arbiterTitle: "AFC" });

    const teamCompoPro = makeTeamCompositionChampionnatFranceClub({
      teamId: "team1",
      players: [makePlayerChampionnatFranceClub({ id: "p1", name: "Player 1" })],
      arbiter: arbiterAF,
    });
    const teamCompoAmateur = makeTeamCompositionChampionnatFranceClub({
      teamId: "team2",
      players: [makePlayerChampionnatFranceClub({ id: "p2", name: "Player 2" })],
      arbiter: arbiterAFC,
    });

    const violationsPro = validator([teamInfoPro], tournamentState, [teamCompoPro], "team1");
    const violationsAmateur = validator(
      [teamInfoAmateur],
      tournamentState,
      [teamCompoAmateur],
      "team2",
    );

    expect(violationsPro).toEqual([]);
    expect(violationsAmateur).toEqual([]);
  });
});
