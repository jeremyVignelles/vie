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

export interface TournamentState<TPlayer extends Player, TRules extends Rule<TPlayer, string>[]> {
  /**
   * Les équipes participant au tournoi
   */
  teams: Team<TRules>[];
  /**
   * L'historique des compositions, pour chaque ronde, indexé par l'identifiant de l'équipe
   */
  history: Record<string, TPlayer[][]>;
}

export interface Rule<TPlayer extends Player, TRuleId extends string> {
  id: TRuleId;
  description: string;
  validate(
    tournamentState: TournamentState<TPlayer, Rule<TPlayer, string>[]>,
    currentTeams: Record<string, TPlayer[]>,
    teamToValidate: string,
  ): Violation[];
}

export interface Ruleset<TRules extends Rule<any, string>[]> {
  /** Le nom affiché de l'ensemble de règles */
  name: string;

  /** Un lien vers la documentation ou la source des règles */
  link?: string;

  /** La liste des règles à appliquer */
  rules: TRules;
}

export interface Team<TRules extends Rule<any, string>[]> {
  /** Identifiant unique de l'équipe */
  id: string;

  /** Nom de l'équipe */
  name: string;

  /** Les règles qui vont s'appliquer à l'équipe */
  ruleset: Ruleset<TRules>;
}
