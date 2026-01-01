import { Rule, Violation } from "../../../types";
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
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Determine the min qualified players required based on theoretical team size (array length)
    const teamSize = teamPlayers.length;
    const minQualified = teamSize <= 6 ? 4 : 5;

    // Count qualified players
    let qualifiedCount = 0;

    for (const player of teamPlayers) {
      if (player === null) {
        continue;
      }

      // Check if player is qualified
      if (player.isQualifiedResident === true) {
        qualifiedCount++;
      }
    }

    // If we don't have enough qualified players, it's a team violation
    if (qualifiedCount < minQualified) {
      violations.push({
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe n'a pas au moins ${minQualified} joueurs avec nationalité française/UE/résident long terme (${qualifiedCount} sur ${minQualified} requis).`,
      });
    }

    return violations;
  },
};

export default rule;
