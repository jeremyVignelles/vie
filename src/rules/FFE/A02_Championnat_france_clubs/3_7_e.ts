import { makeRule, Violation } from "../../../types";
import {
  TeamChampionnatFranceClubSchema,
  TeamCompositionChampionnatFranceClubSchema,
} from "./types";

const id = "A02-3.7.e";

export default makeRule(
  id,
  `
  Nombre de parties : pour disputer le match n de N1, N2, N3, N4 ou une division inférieure,
  un joueur/joueuse doit avoir joué moins de n matchs dans le championnat.
  Précision : en Top 16, tout joueur/joueuse dépassant le total de 11 rondes jouées dans la
  saison dans le championnat de France des clubs, est sanctionné.
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
    teamComposition: TeamCompositionChampionnatFranceClubSchema(),
  },
  (teams, tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);
    if (!teamPlayers || !teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Determine the round number to validate against
    const roundNumber = currentComposition.roundNumber;
    if (roundNumber === undefined) {
      return violations; // Cannot validate without round number
    }

    // For Top 16, the limit is always 11 rounds
    const maxRounds = teamInfo.division === "T16" ? 11 : roundNumber;

    // Count how many times each player has played in the championship
    const playerRoundCounts: Map<string, number> = new Map();

    // Count appearances in history across all teams
    for (const history of Object.values(tournamentState.history)) {
      for (const composition of history) {
        for (const player of composition.players) {
          if (player !== null) {
            const currentCount = playerRoundCounts.get(player.id) || 0;
            playerRoundCounts.set(player.id, currentCount + 1);
          }
        }
      }
    }

    // Check each player in the current team
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      const roundsPlayed = playerRoundCounts.get(player.id) || 0;

      if (roundsPlayed >= maxRounds) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) a déjà joué ${roundsPlayed} rondes et ne peut pas jouer le match ${roundNumber} (limite: ${maxRounds}).`,
        });
      }
    }

    return violations;
  },
);
