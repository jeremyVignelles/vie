import { Player, Rule, Team } from "../../../types";

export interface PlayerWithLicenseAndClub extends Player {
  /**
   * Le type de licence du joueur, A ou B, ou N si non licencié
   */
  licenseType: string;

  /**
   * L'identifiant du club du joueur
   */
  club: string;
}

export interface TeamWithClub extends Team {
  /**
   * Le ou les clubs (en cas d'entente) qui composent l'équipe
   */
  clubs: string[];
}

const id = "R01-1.1";

const rule: Rule<typeof id, PlayerWithLicenseAndClub, TeamWithClub> = {
  id,
  description: `Les joueurs et joueuses doivent être licenciés pour la saison en cours
  et ne peuvent jouer que pour le compte d'un seul club dans lequel ils sont licenciés.`,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams[teamToValidate];
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations = [];
    for (const [index, player] of teamPlayers.entries()) {
      if (player.licenseType === "N") {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'a pas de licence pour la saison en cours.`,
        });
      }

      if (!teamInfo.clubs.includes(player.club)) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) ne fait pas partie du club de l'équipe.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
