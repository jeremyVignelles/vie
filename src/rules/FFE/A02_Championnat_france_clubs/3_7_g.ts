import { Rule, TournamentState, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.g";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Joueuses et joueurs mutés : pour chaque match, une équipe ne peut aligner plus de 3 personnes
  mutées (voir Règles Générales 2.2). Cette exigence est ramenée à 2 personnes s'il y a un maximum
  de 6 participants inscrits sur le PV.
  `,
  validate: makeTransferredRuleValidator((totalPositions) => (totalPositions <= 6 ? 2 : 3)),
};

/**
 * Crée un validateur pour la règle des joueurs mutés (transférés).
 *
 * @param maxTransferredByPositions fonction qui retourne le nombre maximum de joueurs mutés autorisés en fonction du nombre total de positions et de la division
 * @param ruleId l'identifiant de la règle à utiliser dans les violations (par défaut: "A02-3.7.g")
 * @param divisionFilter fonction optionnelle pour filtrer les divisions auxquelles la règle s'applique
 * @returns le validateur de règle.
 */
export function makeTransferredRuleValidator(
  maxTransferredByPositions: (totalPositions: number, division?: string) => number,
  ruleId: string = id,
  divisionFilter?: (division: string) => boolean,
) {
  return function validate(
    tournamentState: TournamentState<PlayerChampionnatFranceClub, TeamChampionnatFranceClub, any>,
    currentTeams: any[],
    teamToValidate: string,
  ) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Check if rule applies to this division
    if (divisionFilter && !divisionFilter(teamInfo.division)) {
      return [];
    }

    const violations: Violation[] = [];

    // Count total registered positions (including nulls) for determining max transferred
    const totalPositions = teamPlayers.length;

    // Determine the max transferred players allowed based on total positions
    const maxTransferred = maxTransferredByPositions(totalPositions, teamInfo.division);

    // Count transferred players
    let transferredCount = 0;

    for (const player of teamPlayers) {
      if (player === null) {
        continue;
      }

      if (player.transferred) {
        transferredCount++;
      }
    }

    // If we exceeded the limit, it's a team violation
    if (transferredCount > maxTransferred) {
      violations.push({
        ruleId,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe a dépassé le quota de ${maxTransferred} joueurs mutés (${transferredCount} joueurs mutés).`,
      });
    }

    return violations;
  };
}

export default rule;
