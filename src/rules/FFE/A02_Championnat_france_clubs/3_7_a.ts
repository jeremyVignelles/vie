import { Rule, Violation } from "../../../types";
import { PlayerChampionnatFranceClub, TeamChampionnatFranceClub } from "./types";

const id = "A02-3.7.a";

const rule: Rule<typeof id, PlayerChampionnatFranceClub, TeamChampionnatFranceClub> = {
  id,
  description: `
  • En Top 16, une liste de 16 joueurs/joueuses
  doit
  être transmise à la Direction du Top 16 [...]. Les membres
  de la liste doivent, à l’exception des joueuses françaises, avoir un classement
  Elo de 2000 minimum au moment du dépôt de la liste.
  Tout joueur ou joueuse ne figurant pas sur cette liste ne pourra pas jouer en Top 16.
  • Pour disputer un match du Top 16, aucun Elo minimum n'est requis
  pour la joueuse française obligatoire. Lorsqu'une équipe aligne,
  pour une même rencontre, plusieurs joueuses françaises, seule celle ayant le
  meilleur classement Elo est considérée comme la joueuse obligatoire.
  Les autres, si elles ont un Elo inférieur à 2000, seront sanctionnées
  d'un forfait administratif.`,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    if (teamInfo.division !== "T16") {
      return [];
    }

    const violations: Violation[] = [];

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      // Check Elo requirement (all players except French females must have >= 2000)
      if (!(player.gender === "F" && player.isFrench) && player.rating < 2000) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) n'a pas le classement Elo minimum requis de 2000 pour figurer sur la liste du Top 16.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
