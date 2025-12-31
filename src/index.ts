import type { TournamentState, Player, Violation, Rule, TeamInfo, TeamComposition } from "./types";

/**
 * Valide les équipes d'un tournoi sur une ronde donnée en appliquant les règles définies
 *
 * @param tournamentState L'état des équipes d'un club au sein du tournoi
 * @param currentTeams Les compositions d'équipe à vérifier.
 * @returns Les violations détectées
 */
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
