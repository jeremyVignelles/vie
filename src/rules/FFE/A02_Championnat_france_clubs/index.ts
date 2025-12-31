import { extendRuleset } from "../../../tools";
import { ReglesGenerales } from "../R01_Regles_generales/index";

import R_3_6_A from "./3_6_a";
import R_3_6_E from "./3_6_e";
import R_3_7_A from "./3_7_a";
import R_3_7_B from "./3_7_b";
import R_3_7_C from "./3_7_c";
import R_3_7_D from "./3_7_d";
import R_3_7_E from "./3_7_e";
import R_3_7_F from "./3_7_f";
import R_3_7_G from "./3_7_g";
import R_3_7_H from "./3_7_h";
import R_3_7_I from "./3_7_i";
import R_3_7_J from "./3_7_j";
import R_3_7_K from "./3_7_k";

const version = "2025-2026";
const link = "https://echecs.asso.fr/Actus/2864/A02_2025_26_Championnat_de_France_des_Clubs.pdf";

export const ChampionnatDeFranceDesClubs = extendRuleset(
  ReglesGenerales,
  `Règles du Championnat de France des Clubs (= interclubs adultes) (version ${version})`,
  link,
  [],
  [R_3_6_A, R_3_6_E, R_3_7_A, R_3_7_B, R_3_7_C, R_3_7_D, R_3_7_E, R_3_7_F, R_3_7_G, R_3_7_H, R_3_7_I, R_3_7_J, R_3_7_K],
);
