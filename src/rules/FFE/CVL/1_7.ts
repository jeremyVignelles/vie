import { makeRule } from "../../../types";
import { makeCoreRuleValidator } from "../A02_Championnat_france_clubs/3_7_f";
import { TeamChampionnatFranceClubSchema } from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.7";

export default makeRule(
  id,
  `
  Chaque équipe doit aligner au moins 3 joueurs (Nat. IV) ou 1 joueur (Régionales 1 & 2 – CVL)
  ayant déjà participé au moins une fois pour le compte de cette équipe depuis le début de la
  saison (sauf pour la ronde 1).
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  makeCoreRuleValidator({ N4: 3, R1: 1, R2: 1 }, id),
);
