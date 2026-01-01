import { Arbiter, Player, TeamComposition, TeamInfo } from "../../../types";

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

export interface ArbiterFFE extends Arbiter {
  /**
   * Les titres d'arbitres reconnus par la FFE (dans l'ordre croissant de niveau):
   * - AS: Arbitre Stagiaire
   * - AFJ: Arbitre Fédéral Jeune
   * - AFC: Arbitre Fédéral Club
   * - AFO (1 ou 2): Arbitre Fédéral Open (niveau 1 ou 2)
   * - AFE (1 ou 2): Arbitre Fédéral Élite (niveau 1 ou 2)
   * - AF: Arbitre FIDE
   * - AI: Arbitre International
   */
  arbiterTitle: "AS" | "AFJ" | "AFC" | "AFO1" | "AFO2" | "AFE1" | "AFE2" | "AF" | "AI";
}

export interface TeamCompositionFFE<
  TPlayer extends PlayerFFE = PlayerFFE,
  TArbiter extends ArbiterFFE = ArbiterFFE,
> extends TeamComposition<TPlayer, TArbiter> {
  /**
   * La date de la ronde au format AAAA-MM-JJ
   */
  date: string;
}
