import { z } from "zod";
import { ArbiterSchema, PlayerSchema, TeamCompositionSchema, TeamInfoSchema } from "../../../types";

/**
 * Schéma Zod pour un joueur FFE
 */
export const PlayerFFESchema = PlayerSchema.extend({
  /**
   * Le type de licence du joueur, A ou B, ou N si non licencié
   */
  licenseType: z.string(),

  /**
   * L'identifiant du club du joueur
   */
  club: z.string(),

  /**
   * La fédération du joueur
   */
  federation: z.string(),
});

export type PlayerFFE = z.infer<typeof PlayerFFESchema>;

/**
 * Schéma Zod pour une équipe FFE
 */
export const TeamFFESchema = TeamInfoSchema.extend({
  /**
   * Le ou les clubs (en cas d'entente) qui composent l'équipe
   */
  clubs: z.array(z.string()),

  /**
   * Est-ce que la compétition se joue à une cadence supérieure ou égale à 60 minutes
   * (ou équivalent en cadence Fischer)
   */
  hasAtLeast60Minutes: z.boolean(),
});

export type TeamFFE = z.infer<typeof TeamFFESchema>;

/**
 * Schéma Zod pour un arbitre FFE
 */
export const ArbiterFFESchema = ArbiterSchema.extend({
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
  arbiterTitle: z.enum(["AS", "AFJ", "AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"]),
});

export type ArbiterFFE = z.infer<typeof ArbiterFFESchema>;

/**
 * Schéma Zod pour la composition d'une équipe FFE
 */
export const TeamCompositionFFESchema = <
  TPlayer extends PlayerFFE = PlayerFFE,
  TArbiter extends ArbiterFFE = ArbiterFFE,
>(
  playerSchema: z.ZodType<TPlayer> = PlayerFFESchema as z.ZodType<TPlayer>,
  arbiterSchema: z.ZodType<TArbiter> = ArbiterFFESchema as z.ZodType<TArbiter>,
) => {
  return TeamCompositionSchema(playerSchema, arbiterSchema).extend({
    /**
     * La date de la ronde au format AAAA-MM-JJ
     */
    date: z.string(),
  });
};

export type TeamCompositionFFE<
  TPlayer extends PlayerFFE = PlayerFFE,
  TArbiter extends ArbiterFFE = ArbiterFFE,
> = z.infer<ReturnType<typeof TeamCompositionFFESchema<TPlayer, TArbiter>>>;
