import type { TournamentState, Player, Violation, Rule, TeamInfo, TeamComposition } from "./types";

export function validateTeams<
  TPlayer extends Player,
  TTeam extends TeamInfo<TRules>,
  TRules extends Rule<string, TPlayer, TTeam>[],
  TTeamComposition extends TeamComposition<TPlayer>,
>(
  tournamentState: TournamentState<TPlayer, TTeam, TRules>,
  currentTeams: TTeamComposition[],
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
