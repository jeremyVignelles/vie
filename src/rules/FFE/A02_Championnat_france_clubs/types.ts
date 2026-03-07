import { z } from "zod";
import {
  ArbiterFFE,
  ArbiterFFESchema,
  PlayerFFESchema,
  TeamCompositionFFESchema,
  TeamFFESchema,
} from "../R01_Regles_generales/types";

/**
 * Schéma Zod pour un joueur du championnat de France des clubs
 */
export const PlayerChampionnatFranceClubSchema = PlayerFFESchema.extend({
  /** Le classement elo du joueur (celui à prendre en compte pour la compétition) */
  rating: z.number(),

  /** Le genre du joueur ou de la joueuse */
  gender: z.enum(["M", "F"]),

  /** Est-ce que le joueur a déclaré forfait sur cette partie */
  forfeited: z.boolean().optional(),

  /** Est-ce que le joueur est muté (transféré d'un autre club cette saison) */
  transferred: z.boolean().optional(),

  /**
   * Est-ce que le joueur possède la nationalité française
   */
  isFrench: z.boolean().optional(),

  /**
   * Est-ce que le joueur est qualifié au sens de la règle 3.7.h
   * (ressortissant UE résidant en France, ou extracommunautaire résidant en France depuis 5 ans)
   * Note: Les joueurs français sont automatiquement qualifiés et n'ont pas besoin de ce champ
   */
  isQualifiedResident: z.boolean().optional(),
});

export type PlayerChampionnatFranceClub = z.infer<typeof PlayerChampionnatFranceClubSchema>;

/**
 * Schéma Zod pour une équipe du championnat de France des clubs
 */
export const TeamChampionnatFranceClubSchema = TeamFFESchema.extend({
  /**
   * Division de l'équipe.
   * Valeurs connues, niveau national:
   * - "T16"
   * - "N1"
   * - "N2"
   * - "N3"
   * - "N4"
   */
  division: z.string(),

  /** Identifiant du groupe de l'équipe dans la division */
  groupId: z.string(),
});

export type TeamChampionnatFranceClub = z.infer<typeof TeamChampionnatFranceClubSchema>;

/**
 * Schéma Zod pour la composition d'une équipe du championnat de France des clubs
 */
export const TeamCompositionChampionnatFranceClubSchema = <
  TPlayer extends PlayerChampionnatFranceClub = PlayerChampionnatFranceClub,
  TArbiter extends ArbiterFFE = ArbiterFFE,
>(
  playerSchema: z.ZodType<TPlayer> = PlayerChampionnatFranceClubSchema as unknown as z.ZodType<TPlayer>,
  arbiterSchema: z.ZodType<TArbiter> = ArbiterFFESchema as z.ZodType<TArbiter>,
) => {
  return TeamCompositionFFESchema(playerSchema, arbiterSchema).extend({
    /**
     * Est-ce que la ronde est une ronde de barrage ?
     */
    playoff: z.boolean().optional(),

    /** Est-ce que l'équipe a déclaré forfait sur cette partie */
    forfeited: z.boolean().optional(),

    /**
     * Le numéro de la ronde (commence à 1)
     */
    roundNumber: z.number().optional(),
  });
};

export type TeamCompositionChampionnatFranceClub<
  TPlayer extends PlayerChampionnatFranceClub = PlayerChampionnatFranceClub,
  TArbiter extends ArbiterFFE = ArbiterFFE,
> = z.infer<ReturnType<typeof TeamCompositionChampionnatFranceClubSchema<TPlayer, TArbiter>>>;
