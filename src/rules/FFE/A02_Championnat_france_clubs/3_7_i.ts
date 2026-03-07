import { makeRule, Violation } from "../../../types";
import { PlayerChampionnatFranceClubSchema, TeamChampionnatFranceClubSchema } from "./types";

const id = "A02-3.7.i";

export default makeRule(
  id,
  `
  Nationalité française : en Top 16, N1, et N2, chaque équipe doit inscrire sur la feuille
  de match au moins un joueur français et au moins une joueuse française.
  `,
  {
    player: PlayerChampionnatFranceClubSchema,
    teamInfo: TeamChampionnatFranceClubSchema,
  },
  (teams, _tournamentState, currentTeams, teamToValidate) => {
    const teamPlayers = currentTeams.find((team) => team.teamId === teamToValidate)?.players;
    const teamInfo = teams.find((team) => team.id === teamToValidate);
    if (!teamPlayers || !teamInfo) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    // Only applies to T16, N1, N2
    if (!["T16", "N1", "N2"].includes(teamInfo.division)) {
      return [];
    }

    const violations: Violation[] = [];

    let hasFrenchMale = false;
    let hasFrenchFemale = false;

    for (const player of teamPlayers) {
      if (player === null) {
        continue;
      }

      if (player.isFrench === true) {
        if (player.gender === "M") {
          hasFrenchMale = true;
        } else if (player.gender === "F") {
          hasFrenchFemale = true;
        }
      }
    }

    // Team violations if missing required French players
    if (!hasFrenchMale) {
      violations.push({
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe doit comporter au moins un joueur de nationalité française.`,
      });
    }

    if (!hasFrenchFemale) {
      violations.push({
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'équipe doit comporter au moins une joueuse de nationalité française.`,
      });
    }

    return violations;
  },
);
