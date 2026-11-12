import { makeRuleset } from "../../../tools";
import R_1_1 from "./1_1";
import R_1_4 from "./1_4";
import R_1_5 from "./1_5";
import R_R02_3 from "./R02_3";

const version = "2026-2027";
const link = "https://www.echecs.asso.fr/Actus/2864/R01_2026_27_Regles_generales.pdf";

export const ReglesGenerales = makeRuleset(`Règles générales (version ${version})`, link, [
  R_1_1,
  R_1_4,
  R_1_5,
  R_R02_3,
] as const);
