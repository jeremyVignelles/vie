import { makeRule } from "../../../types";
import { PlayerFFESchema, TeamFFESchema } from "./types";

const id = "R01-1.4";

export default makeRule(
  id,
  `Pour toute compétition se jouant à une cadence supérieure ou égale à 60 min
  (ou équivalent en cadence Fischer),les joueurs et joueuses doivent être titulaires d'une
  licence A valable pour la saison en cours.`,
  {
    player: PlayerFFESchema,
    teamInfo: TeamFFESchema,
  },
  (teams, _tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    if (teamInfo.hasAtLeast60Minutes === false) {
      return [];
    }

    const violations = [];
    for (const [index, player] of teamPlayers.entries()) {
      if (player != null && player.licenseType !== "A") {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'a pas une licence de type A.`,
        });
      }
    }

    return violations;
  },
);
