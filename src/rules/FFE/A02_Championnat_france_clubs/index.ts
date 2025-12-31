import { extendRuleset } from "../../../tools";
import { ReglesGenerales } from "../R01_Regles_generales/index";

const version = "2025-2026";
const link = "https://echecs.asso.fr/Actus/2864/A02_2025_26_Championnat_de_France_des_Clubs.pdf";

const communes = extendRuleset(
  ReglesGenerales,
  `Règles communes interclubs (version ${version})`,
  link,
  [],
  [],
);

export const TOP16 = extendRuleset(communes, `Top 16 (version ${version})`, link, [], []);

export const N1 = extendRuleset(communes, `Nationale 1 (version ${version})`, link, [], []);

export const N2 = extendRuleset(communes, `Nationale 2 (version ${version})`, link, [], []);

export const N3 = extendRuleset(communes, `Nationale 3 (version ${version})`, link, [], []);

export const N4 = extendRuleset(communes, `Nationale 4 (version ${version})`, link, [], []);
