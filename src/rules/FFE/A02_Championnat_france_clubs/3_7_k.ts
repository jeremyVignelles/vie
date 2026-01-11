import { Arbiter, Player, Rule, Violation } from "../../../types";
import { TeamChampionnatFranceClub, TeamCompositionChampionnatFranceClub } from "./types";

const id = "A02-3.7.k";

const rule: Rule<
  typeof id,
  Player,
  TeamChampionnatFranceClub,
  Arbiter,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  Matchs de barrage : [...] les joueurs ou joueuses participant à un tel match
  devront avoir joué au moins une fois dans la nationale concernée ou dans une nationale inférieure
  du Championnat de France des Clubs durant la saison en cours.
  `,
  validate(teams, tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);
    if (!teamPlayers || !teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Only applies to playoff matches
    if (!currentComposition.playoff) {
      return [];
    }

    const violations: Violation[] = [];

    // Define division hierarchy
    const divisionOrder = ["T16", "N1", "N2", "N3", "N4"];
    const teamDivisionIndex = divisionOrder.indexOf(teamInfo.division);

    if (teamDivisionIndex === -1) {
      // Unknown division, can't validate
      return violations;
    }

    // Collect all players who have played in the same or lower division
    const eligiblePlayerIds = new Set<string>();

    // Check all history for all teams
    for (const [teamId, compositions] of Object.entries(tournamentState.history)) {
      const team = teams.find((t) => t.id === teamId);
      if (!team) continue;

      const otherDivisionIndex = divisionOrder.indexOf(team.division);
      if (otherDivisionIndex === -1) continue;

      // Only count if same or lower division (higher index = lower division)
      if (otherDivisionIndex >= teamDivisionIndex) {
        for (const composition of compositions) {
          for (const player of composition.players) {
            if (player !== null) {
              eligiblePlayerIds.add(player.id);
            }
          }
        }
      }
    }

    // Check each player in current team
    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      if (!eligiblePlayerIds.has(player.id)) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'a pas joué au moins une fois dans la nationale ${teamInfo.division} ou inférieure durant la saison.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
