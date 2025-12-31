import { Player, TeamComposition, TeamInfo } from "../../../types";

export interface PlayerFFE extends Player {
  /**
   * Le type de licence du joueur, A ou B, ou N si non licencié
   */
  licenseType: string;

  /**
   * L'identifiant du club du joueur
   */
  club: string;

  /**
   * La fédération du joueur
   */
  federation: string;
}

export interface TeamFFE extends TeamInfo {
  /**
   * Le ou les clubs (en cas d'entente) qui composent l'équipe
   */
  clubs: string[];

  /**
   * Est-ce que la compétition se joue à une cadence supérieure ou égale à 60 minutes
   * (ou équivalent en cadence Fischer)
   */
  hasAtLeast60Minutes: boolean;
}

export interface TeamCompositionFFE<
  TPlayer extends PlayerFFE = PlayerFFE,
> extends TeamComposition<TPlayer> {
  /**
   * La date de la ronde au format AAAA-MM-JJ
   */
  date: string;
}
