import { extendRuleset } from "../../../tools";
import { ChampionnatDeFranceDesClubs } from "../A02_Championnat_france_clubs";

import R_1_7_1 from "./1_7_1";
import R_1_7_3 from "./1_7_3";
import R_1_7_4 from "./1_7_4";
import R_1_7_5 from "./1_7_5";
import R_5_1 from "./5_1";

const version = "2025-2026";
const link =
  "http://echecscentre-valdeloire.fr/wp-content/uploads/2026/08/Saison-2026-2027-Ligue-CVL-Reglement-des-interclubs-V.1.4-Valide-CoDir-CVL-2026-06-20-CTF-2026-09-04.pdf";

export const InterclubsCVL = extendRuleset(
  ChampionnatDeFranceDesClubs,
  `Règles interclubs CVL (version ${version})`,
  link,
  ["A02-3.7.h", "A02-3.7.k"] as const,
  [R_1_7_1, R_1_7_3, R_1_7_4, R_1_7_5, R_5_1] as const,
);
