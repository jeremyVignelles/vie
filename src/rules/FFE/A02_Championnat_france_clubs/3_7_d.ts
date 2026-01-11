import { Player, Rule, Violation } from "../../../types";
import { TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.d";

const rule: Rule<typeof id, Player, TeamChampionnatFranceClub> = {
  id,
  description: `
  Participation dans un même groupe : Lorsqu'un club a plusieurs équipes engagées
  dans un même groupe, la participation d’un joueur ou d'une joueuse à plusieurs
  équipes de ce même groupe est interdite, y compris d'éventuels barrages.
  `,
  validate(teams, tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const teamsInSameGroup = teams.filter(
      (team) => team.division === teamInfo.division && team.groupId === teamInfo.groupId,
    );
    const violations: Violation[] = [];

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      for (const otherTeam of teamsInSameGroup) {
        const history = tournamentState.history[otherTeam.id];
        if (!history) {
          continue;
        }

        for (const pastComposition of history) {
          if (pastComposition.players.some((p) => p !== null && p.id === player.id)) {
            violations.push({
              ruleId: id,
              teamId: teamToValidate,
              boardNumber: index + 1,
              message: `Le joueur ${player.name} (ID: ${player.id}) a déjà joué dans une autre équipe du même groupe et ne peut pas jouer dans cette équipe.`,
            });
            break;
          }
        }
      }
    }

    return violations;
  },
};

export default rule;
