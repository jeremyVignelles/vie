import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub } from "./types";

const id = "A02-3.6.e";

const rule: Rule<typeof id, PlayerChampionnatFranceClub> = {
  id,
  description: `Elo : l'Elo à prendre en compte est le dernier Elo publié.
    Si deux membres d’une équipe ont une différence de classement Elo de plus de 100 points,
    le mieux classé doit être placé devant le moins bien classé.`,
  validate(_tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    if (!teamPlayers) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];
    let lastSeenRating = Number.MAX_SAFE_INTEGER;
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      if (player.rating > lastSeenRating + 100) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur à la table ${index + 1} a un classement Elo (${player.rating}) avec plus de 100 points d'écart par rapport au joueur précédent (${lastSeenRating}).`,
        });
      }

      lastSeenRating = player.rating;
    }

    return violations;
  },
};

export default rule;
