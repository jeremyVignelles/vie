import { Rule } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
} from "../A02_Championnat_france_clubs/types";
import { makeQualifiedRuleValidator } from "../A02_Championnat_france_clubs/3_7_h";

const id = "CVL-1.9";

/**
 * Règle CVL 1.9 - Nationalité étrangère pour les divisions CVL
 *
 * Au moins 4 (Nat. IV) ou 3 (Régionales 1 & 2 – CVL) des joueurs composant une équipe
 * doivent posséder la nationalité française ou être ressortissants de l'Union Européenne
 * résidant en France, ou extracommunautaires résidant en France depuis 5 ans.
 */
const R_1_9: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Au moins 4 (Nat. IV) ou 3 (Régionales 1 & 2 – CVL) des joueurs composant une équipe
  doivent posséder la nationalité française ou être ressortissants de l'Union Européenne
  résidant en France, ou extracommunautaires résidant en France depuis 5 ans.
  `,
  validate: makeQualifiedRuleValidator(
    (_teamSize, division) => (division === "N4" ? 4 : 3),
    id,
    (division) => ["N4", "R1", "R2"].includes(division),
  ),
};

export default R_1_9;
