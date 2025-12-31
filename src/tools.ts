import { Player, Rule, Ruleset, TeamInfo } from "./types";
/**
 * Extract the Rule ID from a Rule
 */
export type RuleIdFromRule<T> = T extends Rule<infer TId, Player, TeamInfo> ? TId : never;

/**
 * Filtre un tableau de règles en excluant celles dont l'ID est dans TExclude
 */
export type FilterRules<TRules extends Rule<string>[], TExclude extends string> = TRules extends [
  infer First extends Rule<string>,
  ...infer Rest extends Rule<string>[],
]
  ? First["id"] extends TExclude
    ? FilterRules<Rest, TExclude>
    : [First, ...FilterRules<Rest, TExclude>]
  : [];

/**
 * Crée un ensemble de règles avec le bon type de joueur,
 * c'est à dire l'union des types de joueurs spécifiques
 * en fonction du type des règles fournies.
 *
 * @param name Le nom de l'ensemble de règles
 * @param link Le lien vers le règlement
 * @param rules La liste des règles à inclure
 * @returns
 */
export function makeRuleset<TRules extends Rule<TRulesId>[], TRulesId extends string>(
  name: string,
  link: string | undefined,
  // Trick: spread operator pour garder le tuple et pas le tableau simple : https://stackoverflow.com/a/63891197/2663813
  rules: [...TRules],
): Ruleset<[...TRules]> {
  return {
    name,
    link,
    rules,
  };
}

export function extendRuleset<
  TFrom extends Rule<string>[],
  TExcludedIds extends RuleIdFromRule<TFrom[number]>,
  TNewRules extends Rule<TNewRulesIds>[],
  TNewRulesIds extends string,
>(
  from: Ruleset<[...TFrom]>,
  name: string,
  link: string | undefined,
  excludeIds: [...TExcludedIds[]],
  newRules: [...TNewRules],
): Ruleset<[...FilterRules<TFrom, TExcludedIds>, ...TNewRules]> {
  return {
    name,
    link,
    rules: [
      ...from.rules.filter((rule) => !excludeIds.includes(rule.id as string as TExcludedIds)),
      ...newRules,
    ] as [...FilterRules<TFrom, TExcludedIds>, ...TNewRules],
  };
}
