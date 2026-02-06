import { makeRule } from "../../../types";
import { makeTransferredRuleValidator } from "../A02_Championnat_france_clubs/3_7_g";
import { TeamChampionnatFranceClubSchema } from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.8";

/**
 * Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1 (Régionales 1 & 2 - CVL) joueurs mutés.
 */
export default makeRule(
  id,
  `
  Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1 (Régionales 1 & 2 - CVL) joueurs mutés.
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
