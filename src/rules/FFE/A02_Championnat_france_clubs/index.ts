import { extendRuleset } from "../../../tools";
import { ReglesGenerales } from "../R01_Regles_generales/index";

import R_3_6_A from "./3_6_a";
import R_3_6_E from "./3_6_e";
import R_3_7_A from "./3_7_a";
import R_3_7_B from "./3_7_b";
import R_3_7_C from "./3_7_c";
import R_3_7_D from "./3_7_d";

const version = "2025-2026";
const link = "https://echecs.asso.fr/Actus/2864/A02_2025_26_Championnat_de_France_des_Clubs.pdf";

export const ChampionnatDeFranceDesClubs = extendRuleset(
  ReglesGenerales,
  `Règles du Championnat de France des Clubs (= interclubs adultes) (version ${version})`,
  link,
  [],
  [R_3_6_A, R_3_6_E, R_3_7_A, R_3_7_B, R_3_7_C, R_3_7_D],
);
