import { Rule, Violation } from "../../../types";

const id = "A02-3.7.c";

const rule: Rule<typeof id> = {
  id,
  description: `
  Participation dans plusieurs équipes : lorsqu'un club a plusieurs équipes engagées
  dans le championnat de France des clubs, un joueur ou une joueuse ne peut participer
  dans une équipe s'il ou elle a déjà joué trois fois dans une équipe plus forte telle
  que définie à l'article 3.7.b.
  `,
  validate(teams, tournamentState, currentTeams, teamToValidate) {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamIndex = teams.findIndex((team) => team.id === teamToValidate);
    if (!teamPlayers || teamIndex === -1) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const strongerTeams = teams.slice(0, teamIndex);

    const violations: Violation[] = [];

    for (const [index, player] of teamPlayers.entries()) {
      if (player === null) {
        continue;
      }

      let appearancesInStrongerTeams = 0;
      for (const strongerTeam of strongerTeams) {
        const history = tournamentState.history[strongerTeam.id];
        if (!history) {
          continue;
        }

        for (const pastComposition of history) {
          if (pastComposition.players.some((p) => p !== null && p.id === player.id)) {
            appearancesInStrongerTeams++;
          }
        }
      }

      if (appearancesInStrongerTeams >= 3) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: index + 1,
          message: `Le joueur ${player.name} (ID: ${player.id}) a déjà joué ${appearancesInStrongerTeams} fois dans des équipes plus fortes et ne peut pas jouer dans cette équipe.`,
        });
      }
    }

    return violations;
  },
};

export default rule;
