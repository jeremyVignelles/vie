import { makeRule } from "../../../types";
import { makeArbiterTitleValidator } from "../A02_Championnat_france_clubs/2_5_titre_arbitre";
import { ArbiterFFESchema } from "../R01_Regles_generales/types";

const id = "CVL-5.1";

export default makeRule(
  id,
  `
  Dans la Ligue CVL, les matches de Régionales 1 & 2 doivent être arbitrés par un arbitre fédéral,
  au moins stagiaire.
  `,
  {
    arbiter: ArbiterFFESchema,
  },
  makeArbiterTitleValidator((division: string) => {
    if (["R1", "R2"].includes(division)) {
      return ["AS", "AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"];
    }
    return null;
  }, id),
);
