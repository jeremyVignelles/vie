import { describe, it, expect } from "vitest";
import { Player, Rule, TeamInfo } from "./types";
import { validateTeams } from "./index";
import { makeRuleset } from "./tools";

interface PlayerWithRating extends Player {
  rating: number;
}

interface TeamWithPaymentStatus extends TeamInfo {
  hasPaid: boolean;
}

const sampleRuleMaxRating: Rule<"max-rating", PlayerWithRating> = {
  id: "max-rating",
  description: "The player's rating must not exceed 2000",
  validate(_teams, _tournamentState, currentTeams, teamToValidate) {
    const violations = [];
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    if (!teamPlayers) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    for (const [index, player] of teamPlayers.entries()) {
      if (player && player.rating >= 2000) {
        violations.push({
          ruleId: "max-rating",
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) a un classement de ${player.rating}, ce qui dépasse la limite autorisée de 2000.`,
        });
      }
    }

    return violations;
  },
};

const sampleRuleTeamPayment: Rule<"team-payment", Player, TeamWithPaymentStatus> = {
  id: "team-payment",
  description: "The team must have paid the registration fee",
  validate(_teams, _tournamentState, _currentTeams, teamToValidate) {
    const violations = [];
    // This is a placeholder implementation
    // In a real scenario, we would check the payment status of the team
    const teamHasPaid = false; // Placeholder

    if (!teamHasPaid) {
      violations.push({
        ruleId: "team-payment",
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe avec l'identifiant ${teamToValidate} n'a pas payé les frais d'inscription.`,
      });
    }

    return violations;
  },
};

describe("validateTeams", () => {
  it("should validate the team players against the rules", () => {
    const ruleset = makeRuleset("Max Rating Ruleset", undefined, [sampleRuleMaxRating]);
    const teams = [
      {
        id: "team-1",
        name: "Team 1",
        ruleset,
      },
    ];
    const tournamentState = {
      history: {},
    };

    const validationOK = validateTeams(teams, tournamentState, [
      {
        teamId: "team-1",
        arbiter: null,
        players: [
          { id: "player-1", name: "Alice", rating: 1800 },
          { id: "player-2", name: "Bob", rating: 1900 },
          { id: "player-3", name: "Charlie", rating: 1957 },
          { id: "player-4", name: "David", rating: 1999 },
        ],
      },
    ]);

    const validationViolation = validateTeams(teams, tournamentState, [
      {
        teamId: "team-1",
        arbiter: null,
        players: [
          { id: "player-1", name: "Alice", rating: 2000 },
          { id: "player-2", name: "Bob", rating: 1900 },
          { id: "player-3", name: "Charlie", rating: 1957 },
          { id: "player-4", name: "David", rating: 1999 },
        ],
      },
    ]);

    expect(validationOK).toHaveLength(0);
    expect(validationViolation).toHaveLength(1);
    expect(validationViolation[0].ruleId).toBe("max-rating");
    expect(validationViolation[0].teamId).toBe("team-1");
    expect(validationViolation[0].boardNumber).toBe(1);
    expect(validationViolation[0].message).toBe(
      `Le joueur Alice (ID: player-1) a un classement de 2000, ce qui dépasse la limite autorisée de 2000.`,
    );
  });

  it("should validate the team status against the rules", () => {
    const ruleset = makeRuleset("Team Payment Ruleset", undefined, [sampleRuleTeamPayment]);
    const teams = [
      {
        id: "team-2",
        name: "Team 2",
        ruleset,
        hasPaid: false,
      },
    ];
    const tournamentState = {
      history: {},
    };

    const validation = validateTeams(teams, tournamentState, [
      {
        teamId: "team-2",
        arbiter: null,
        players: [
          { id: "player-5", name: "Eve" },
          { id: "player-6", name: "Frank" },
        ],
      },
    ]);
    expect(validation).toHaveLength(1);
    expect(validation[0].ruleId).toBe("team-payment");
    expect(validation[0].teamId).toBe("team-2");
    expect(validation[0].boardNumber).toBeNull();
  });
});
