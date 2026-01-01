import { describe, it, expect } from "vitest";
import rule from "./2_5";
import { TournamentState } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

describe("A02-2.5 - Désignation et statut des arbitres", () => {
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

  const createTeam = (id: string, division: string): TeamChampionnatFranceClub => ({
    id,
    name: `Équipe ${id}`,
    clubs: ["club1"],
    hasAtLeast60Minutes: true,
    division,
    groupId: division + "-1",
    ruleset: mockRuleset,
  });

  const createPlayer = (id: string, name: string, rating: number): PlayerChampionnatFranceClub => ({
    id,
    name,
    rating,
    gender: "M",
    federation: "FRA",
    licenseType: "A",
    club: "club1",
    isFrench: true,
  });

  const createArbiter = (
    id: string,
    name: string,
    title: ArbiterFFE["arbiterTitle"],
  ): ArbiterFFE => ({
    id,
    name,
    arbiterTitle: title,
  });

  const createTeamComposition = (
    teamId: string,
    players: (PlayerChampionnatFranceClub | null)[],
    arbiter: ArbiterFFE | null,
  ): TeamCompositionChampionnatFranceClub => ({
    teamId,
    players,
    date: "2025-01-01",
    arbiter,
  });

  describe("Absence d'arbitre", () => {
    it("devrait générer une violation si aucun arbitre n'est désigné", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);
      const player1 = createPlayer("p1", "Joueur 1", 2300);
      const teamComposition = createTeamComposition("team1", [player1], null);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("Aucun arbitre n'est sélectionné");
    });
  });

  describe("Titre d'arbitre", () => {
    it("devrait accepter un arbitre AFC (Club)", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFC");
      const player1 = createPlayer("p1", "Joueur 1", 2300);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait accepter un arbitre AFO1 (Open niveau 1)", () => {
      const team = createTeam("team1", "N2");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFO1");
      const player1 = createPlayer("p1", "Joueur 1", 2200);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait refuser un arbitre AFJ (non fédéral Club/Open/Elite)", () => {
      const team = createTeam("team1", "N2");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFJ");
      const player1 = createPlayer("p1", "Joueur 1", 2200);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("doit être arbitre fédéral Elite, d'Open ou de Club");
      expect(violations[0].message).toContain("AFJ");
    });

    it("devrait refuser un arbitre AS (Stagiaire)", () => {
      const team = createTeam("team1", "N3");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre Stagiaire", "AS");
      const player1 = createPlayer("p1", "Joueur 1", 2100);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("doit être arbitre fédéral Elite, d'Open ou de Club");
    });
  });

  describe("N1 - Arbitre ne peut pas être joueur", () => {
    it("devrait refuser un arbitre qui joue en N1", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2300);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N1");
      expect(violations[0].message).toContain("ne peut pas être joueur/joueuse");
    });

    it("devrait refuser un arbitre de N2 qui joue dans une autre équipe N1", () => {
      const team1 = createTeam("team1", "N1");
      const team2 = createTeam("team2", "N2");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2300);
      const player2 = createPlayer("p2", "Joueur 2", 2250);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("En N1");
      expect(violations[0].message).toContain("ne peut pas être joueur/joueuse");
    });

    it("devrait accepter un arbitre non-joueur en N1", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFO1");
      const player1 = createPlayer("p1", "Joueur 1", 2300);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("N2 - Arbitre ne peut pas être joueur", () => {
    it("devrait refuser un arbitre qui joue en N2", () => {
      const team = createTeam("team1", "N2");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFO2");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2200);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N2");
      expect(violations[0].message).toContain("ne peut pas être joueur/joueuse");
    });

    it("devrait accepter un arbitre non-joueur en N2", () => {
      const team = createTeam("team1", "N2");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFC");
      const player1 = createPlayer("p1", "Joueur 1", 2200);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("N3 - Arbitre ne peut jouer que dans le match qu'il arbitre", () => {
    it("devrait accepter un arbitre qui joue dans le match qu'il arbitre", () => {
      const team = createTeam("team1", "N3");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2100);
      const player2 = createPlayer("p2", "Joueur 2", 2000);
      const teamComposition = createTeamComposition("team1", [player1, player2], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait refuser un arbitre qui joue dans un autre match N3", () => {
      const team1 = createTeam("team1", "N3");
      const team2 = createTeam("team2", "N3");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2100);
      const player2 = createPlayer("p2", "Joueur 2", 2050);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N3");
      expect(violations[0].message).toContain("ne peut jouer que dans le match qu'il/elle arbitre");
    });

    it("devrait refuser d'arbitrer un match N2 s'il joue en N3", () => {
      const team1 = createTeam("team1", "N3");
      const team2 = createTeam("team2", "N2");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2100);
      const player2 = createPlayer("p2", "Joueur 2", 2200);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N3");
      expect(violations[0].message).toContain("ne peut jouer que dans le match qu'il/elle arbitre");
    });

    it("devrait refuser d'arbitrer un match N4 s'il joue en N3", () => {
      const team1 = createTeam("team1", "N3");
      const team2 = createTeam("team2", "N4");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2100);
      const player2 = createPlayer("p2", "Joueur 2", 2000);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N3");
      expect(violations[0].message).toContain("ne peut jouer que dans le match qu'il/elle arbitre");
    });

    it("devrait accepter un arbitre non-joueur en N3", () => {
      const team = createTeam("team1", "N3");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre 1", "AFO1");
      const player1 = createPlayer("p1", "Joueur 1", 2100);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("N4 - Arbitre peut jouer et arbitrer max 2 matches", () => {
    it("devrait accepter un arbitre qui joue en N4 et arbitre 1 match", () => {
      const team1 = createTeam("team1", "N4");
      const tournamentState = createTournamentState([team1]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);

      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });

    it("devrait accepter un arbitre qui joue en N4 et arbitre 2 matches", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N4");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 1950);

      const teamComposition1 = createTeamComposition("team1", [player1], arbiter);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team1",
      );

      expect(violations).toHaveLength(0);
    });

    it("devrait refuser un arbitre qui joue en N4 et arbitre 3 matches", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N4");
      const team3 = createTeam("team3", "N4");
      const tournamentState = createTournamentState([team1, team2, team3]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 1950);
      const player3 = createPlayer("p3", "Joueur 3", 1900);

      const teamComposition1 = createTeamComposition("team1", [player1], arbiter);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);
      const teamComposition3 = createTeamComposition("team3", [player3], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2, teamComposition3],
        "team1",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("En N4");
      expect(violations[0].message).toContain("ne peut arbitrer que 2 matches au maximum");
      expect(violations[0].message).toContain("3");
    });

    it("devrait refuser un arbitre qui joue en N4 et arbitre un match N3", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N3");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 2100);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe("A02-2.5");
      expect(violations[0].message).toContain("S'il joue en N4");
      expect(violations[0].message).toContain("ne peut pas jouer dans une division supérieure");
      expect(violations[0].message).toContain("N3");
    });

    it("devrait refuser un arbitre qui joue en N4 et arbitre un match N1", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N1");
      const tournamentState = createTournamentState([team1, team2]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 2300);

      const teamComposition1 = createTeamComposition("team1", [player1], null);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2],
        "team2",
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain("S'il joue en N4");
      expect(violations[0].message).toContain("ne peut pas jouer dans une division supérieure");
    });

    it("devrait accepter un arbitre non-joueur en N4 (pas de limite de matches)", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N4");
      const team3 = createTeam("team3", "N4");
      const tournamentState = createTournamentState([team1, team2, team3]);

      const arbiter = createArbiter("a1", "Arbitre", "AFC");
      const player1 = createPlayer("p1", "Joueur 1", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 1950);
      const player3 = createPlayer("p3", "Joueur 3", 1900);

      const teamComposition1 = createTeamComposition("team1", [player1], arbiter);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);
      const teamComposition3 = createTeamComposition("team3", [player3], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2, teamComposition3],
        "team1",
      );

      expect(violations).toHaveLength(0);
    });
  });

  describe("Top 16 - Arbitre non-joueur uniquement", () => {
    it("devrait accepter un arbitre non-joueur en Top 16", () => {
      const team = createTeam("team1", "T16");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("a1", "Arbitre", "AFE2");
      const player1 = createPlayer("p1", "Joueur 1", 2600);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(0);
    });
  });

  describe("Combinaisons de violations", () => {
    it("devrait détecter plusieurs violations (titre invalide + joueur en N1)", () => {
      const team = createTeam("team1", "N1");
      const tournamentState = createTournamentState([team]);
      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFJ");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2300);
      const teamComposition = createTeamComposition("team1", [player1], arbiter);

      const violations = rule.validate(tournamentState, [teamComposition], "team1");

      expect(violations).toHaveLength(2);
      expect(violations[0].message).toContain("doit être arbitre fédéral");
      expect(violations[1].message).toContain("ne peut pas être joueur/joueuse");
    });

    it("devrait détecter plusieurs violations en N4 (trop de matches + division supérieure)", () => {
      const team1 = createTeam("team1", "N4");
      const team2 = createTeam("team2", "N3");
      const team3 = createTeam("team3", "N4");
      const team4 = createTeam("team4", "N4");
      const tournamentState = createTournamentState([team1, team2, team3, team4]);

      const arbiter = createArbiter("p1", "Arbitre Joueur", "AFC");
      const player1 = createPlayer("p1", "Arbitre Joueur", 2000);
      const player2 = createPlayer("p2", "Joueur 2", 2100);
      const player3 = createPlayer("p3", "Joueur 3", 1950);
      const player4 = createPlayer("p4", "Joueur 4", 1900);

      const teamComposition1 = createTeamComposition("team1", [player1], arbiter);
      const teamComposition2 = createTeamComposition("team2", [player2], arbiter);
      const teamComposition3 = createTeamComposition("team3", [player3], arbiter);
      const teamComposition4 = createTeamComposition("team4", [player4], arbiter);

      const violations = rule.validate(
        tournamentState,
        [teamComposition1, teamComposition2, teamComposition3, teamComposition4],
        "team2",
      );

      expect(violations.length).toBeGreaterThan(0);
      expect(violations.some((v) => v.message.includes("division supérieure"))).toBe(true);
    });
  });
});
