import { makeRule } from "../../../types";
import { makeQualifiedRuleValidator } from "../A02_Championnat_france_clubs/3_7_h";
import {
  PlayerChampionnatFranceClubSchema,
  TeamChampionnatFranceClubSchema,
} from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.7.5";

/**
 * Règle CVL 1.7.5 - Nationalité étrangère pour les divisions CVL
 */
export default makeRule(
  id,
  `
  Nationalité française : Au moins 4 (Nat. IV) ou 3 (Régionales 1 & 2 – CVL) des joueurs
  composant une équipe doivent posséder la nationalité française ou être ressortissants de
  l’Union Européenne résidant en France, ou extracommunautaires résidant en France depuis
  5 ans. En cas d'infraction, forfait administratif sur le premier échiquier concerné et tous
  ceux qui le suivent.
  `,
  {
    player: PlayerChampionnatFranceClubSchema,
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  makeQualifiedRuleValidator(
    (_teamSize, division) => (division === "N4" ? 4 : 3),
    id,
    (division) => ["N4", "R1", "R2"].includes(division),
  ),
);
