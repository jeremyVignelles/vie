import { Arbiter, Rule, Violation } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

const id = "A02-3.8";

const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  Arbiter,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  En Top 16, chaque forfait individuel sera sanctionné d'une amende de 300 €.
  En N1, chaque forfait individuel sera sanctionné d'une amende de 200 €.
  En N2 et N3, chaque forfait individuel, à partir du 4e dans la même équipe et dans la même saison, sera sanctionné
  d'une amende de 100 €.
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);

    if (!teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Count forfeitures for this team in the current season
    const teamHistory = tournamentState.history[teamToValidate] || [];

    // Count individual forfeitures across all previous rounds
    let totalForfeitures = 0;
    for (const composition of teamHistory) {
      if (composition.players) {
        for (const player of composition.players) {
          if (!player || player.forfeited) {
            totalForfeitures++;
          }
        }
      }
    }

    const division = teamInfo.division;

    if (currentComposition.players) {
      currentComposition.players.forEach((player, index) => {
        const isForfeit = !player || player.forfeited;

        if (isForfeit) {
          const boardNumber = index + 1;

          if (division === "T16" || division === "N1") {
            violations.push({
              ruleId: id,
              teamId: teamToValidate,
              boardNumber,
              message: `Forfait sportif individuel sur l'échiquier ${boardNumber}.`,
            });
          } else if (division === "N2" || division === "N3") {
            totalForfeitures++;
            if (totalForfeitures >= 4) {
              violations.push({
                ruleId: id,
                teamId: teamToValidate,
                boardNumber,
                message: `Forfait sportif individuel sur l'échiquier ${boardNumber} (${totalForfeitures}e forfait de la saison en ${division}).`,
              });
            }
          }
        }
      });
    }

    return violations;
  },
};

export default rule;
