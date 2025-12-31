import { makeRuleset } from "../../../tools";
import R_1_4 from "./1.4";
import R_1_5 from "./1.5";

const version = "2025-2026";
const link = "https://echecs.asso.fr/Actus/2864/R01_2025_26_Regles_generales.pdf";

export const ReglesGenerales = makeRuleset(`Règles générales (version ${version})`, link, [
  R_1_4,
  R_1_5,
] as const);
