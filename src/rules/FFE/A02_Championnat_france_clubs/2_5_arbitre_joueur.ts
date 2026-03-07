import { makeRule, Violation } from "../../../types";
import { TeamChampionnatFranceClubSchema } from "./types";

const id = "A02-2.5-arbitre-joueur";

export default makeRule(
  id,
  `
  L'arbitre en N1 et N2 ne peut pas être joueur/joueuse, même dans une autre division.
  En N3, l'arbitre d'un seul match ne peut jouer que dans ce même match.
  En N4, l'arbitre peut jouer son match de N4 et officier dans un maximum de 2 matches de N4 et de division inférieure.
  `,
  {
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  (teams, _tournamentState, currentTeams, teamToValidate) => {
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);

    if (!teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];
    const arbiter = currentComposition.arbiter;

    // Pas d'arbitre désigné
    if (!arbiter) {
      return [];
    }

    const arbiterPlaysInTeam = currentTeams.filter((t) =>
      t.players.some((p) => p?.id === arbiter.id),
    )[0];
    if (arbiterPlaysInTeam) {
      const division = teams.find((t) => t.id === arbiterPlaysInTeam.teamId)?.division;

      if (!division) {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `Division introuvable pour l'équipe dans laquelle l'arbitre ${arbiter.name} joue (${arbiterPlaysInTeam.teamId}).`,
        });
      }

      if (division === "N1" || division === "N2") {
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `En ${division}, l'arbitre ${arbiter.name} ne peut pas être joueur/joueuse, même dans une autre division.`,
        });
      }

      if (division === "N3" && arbiterPlaysInTeam.teamId !== teamToValidate) {
        // Règle N3 : l'arbitre d'un seul match ne peut jouer que dans ce même match
        violations.push({
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `En N3, l'arbitre ${arbiter.name} ne peut jouer que dans le match qu'il/elle arbitre.`,
        });
      }

      if (division === "N4") {
        // Règle N4 : l'arbitre peut jouer son match et arbitrer max 2 matches de N4 et division inférieure
        const higherDivisions = ["N3", "N2", "N1", "T16"];

        if (higherDivisions.includes(teamInfo.division)) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: null,
            message: `S'il joue en N4, l'arbitre ${arbiter.name} ne peut pas jouer dans une division supérieure (${teamInfo.division}).`,
          });
        }

        const arbitratedMatchesCount = currentTeams.filter(
          (t) => t.arbiter?.id === arbiter.id,
        ).length;
        if (arbitratedMatchesCount > 2) {
          violations.push({
            ruleId: id,
            teamId: teamToValidate,
            boardNumber: null,
            message: `En N4, l'arbitre ${arbiter.name} ne peut arbitrer que 2 matches au maximum (actuellement: ${arbitratedMatchesCount}).`,
          });
        }
      }
    }

    return violations;
  },
);
