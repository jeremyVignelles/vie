import { makeRule, Violation } from "../../../types";
import { PlayerChampionnatFranceClubSchema } from "./types";

const id = "A02-3.6.e";

export default makeRule(
  id,
  `Elo : l'Elo à prendre en compte est le dernier Elo publié.
    Si deux membres d’une équipe ont une différence de classement Elo de plus de 100 points,
    le mieux classé doit être placé devant le moins bien classé.`,
  {
    player: PlayerChampionnatFranceClubSchema,
  },
  (_teams, _tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    if (!teamPlayers) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];
    const previousRatings: number[] = [];

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      // Vérifier si le joueur actuel a un Elo supérieur de plus de 100 points
      // par rapport à n'importe quel joueur précédent
      for (const previousRating of previousRatings) {
        if (player.rating > previousRating + 100) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: index + 1,
            message: `Le joueur à la table ${index + 1} a un classement Elo (${player.rating}) avec plus de 100 points d'écart par rapport au joueur précédent (${previousRating}).`,
          });
          break; // Une seule violation par joueur
        }
      }

      previousRatings.push(player.rating);
    }

    return violations;
  },
);
