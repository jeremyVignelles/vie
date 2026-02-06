import { makeRule, Violation } from "../../..";
import { TeamChampionnatFranceClubSchema } from "../A02_Championnat_france_clubs/types";

const id = "CVL-1.6";

export default makeRule(
  id,
  `
  En Ligue CVL, dans les divisions de Régionale 1 et 2, un joueur ne peut pas jouer dans
  plusieurs équipes d’une même division, que ces équipes soient dans le même groupe ou non.
  La Nationale IV reste régie par le règlement fédéral (A02)
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  (teams, tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const teamsInSameDivision = teams.filter((team) => team.division === teamInfo.division);
    const violations: Violation[] = [];

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      for (const otherTeam of teamsInSameDivision) {
        // Skip the current team - players can play multiple times in the same team
        if (otherTeam.id === teamToValidate) {
          continue;
        }

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
              message: `Le joueur ${player.name} (ID: ${player.id}) a déjà joué dans une autre équipe de la même division et ne peut pas jouer dans cette équipe.`,
            });
            break;
          }
        }
      }
    }

    return violations;
  },
);
