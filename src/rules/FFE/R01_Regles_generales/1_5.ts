import { makeRule } from "../../../types";
import { PlayerFFESchema } from "./types";

const id = "R01-1.5";

export default makeRule(
  id,
  `À partir du 30 mars 2022, les joueurs et joueuses
  évoluant auprès de la FIDE avec le code RUS ou BLR (Russie et Biélorussie),
  ne sont pas autorisés à participer aux compétitions par équipes
  ou individuelles homologuées par la FFE.`,
  {
    player: PlayerFFESchema,
  },
  (_teams, _tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    if (!teamPlayers) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations = [];
    for (const [index, player] of teamPlayers.entries()) {
      if (player != null && (player.federation === "RUS" || player.federation === "BLR")) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'est pas autorisé à participer en raison de sa fédération.`,
        });
      }
    }

    return violations;
  },
);
