import { Player, Rule } from "../../../types";

export interface PlayerWithFederation extends Player {
  /**
   * La fédération du joueur
   */
  federation: string;
}

const id = "R01-1.5";

const rule: Rule<typeof id, PlayerWithFederation> = {
  id,
  description: `À partir du 30 mars 2022, les joueurs et joueuses
  évoluant auprès de la FIDE avec le code RUS ou BLR (Russie et Biélorussie),
  ne sont pas autorisés à participer aux compétitions par équipes
  ou individuelles homologuées par la FFE.`,

  validate(_tournamentState, currentTeams, teamToValidate) {
    const team = currentTeams[teamToValidate];
    if (!team) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations = [];
    for (const [index, player] of team.entries()) {
      if (player.federation === "RUS" || player.federation === "BLR") {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'est pas autorisé à participer en raison de sa fédération.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
