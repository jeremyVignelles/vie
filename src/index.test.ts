import { describe, it, expect } from "vitest";
import { Player, Rule } from "./types";
import { validateTeams } from "./index";
import { makeRuleset } from "./tools";

interface PlayerWithRating extends Player {
  rating: number;
}

const sampleRuleMaxRating: Rule<PlayerWithRating, "max-rating"> = {
  id: "max-rating",
  description: "The player's rating must not exceed 2000",
  validate(_tournamentState, currentTeams, teamToValidate) {
    const violations = [];
    const team = currentTeams[teamToValidate];
    if (!team) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    for (const [index, player] of team.entries()) {
      if (player.rating >= 2000) {
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

describe("validateTeams", () => {
  it("should validate the team against the rules", () => {
    const ruleset = makeRuleset("Max Rating Ruleset", undefined, [sampleRuleMaxRating]);
    const tournamentState = {
      teams: [
        {
          id: "team-1",
          name: "Team 1",
          ruleset,
        },
      ],
      history: {},
    };

    const validationOK = validateTeams(tournamentState, {
      "team-1": [
        { id: "player-1", name: "Alice", rating: 1800 },
        { id: "player-2", name: "Bob", rating: 1900 },
        { id: "player-3", name: "Charlie", rating: 1957 },
        { id: "player-4", name: "David", rating: 1999 },
      ],
    });

    const validationViolation = validateTeams(tournamentState, {
      "team-1": [
        { id: "player-1", name: "Alice", rating: 2000 },
        { id: "player-2", name: "Bob", rating: 1900 },
        { id: "player-3", name: "Charlie", rating: 1957 },
        { id: "player-4", name: "David", rating: 1999 },
      ],
    });

    expect(validationOK).toHaveLength(0);
    expect(validationViolation).toHaveLength(1);
    expect(validationViolation[0].ruleId).toBe("max-rating");
    expect(validationViolation[0].teamId).toBe("team-1");
    expect(validationViolation[0].boardNumber).toBe(1);
    expect(validationViolation[0].message).toBe(
      `Le joueur Alice (ID: player-1) a un classement de 2000, ce qui dépasse la limite autorisée de 2000.`,
    );
  });
});
