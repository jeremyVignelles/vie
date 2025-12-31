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
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Only applies to N4 and lower divisions
    const divisionOrder = ["T16", "N1", "N2", "N3", "N4"];
    const teamDivisionIndex = divisionOrder.indexOf(teamInfo.division);
    
    // If not in N4 or if division is higher than N4, don't apply
    if (teamDivisionIndex === -1 || teamDivisionIndex < 4) {
      return [];
    }

    // Count teams in higher divisions from the same club(s)
    const teamClubs = new Set(teamInfo.clubs);
    const teamsInHigherDivisions = tournamentState.teams.filter((team) => {
      if (team.id === teamToValidate) return false;
      
      const otherDivisionIndex = divisionOrder.indexOf(team.division);
      if (otherDivisionIndex === -1 || otherDivisionIndex >= 4) return false;
      
      // Check if this team shares any club with our team
      return team.clubs.some((club) => teamClubs.has(club));
    });

    // If less than 2 teams in higher divisions, the rule doesn't apply
    if (teamsInHigherDivisions.length < 2) {
      return [];
    }

    // Check for players with Elo > 2400
    let firstViolationIndex = -1;
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      if (player.rating > 2400) {
        if (firstViolationIndex === -1) {
          firstViolationIndex = index;
        }
      }
    }

    // Sanction from the first violating board onwards
    if (firstViolationIndex !== -1) {
      for (let i = firstViolationIndex; i < teamPlayers.length; i++) {
        if (teamPlayers[i] !== null) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: i + 1,
            message: `Le joueur ${teamPlayers[i]!.name} (ID: ${teamPlayers[i]!.id}) a un Elo supérieur à 2400 et ne peut pas jouer en ${teamInfo.division}.`,
          });
        }
      }
    }

    return violations;
  },
};

export default rule;
