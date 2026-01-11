export interface Violation {
  /** L'identifiant unique de la règle qui a échoué */
  ruleId: string;
  /** L'identifiant unique de l'équipe en faute */
  teamId: string;

  /** Le numéro de la table (commence à 1) où la violation a eu lieu, ou null si c'est toute l'équipe. */
  boardNumber: number | null;

  /**
   * Un message décrivant la violation
   */
  message: string;
}

export interface Player {
  /**
   * Le code FFE du joueur pour les tournois de la fédération française des échecs
   */
  id: string;

  /** Le nom complet du joueur */
  name: string;
}

export interface Arbiter {
  /**
   * Le code FFE de l'arbitre pour les tournois de la fédération française des échecs
   */
  id: string;

  /** Le nom complet de l'arbitre */
  name: string;
}

export interface TournamentState<
  TTeamComposition extends TeamComposition<Player, Arbiter> = TeamComposition<Player, Arbiter>,
> {
  /**
   * L'historique des compositions, pour chaque ronde, indexé par l'identifiant de l'équipe
   */
  history: Record<string, TTeamComposition[]>;
}

export interface Rule<
  TRuleId extends string,
  TPlayer extends Player = Player,
  TTeamInfo extends TeamInfo = TeamInfo,
  TArbiter extends Arbiter = Arbiter,
  TTeamComposition extends TeamComposition<TPlayer, TArbiter> = TeamComposition<TPlayer, TArbiter>,
> {
  id: TRuleId;
  description: string;
  validate(
    teams: TTeamInfo[],
    tournamentState: TournamentState<TTeamComposition>,
    currentTeams: TTeamComposition[],
    teamToValidate: string,
  ): Violation[];
}

export interface Ruleset<TRules extends Rule<string>[]> {
  /** Le nom affiché de l'ensemble de règles */
  name: string;

  /** Un lien vers la documentation ou la source des règles */
  link?: string;

  /** La liste des règles à appliquer */
  rules: TRules;
}

export interface TeamInfo {
  /** Identifiant unique de l'équipe */
  id: string;

  /** Nom de l'équipe */
  name: string;
}

export type TeamInfoWithRuleset<TRuleset extends Ruleset<any>> = TeamInfoOf<TRuleset> & {
  /** Les règles qui vont s'appliquer à l'équipe */
  ruleset: TRuleset;
};

export interface TeamComposition<
  TPlayer extends Player = Player,
  TArbiter extends Arbiter = Arbiter,
> {
  /** L'identifiant unique de l'équipe */
  teamId: string;

  /**
   * La liste des joueurs alignés pour cette équipe, ou null en cas d'absent.
   * Il doit y avoir autant de cases dans le tableau que de joueurs prévus dans l'équipe
   * par le règlement.
   */
  players: (TPlayer | null)[];

  /**
   * L'arbitre désigné pour cette équipe, ou null si aucun n'est désigné.
   */
  arbiter: TArbiter | null;
}

/**
 * Type utilitaire générique pour extraire une position spécifique des paramètres de type de Rule
 */
type ExtractFromRule<
  TRule extends Rule<string>,
  TPosition extends "player" | "teamInfo" | "arbiter" | "teamComposition",
> = TPosition extends "player"
  ? TRule extends Rule<string, infer P>
    ? P
    : never
  : TPosition extends "teamInfo"
    ? TRule extends Rule<string, any, infer TI>
      ? TI
      : never
    : TPosition extends "arbiter"
      ? TRule extends Rule<string, any, any, infer A>
        ? A
        : never
      : TPosition extends "teamComposition"
        ? TRule extends Rule<string, any, any, any, infer TC>
          ? TC
          : never
        : never;

type RulesOrRuleset = Rule<string>[] | Ruleset<any>;

/**
 * Parcourt récursivement un Ruleset ou tableau de règles et extrait l'union des types à la position spécifiée
 */
export type ExtractFromRules<
  TRules extends RulesOrRuleset,
  TPosition extends "player" | "teamInfo" | "arbiter" | "teamComposition",
> =
  TRules extends Ruleset<infer R>
    ? ExtractFromRules<R, TPosition>
    : TRules extends [infer First extends Rule<string>, ...infer Rest]
      ? Rest extends Rule<string>[]
        ? ExtractFromRule<First, TPosition> & ExtractFromRules<Rest, TPosition>
        : ExtractFromRule<First, TPosition>
      : ExtractFromRule<Rule<string>, TPosition>;

export type PlayersOf<TRules extends RulesOrRuleset> = ExtractFromRules<TRules, "player">;

export type TeamInfoOf<TRules extends RulesOrRuleset> = ExtractFromRules<TRules, "teamInfo">;

export type ArbiterOf<TRules extends RulesOrRuleset> = ExtractFromRules<TRules, "arbiter">;

export type TeamCompositionOf<TRules extends RulesOrRuleset> = ExtractFromRules<
  TRules,
  "teamComposition"
>;

export type TournamentStateOf<TRules extends RulesOrRuleset> = TournamentState<
  TeamCompositionOf<TRules>
>;
