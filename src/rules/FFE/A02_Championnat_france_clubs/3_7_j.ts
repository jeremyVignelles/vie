import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.j";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Elo en N4 et division inferieure : les joueurs ou joueuses ayant un classement Elo supérieur
  à 2400 ne sont pas autorisés à jouer en Nationale 4 ou en division inférieure, sauf si moins
  de deux équipes du club participent aux divisions supérieures pendant la saison en cours.
  `,
  validate(teams, _tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Only applies to N4 and lower divisions
    const higherDivisions = ["T16", "N1", "N2", "N3"];
    if (higherDivisions.includes(teamInfo.division)) {
      return [];
    }

    // Count teams in higher divisions
    const teamsInHigherDivisions = teams.filter((team) => {
      if (team.id === teamToValidate) return false;

      return higherDivisions.includes(team.division);
    });

    // If less than 2 teams in higher divisions, the rule doesn't apply
    if (teamsInHigherDivisions.length < 2) {
      return [];
    }

    // Check for players with Elo > 2400
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      if (player.rating > 2400) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) a un Elo supérieur à 2400 et ne peut pas jouer en ${teamInfo.division}.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
