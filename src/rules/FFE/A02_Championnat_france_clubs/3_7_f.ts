import { Rule, TournamentState, Violation } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

const id = "A02-3.7.f";

const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  ArbiterFFE,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  Noyau de l'équipe : en N1, N2 et N3, chaque équipe doit aligner à chaque ronde
  au moins 50% de personnes (appelé noyau) inscrites sur le PV ayant déjà participé
  au moins une fois pour le compte de cette équipe depuis le début de la saison (sauf pour la ronde 1).
  `,
  validate: makeCoreRuleValidator({ N1: 4, N2: 4, N3: 4 }),
};

/**
 * Crée un validateur pour la règle du noyau de joueurs.
 *
 * @param divisionToCoreNumber pour chaque division, indique le nombre minimum de joueurs du noyau requis.
 * @returns le validateur de règle.
 */
export function makeCoreRuleValidator(divisionToCoreNumber: Record<string, number>) {
  return function validate(
    tournamentState: TournamentState<
      PlayerChampionnatFranceClub,
      TeamChampionnatFranceClub,
      any,
      ArbiterFFE,
      TeamCompositionChampionnatFranceClub
    >,
    currentTeams: TeamCompositionChampionnatFranceClub[],
    teamToValidate: string,
  ) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);
    if (!teamPlayers || !teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Only applies to the mentionned divisions
    const minimumCore = divisionToCoreNumber[teamInfo.division];
    if (!minimumCore) {
      return [];
    }

    // Does not apply to round 1
    const roundNumber = currentComposition.roundNumber;
    if (roundNumber === undefined || roundNumber === 1) {
      return [];
    }

    const violations: Violation[] = [];

    // Get the team's history to determine the core
    const history = tournamentState.history[teamToValidate] || [];

    // Build set of players who have played for this team before
    const corePlayerIds = new Set<string>();
    for (const composition of history) {
      for (const player of composition.players) {
        if (player !== null) {
          corePlayerIds.add(player.id);
        }
      }
    }

    // Count core players in current composition
    const corePlayersInComposition = teamPlayers.filter(
      (p) => p !== null && corePlayerIds.has(p.id),
    );
    const coreCount = corePlayersInComposition.length;

    if (coreCount < minimumCore) {
      violations.push({
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `En ${teamInfo.division}, l'équipe doit avoir au moins ${minimumCore} joueurs du noyau (seuls ${coreCount} ont déjà joué dans l'équipe).`,
      });
    }

    return violations;
  };
}

export default rule;
