import { Rule, Violation } from "../../../types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

const id = "A02-3.7.f";

const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  Noyau de l'équipe : en N1, N2 et N3, chaque équipe doit aligner à chaque ronde
  au moins 50% de personnes (appelé noyau) inscrites sur le PV ayant déjà participé
  au moins une fois pour le compte de cette équipe depuis le début de la saison (sauf pour la ronde 1).
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);
    if (!teamPlayers || !teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Only applies to N1, N2, N3
    if (!["N1", "N2", "N3"].includes(teamInfo.division)) {
      return [];
    }

    // Does not apply to round 1
    const roundNumber = currentComposition.roundNumber;
    if (roundNumber === undefined || roundNumber === 1) {
      return [];
    }

    const violations: Violation[] = [];

    // Get the team's history to determine the core
    const history = tournamentState.history[teamToValidate] || [];

    // Build set of players who have played for this team before
    const corePlayerIds = new Set<string>();
    for (const composition of history) {
      for (const player of composition.players) {
        if (player !== null) {
          corePlayerIds.add(player.id);
        }
      }
    }

    // Count non-null players and core players in current composition
    const nonNullPlayers = teamPlayers.filter((p) => p !== null);
    const corePlayersInComposition = nonNullPlayers.filter((p) => corePlayerIds.has(p!.id));

    const totalPlayers = nonNullPlayers.length;
    const coreCount = corePlayersInComposition.length;
    const requiredCore = Math.ceil(totalPlayers * 0.5);

    if (coreCount < requiredCore) {
      // Find the boards that are not in the core, and mark them as violations
      // Following board order, we need to mark boards until we reach 50%
      let nonCoreCount = 0;
      for (const [index, player] of teamPlayers.entries()) {
        if (player === null) {
          continue;
        }

        if (!corePlayerIds.has(player.id)) {
          nonCoreCount++;
          // Once we exceed the allowed non-core count, mark this and all following boards
          if (nonCoreCount > (totalPlayers - requiredCore)) {
            violations.push({
              ruleId: id,
              teamId: teamToValidate,
              boardNumber: index + 1,
              message: `Le joueur ${player.name} (ID: ${player.id}) ne fait pas partie du noyau de l'équipe et dépasse le quota de 50% de joueurs hors noyau.`,
            });
            // Mark all following boards as well
            for (let i = index + 1; i < teamPlayers.length; i++) {
              if (teamPlayers[i] !== null) {
                violations.push({
                  ruleId: id,
                  teamId: teamToValidate,
                  boardNumber: i + 1,
                  message: `Le joueur ${teamPlayers[i]!.name} (ID: ${teamPlayers[i]!.id}) est sanctionné car un joueur hors noyau précédent a dépassé le quota.`,
                });
              }
            }
            break;
          }
        }
      }
    }

    return violations;
  },
};

export default rule;
