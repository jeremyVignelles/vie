import { PlayerFFE, TeamFFE } from "../R01_Regles_generales/types";

export interface PlayerChampionnatFranceClub extends PlayerFFE {
  /** Le classement elo du joueur (celui à prendre en compte pour la compétition) */
  rating: number;

  /** Le genre du joueur ou de la joueuse */
  gender: "M" | "F";
}

export interface TeamChampionnatFranceClub extends TeamFFE {
  /**
   * Division de l'équipe.
   * Valeurs connues, niveau national:
   * - "T16"
   * - "N1"
   * - "N2"
   * - "N3"
   * - "N4"
   */
  division: string;
}
