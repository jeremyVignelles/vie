import { Arbiter, Rule } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import { makeTransferredRuleValidator } from "../A02_Championnat_france_clubs/3_7_g";

const id = "CVL-1.8";

/**
 * Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1 (Régionales 1 & 2 - CVL) joueurs mutés.
 */
const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  Arbiter,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  Pour chaque match, une équipe ne peut aligner plus de 2 (Nat. IV) ou 1 (Régionales 1 & 2 - CVL) joueurs mutés.
  `,
  validate: makeTransferredRuleValidator(
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
};

export default rule;
