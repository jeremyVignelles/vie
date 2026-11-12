import { makeRule } from "../../../types";
import { makeTransferredRuleValidator } from "../A02_Championnat_france_clubs/3_7_g";
import { TeamChampionnatFranceClubSchema } from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.7.4";

/**
 * Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1 (Régionales 1 & 2 - CVL) joueurs mutés.
 */
export default makeRule(
  id,
  `
  Joueurs mutés: Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1
  (Régionales 1 & 2 - CVL) joueurs mutés. En cas d'infraction, forfait administratif sur le
  premier échiquier concerné et tous ceux qui le suivent. Un joueur est considéré comme
  muté s’il entre dans le cadre de l’article 2.2 des Règles Générales (R01) en cours
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  makeTransferredRuleValidator(
    (_totalPositions, division) => {
      // N4: max 2 joueurs mutés
      // R1 et R2: max 1 joueur muté
      if (division === "N4") {
        return 2;
      }
      if (division === "R1" || division === "R2") {
        return 1;
      }
      // Autres divisions non concernées par cette règle
      return Infinity;
    },
    id,
    (division) => division === "N4" || division === "R1" || division === "R2",
  ),
);
