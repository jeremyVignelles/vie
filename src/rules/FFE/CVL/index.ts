import { extendRuleset } from "../../../tools";
import { ChampionnatDeFranceDesClubs } from "../A02_Championnat_france_clubs";

import R_1_6 from "./1_6";
import R_1_7 from "./1_7";
import R_1_8 from "./1_8";
import R_1_9 from "./1_9";

const version = "2025-2026";
const link =
  "https://echecscentre-valdeloire.fr/wp-content/uploads/2025/09/Saison-2025-2026-Ligue-CVL-Reglement-des-interclubs-v1.0-Valide-Codir-CVL-2025-09-13-CTF-2025-09-10j-Google-Docs.pdf";

export const ReglesGenerales = extendRuleset(
  ChampionnatDeFranceDesClubs,
  `Règles interclubs CVL (version ${version})`,
  link,
  ["A02-3.7.h", "A02-3.7.k"] as const,
  [R_1_6, R_1_7, R_1_8, R_1_9] as const,
);

// - 5.1 arbitrage
// - 5.5 arbitrage R1&2
