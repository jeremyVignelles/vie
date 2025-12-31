import { Player, Rule } from "../../../types";

export interface PlayerWithLicense extends Player {
  /**
   * Le type de licence du joueur, A ou B
   */
  licenseType: string;
}

const id = "R01-1.4";

const rule: Rule<PlayerWithLicense, typeof id> = {
  id,
  description: `Pour toute compétition se jouant à une cadence supérieure ou égale à 60 min
  (ou équivalent en cadence Fischer),les joueurs et joueuses doivent être titulaires d'une
  licence A valable pour la saison en cours.`,
  validate(_tournamentState, currentTeams, teamToValidate) {
    const team = currentTeams[teamToValidate];
    if (!team) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations = [];
    for (const [index, player] of team.entries()) {
      if (player.licenseType !== "A") {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'a pas une licence de type A.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
