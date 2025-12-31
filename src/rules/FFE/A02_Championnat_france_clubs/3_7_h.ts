import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.h";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  Nationalité étrangère : au moins cinq des joueurs ou joueuses composant une équipe
  doivent posséder la nationalité française ou être ressortissants de l'Union Européenne
  résidant en France, ou extracommunautaires résidant en France depuis 5 ans.
  Cette exigence est ramenée à 4 personnes s'il y a un maximum de 6 personnes inscrites sur le PV.
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];

    // Count non-null players
    const nonNullPlayers = teamPlayers.filter((p) => p !== null);
    const totalPlayers = nonNullPlayers.length;

    // Determine the min qualified players required
    const minQualified = totalPlayers <= 6 ? 4 : 5;

    // Count qualified players and track foreign players
    let foreignCount = 0;
    let firstViolationIndex = -1;

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      // Check if player is qualified (french, eu resident, or long-term resident)
      const isQualified =
        player.isFrench === true ||
        player.residesInEU === true ||
        player.longTermResident === true;

      if (!isQualified) {
        foreignCount++;
        // Track when we exceed the allowed foreign count
        const maxForeign = totalPlayers - minQualified;
        if (foreignCount > maxForeign && firstViolationIndex === -1) {
          firstViolationIndex = index;
        }
      }
    }

    // If we don't have enough qualified players, sanction from the first violating board onwards
    if (firstViolationIndex !== -1) {
      for (let i = firstViolationIndex; i < teamPlayers.length; i++) {
        if (teamPlayers[i] !== null) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: i + 1,
            message: `Le joueur ${teamPlayers[i]!.name} (ID: ${teamPlayers[i]!.id}) est sanctionné car l'équipe n'a pas au moins ${minQualified} joueurs avec nationalité française/UE/résident long terme.`,
          });
        }
      }
    }

    return violations;
  },
};

export default rule;
