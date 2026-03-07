import { makeRule } from "../../../types";
import { TeamCompositionFFESchema } from "./types";

const id = "R02-3";

export default makeRule(
  id,
  `Il est interdit de jouer plusieurs parties à la fois
    en compétition par équipes (interclubs, coupes). Si une personne est
    inscrite sur la feuille de match de plusieurs compétitions le même jour,
    le joueur ou la joueuse ne pourra débuter une
    deuxième partie qu'après avoir achevé la précédente.`,
  {
    teamComposition: TeamCompositionFFESchema(),
  },
  (_teams, tournamentState, currentTeams, teamToValidate) => {
    const teamComposition = currentTeams.find((team) => team.teamId === teamToValidate);
    if (!teamComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const otherMatchesOnSameDay = [
      ...Object.values(tournamentState.history).flat(),
      ...currentTeams,
    ].filter(
      (composition) =>
        composition.date === teamComposition.date && composition.teamId !== teamToValidate,
    );

    const violations = [];
    for (const [index, player] of teamComposition.players.entries()) {
      if (player == null) {
        continue;
      }

      const isPlayingAnotherMatch = otherMatchesOnSameDay.some((composition) =>
        composition.players.some(
          (otherPlayer) => otherPlayer != null && otherPlayer.id === player.id,
        ),
      );
      if (isPlayingAnotherMatch) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) joue déjà dans une autre équipe le ${teamComposition.date}.`,
        });
      }
    }

    return violations;
  },
);
