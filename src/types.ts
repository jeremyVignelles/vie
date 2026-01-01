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
  TPlayer extends Player,
  TTeam extends TeamInfo<TRules>,
  TRules extends Rule<string, TPlayer, TTeam, TArbiter>[],
  TArbiter extends Arbiter = Arbiter,
  TTeamComposition extends TeamComposition<TPlayer, TArbiter> = TeamComposition<TPlayer, TArbiter>,
> {
  /**
   * Les équipes participant au tournoi, dans l'ordre de numérotation si cela est important
   */
  teams: TTeam[];
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
    tournamentState: TournamentState<
      TPlayer,
      TTeamInfo,
      Rule<string, TPlayer, TTeamInfo, TArbiter, TTeamComposition>[],
      TArbiter,
      TTeamComposition
    >,
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

export interface TeamInfo<
  TRules extends Rule<string>[] = Rule<string, Player, TeamInfo<any>, Arbiter>[],
> {
  /** Identifiant unique de l'équipe */
  id: string;

  /** Nom de l'équipe */
  name: string;

  /** Les règles qui vont s'appliquer à l'équipe */
  ruleset: Ruleset<TRules>;
}

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
