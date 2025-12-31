import { PlayerFFE, TeamCompositionFFE, TeamFFE } from "../R01_Regles_generales/types";

export interface PlayerChampionnatFranceClub extends PlayerFFE {
  /** Le classement elo du joueur (celui à prendre en compte pour la compétition) */
  rating: number;

  /** Le genre du joueur ou de la joueuse */
  gender: "M" | "F";

  /** Est-ce que le joueur a déclaré forfait sur cette partie */
  forfeited?: boolean;
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

export interface TeamCompositionChampionnatFranceClub<
  TPlayer extends PlayerChampionnatFranceClub = PlayerChampionnatFranceClub,
> extends TeamCompositionFFE<TPlayer> {
  /**
   * Est-ce que la ronde est une ronde de barrage ?
   */
  playoff?: boolean;

  /** Est-ce que l'équipe a déclaré forfait sur cette partie */
  forfeited?: boolean;
}
