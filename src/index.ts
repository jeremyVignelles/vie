import type {
  Violation,
  Ruleset,
  TeamInfoWithRuleset,
  TournamentStateOf,
  TeamCompositionOf,
} from "./types";

export * from "./types";

/**
 * Valide les équipes d'un tournoi sur une ronde donnée en appliquant les règles définies
 *
 * @param teams Les équipes participant au tournoi, dans l'ordre de numérotation si cela est important
 * @param tournamentState L'état des équipes d'un club au sein du tournoi
 * @param currentTeams Les compositions d'équipe à vérifier.
 * @returns Les violations détectées
 */
export function validateTeams<TRuleset extends Ruleset<any>>(
  teams: TeamInfoWithRuleset<TRuleset>[],
  tournamentState: TournamentStateOf<TRuleset>,
  currentTeams: TeamCompositionOf<TRuleset>[],
): Violation[] {
  const violations: Violation[] = [];

  for (const team of teams) {
    for (const rule of team.ruleset.rules) {
      const teamViolations = rule.validate(teams, tournamentState, currentTeams, team.id);
      violations.push(...teamViolations);
    }
  }
  return violations;
}
