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

    // Count transferred players and track their positions
    let transferredCount = 0;
    let firstViolationIndex = -1;

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      if (player.transferred) {
        transferredCount++;
        if (transferredCount > maxTransferred && firstViolationIndex === -1) {
          firstViolationIndex = index;
        }
      }
    }

    // If we exceeded the limit, sanction from the first violating board onwards
    if (firstViolationIndex !== -1) {
      for (let i = firstViolationIndex; i < teamPlayers.length; i++) {
        if (teamPlayers[i] !== null) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: i + 1,
            message: `Le joueur ${teamPlayers[i]!.name} (ID: ${teamPlayers[i]!.id}) est sanctionné car l'équipe a dépassé le quota de ${maxTransferred} joueurs mutés.`,
          });
        }
      }
    }

    return violations;
  },
};

export default rule;
