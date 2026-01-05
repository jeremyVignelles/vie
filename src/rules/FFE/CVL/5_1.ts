import { Rule } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import { makeArbiterTitleValidator } from "../A02_Championnat_france_clubs/2_5_titre_arbitre";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";

const id = "CVL-5.1";

const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  ArbiterFFE,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  Dans la Ligue CVL, les matches de Régionales 1 & 2 doivent être arbitrés par un arbitre fédéral,
  au moins stagiaire.
  `,
  validate: makeArbiterTitleValidator((division: string) => {
    if (["R1", "R2"].includes(division)) {
      return ["AS", "AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"];
    }
    return null;
  }, id),
};

export default rule;
