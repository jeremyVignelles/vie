import { Rule } from "../../../types";

const id = "A02-3.6.a";

const rule: Rule<typeof id> = {
  id,
  description: `La liste des joueurs ne doit pas comporter de "trou".
  S'il n'y pas de nom inscrit sur la feuille de match à un certain échiquier,
  il ne doit pas y en avoir non plus aux échiquiers suivants.`,
  validate(_tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    if (!teamPlayers) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    let hasBoardWithNoPlayer = false;
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        hasBoardWithNoPlayer = true;
      } else if (hasBoardWithNoPlayer) {
        // On a de nouveau un joueur, alors qu'on avait un trou avant
        return [
          {
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: index + 1,
            message: "Il ne doit pas y avoir de trou dans la composition de la feuille de match.",
          },
        ];
      }
    }

    return [];
  },
};

export default rule;
