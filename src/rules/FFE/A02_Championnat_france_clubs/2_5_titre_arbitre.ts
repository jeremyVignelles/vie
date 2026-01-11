import { Player, Rule, TeamInfo, TournamentState, Violation } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import { TeamChampionnatFranceClub, TeamCompositionChampionnatFranceClub } from "./types";

const id = "A02-2.5-titre-arbitre";

const rule: Rule<typeof id, Player, TeamInfo, ArbiterFFE> = {
  id,
  description: `
  En Top 16, la direction de Nationale désigne les arbitres fédéraux après avis de la Direction Nationale de l'Arbitrage.
  En N1, N2, N3 et N4, les matchs sont dirigés par une ou un arbitre fédéral Elite, d'Open ou de Club. La personne
  responsable de la rencontre est chargée de désigner l'arbitre. En N4, une demande de dérogation est possible par les
  Ligues.
  `,
  validate: makeArbiterTitleValidator((division: string) => {
    if (["T16", "N1", "N2", "N3", "N4"].includes(division)) {
      return ["AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"];
    }
    return null;
  }, id),
};

export default rule;

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

    // Vérifier que l'arbitre a un titre fédéral Elite, Open ou Club
    if (!validTitles.includes(arbiter.arbiterTitle)) {
      return [
        {
          ruleId,
          teamId: teamToValidate,
          boardNumber: null,
          message: `L'arbitre ${arbiter.name} doit être arbitre fédéral Elite, d'Open ou de Club (titre actuel: ${arbiter.arbiterTitle}).`,
        },
      ];
    }

    return [];
  };
}
