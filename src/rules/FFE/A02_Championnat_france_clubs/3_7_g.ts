import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.g";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Joueuses et joueurs mutés : pour chaque match, une équipe ne peut aligner plus de 3 personnes
  mutées (voir Règles Générales 2.2). Cette exigence est ramenée à 2 personnes s'il y a un maximum
  de 6 participants inscrits sur le PV.
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Count total registered positions (including nulls) for determining max transferred
    const totalPositions = teamPlayers.length;

    // Determine the max transferred players allowed based on total positions
    const maxTransferred = totalPositions <= 6 ? 2 : 3;

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
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe a dépassé le quota de ${maxTransferred} joueurs mutés (${transferredCount} joueurs mutés).`,
      });
    }

    return violations;
  },
};

export default rule;
