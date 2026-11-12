import { makeRule, TournamentState, Violation } from "../../../types";
import { ArbiterFFESchema } from "../R01_Regles_generales/types";
import {
  TeamChampionnatFranceClub,
  TeamChampionnatFranceClubSchema,
  TeamCompositionChampionnatFranceClub,
  TeamCompositionChampionnatFranceClubSchema,
} from "./types";

const id = "A02-2.5-titre-arbitre";

export default makeRule(
  id,
  `
  En Top 16, la direction de Nationale désigne les arbitres fédéraux après avis de la Direction Nationale de l'Arbitrage.
En N1, N2, N3 et N4, les matchs sont dirigés par une ou un arbitre fédéral AFOpen, AFClub ou AFMatch. La personne
responsable de la rencontre est chargée de désigner l'arbitre. En N4, une demande de dérogation est possible par les
Ligues.
  `,
  {
    arbiter: ArbiterFFESchema,
    teamInfo: TeamChampionnatFranceClubSchema,
    teamComposition: TeamCompositionChampionnatFranceClubSchema(),
  },
  makeArbiterTitleValidator((division: string) => {
    if (["T16", "N1", "N2", "N3", "N4"].includes(division)) {
      return ["AFMatch", "AFClub", "AFOpen", "AF", "AI"];
    }
    return null;
  }, id),
);

export function makeArbiterTitleValidator(
  validTitlesForDivision: (division: string) => string[] | null,
  ruleId: string = id,
) {
  return function validate(
    teams: TeamChampionnatFranceClub[],
    _tournamentState: TournamentState,
    currentTeams: TeamCompositionChampionnatFranceClub[],
    teamToValidate: string,
  ): Violation[] {
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);

    if (!teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const validTitles = validTitlesForDivision(teamInfo.division);
    if (!validTitles) {
      // No specific titles required for this division
      return [];
    }

    const arbiter = currentComposition.arbiter;
    // Pas d'arbitre désigné
    if (!arbiter) {
      return [
        {
          ruleId,
          teamId: teamToValidate,
          boardNumber: null,
          message: `Aucun arbitre n'est sélectionné pour l'équipe ${teamToValidate}.`,
        },
      ];
    }

    if (!validTitles.includes(arbiter.arbiterTitle)) {
      const formattedTitles =
        validTitles.length === 0
          ? "aucun"
          : validTitles.length === 1
            ? validTitles[0]
            : `${validTitles.slice(0, -1).join(", ")} ou ${validTitles.at(-1)}`;
      return [
        {
          ruleId,
          teamId: teamToValidate,
          boardNumber: null,
          message: `L'arbitre ${arbiter.name} doit posséder l'un des titres fédéraux suivants : ${formattedTitles} (titre actuel: ${arbiter.arbiterTitle}).`,
        },
      ];
    }

    return [];
  };
}
