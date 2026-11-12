import { makeRule } from "../../../types";
import { makeCoreRuleValidator } from "../A02_Championnat_france_clubs/3_7_f";
import { TeamChampionnatFranceClubSchema } from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.7.3";

export default makeRule(
  id,
  `
  En Ligue CVL, le noyau d’une équipe est fixé à 3 joueurs en Nationale
  IV et 1 joueur en Régionales 1 & 2. En cas d'infraction, forfait administratif sur tous les
  échiquiers en infraction, sans préjudice pour ceux qui les suivent
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  makeCoreRuleValidator({ N4: 3, R1: 1, R2: 1 }, id),
);
