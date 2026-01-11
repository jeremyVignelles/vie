import { Rule, TournamentState, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.h";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Nationalité étrangère : au moins cinq des joueurs ou joueuses composant une équipe
  doivent posséder la nationalité française ou être ressortissants de l'Union Européenne
  résidant en France, ou extracommunautaires résidant en France depuis 5 ans.
  Cette exigence est ramenée à 4 personnes s'il y a un maximum de 6 personnes inscrites sur le PV.
  `,
  validate: makeQualifiedRuleValidator((teamSize) => (teamSize <= 6 ? 4 : 5)),
};

/**
 * Crée un validateur pour la règle des joueurs qualifiés (français/UE/résidents).
 *
 * @param minQualifiedBySize fonction qui retourne le nombre minimum de joueurs qualifiés requis en fonction de la taille de l'équipe et de la division
 * @param ruleId l'identifiant de la règle à utiliser dans les violations (par défaut: "A02-3.7.h")
 * @param divisionFilter fonction optionnelle pour filtrer les divisions auxquelles la règle s'applique
 * @returns le validateur de règle.
 */
export function makeQualifiedRuleValidator(
  minQualifiedBySize: (teamSize: number, division?: string) => number,
  ruleId: string = id,
  divisionFilter?: (division: string) => boolean,
) {
  return function validate(
    teams: TeamChampionnatFranceClub[],
    _tournamentState: TournamentState,
    currentTeams: any[],
    teamToValidate: string,
  ) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Check if rule applies to this division
    if (divisionFilter && !divisionFilter(teamInfo.division)) {
      return [];
    }

    const violations: Violation[] = [];

    // Determine the min qualified players required based on theoretical team size (array length)
    const teamSize = teamPlayers.length;
    const minQualified = minQualifiedBySize(teamSize, teamInfo.division);

    // Count qualified players
    let qualifiedCount = 0;

    for (const player of teamPlayers) {
      if (player === null) {
        continue;
      }

      // Check if player is qualified (French OR qualified resident)
      if (player.isFrench === true || player.isQualifiedResident === true) {
        qualifiedCount++;
      }
    }

    // If we don't have enough qualified players, it's a team violation
    if (qualifiedCount < minQualified) {
      violations.push({
        ruleId,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe n'a pas au moins ${minQualified} joueurs avec nationalité française/UE/résident long terme (${qualifiedCount} sur ${minQualified} requis).`,
      });
    }

    return violations;
  };
}

export default rule;
