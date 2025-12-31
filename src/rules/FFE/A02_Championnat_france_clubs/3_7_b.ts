import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.b";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Force des équipes : la Commission Technique Fédérale (la Ligue pour la N4)
  compose les groupes en numérotant les équipes appartenant à un même Club par
  ordre de force décroissante. Les Clubs sont tenus de respecter cet ordre.
  La force est calculée en fonction du résultat prévisible sur chaque échiquier
  entre deux équipes avec la composition des équipes le jour des matchs.
  En cas de forfait sportif individuel, la valeur du Elo à retenir à l’échiquier
  vacant est zéro.
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamIndex = tournamentState.teams.findIndex((team) => team.id === teamToValidate);
    if (!teamPlayers || teamIndex === -1) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const strongerTeams = tournamentState.teams.slice(0, teamIndex);

    const violations: Violation[] = [];

    for (const strongerTeam of strongerTeams) {
      const strongerTeamComposition =
        currentTeams.find((team) => team.teamId === strongerTeam.id) ??
        tournamentState.history[strongerTeam.id]?.at(-1);
      if (!strongerTeamComposition) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `La composition de l'équipe plus forte (${strongerTeam.id}) n'a pas été trouvée.`,
        });
        continue;
      }

      let totalResultProbability = 0;
      for (
        let i = 0;
        i < Math.min(teamPlayers.length, strongerTeamComposition.players.length);
        i++
      ) {
        const player = teamPlayers[i];
        const strongerPlayer = strongerTeamComposition.players[i];
        totalResultProbability += calculateResultProbability(player, strongerPlayer);
      }

      if (totalResultProbability > 0) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `L'équipe ${teamToValidate} est censée être plus faible que l'équipe ${strongerTeam.id}, mais la probabilité totale de victoire est de ${totalResultProbability.toFixed(2)}.`,
        });
      }
    }

    return violations;
  },
};

export default rule;

/**
 * Retourne 1 si le joueur gagne théoriquement contre l'adversaire,
 * 0 s'il y a égalité, et -1 s'il perd.
 */
function calculateResultProbability(
  player: PlayerChampionnatFranceClub | null | undefined,
  opponent: PlayerChampionnatFranceClub | null | undefined,
): number {
  const playerRating = player && !player.forfeited ? player.rating : 0;
  const opponentRating = opponent && !opponent.forfeited ? opponent.rating : 0;

  if (playerRating === opponentRating) {
    return 0;
  }

  if (playerRating > opponentRating) {
    return 1;
  }

  return -1;
}
