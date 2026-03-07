import z from "zod";
import type {
  Violation,
  Ruleset,
  TeamInfoWithRuleset,
  TournamentStateOf,
  TeamCompositionOf,
  PlayersOf,
  TeamInfoOf,
  ArbiterOf,
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

export function makeCombinedSchemaForRulesets<TRulesets extends Ruleset<any>[]>(
  ...rulesets: [...TRulesets]
): {
  player: z.ZodType<PlayersOf<TRulesets[number]>>;
  teamInfo: z.ZodType<TeamInfoOf<TRulesets[number]>>;
  arbiter: z.ZodType<ArbiterOf<TRulesets[number]>>;
  teamComposition: z.ZodType<TeamCompositionOf<TRulesets[number]>>;
} {
  const allRules = rulesets.flatMap((r) => r.rules);

  const playerSchemas = allRules.map((rule) => rule.schemas.player);
  const teamInfoSchemas = allRules.map((rule) => rule.schemas.teamInfo);
  const arbiterSchemas = allRules.map((rule) => rule.schemas.arbiter);
  const teamCompositionSchemas = allRules.map((rule) => rule.schemas.teamComposition);

  return {
    player: playerSchemas.reduce(
      (acc, schema) => z.looseObject({ ...acc.shape, ...schema.shape }),
      z.looseObject({}),
    ),
    teamInfo: teamInfoSchemas.reduce(
      (acc, schema) => z.looseObject({ ...acc.shape, ...schema.shape }),
      z.looseObject({}),
    ),
    arbiter: arbiterSchemas.reduce(
      (acc, schema) => z.looseObject({ ...acc.shape, ...schema.shape }),
      z.looseObject({}),
    ),
    teamComposition: teamCompositionSchemas.reduce(
      (acc, schema) => z.looseObject({ ...acc.shape, ...schema.shape }),
      z.looseObject({}),
    ),
  };
}
