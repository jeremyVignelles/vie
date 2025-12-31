import type { TournamentState, Player, Violation, Rule } from "./types";

export function validateTeams<TPlayer extends Player, TRules extends Rule<TPlayer, string>[]>(
  tournamentState: TournamentState<TPlayer, TRules>,
  currentTeams: Record<string, TPlayer[]>,
): Violation[] {
  const violations: Violation[] = [];

  for (const team of tournamentState.teams) {
    for (const rule of team.ruleset.rules) {
      const teamViolations = rule.validate(tournamentState, currentTeams, team.id);
      violations.push(...teamViolations);
    }
  }
  return violations;
}

/**
 * Main entry point for the vie library
 * This is a skeleton implementation that will be filled in later
 */
export function placeholder(): string {
  return "vie library - to be implemented";
}

// Export version info
export const VERSION = "1.0.0";
