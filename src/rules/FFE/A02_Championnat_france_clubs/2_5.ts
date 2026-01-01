import { Rule, Violation } from "../../../types";
import { ArbiterFFE } from "../R01_Regles_generales/types";
import {
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  TeamCompositionChampionnatFranceClub,
} from "./types";

const id = "A02-2.5";

const rule: Rule<
  typeof id,
  PlayerChampionnatFranceClub,
  TeamChampionnatFranceClub,
  ArbiterFFE,
  TeamCompositionChampionnatFranceClub
> = {
  id,
  description: `
  En Top 16, la direction de Nationale désigne les arbitres fédéraux après avis de la Direction Nationale de l'Arbitrage.
  En N1, N2, N3 et N4, les matchs sont dirigés par une ou un arbitre fédéral Elite, d'Open ou de Club. La personne
  responsable de la rencontre est chargée de désigner l'arbitre. En N4, une demande de dérogation est possible par les
  Ligues.
  L'arbitre en N1 et N2 ne peut pas être joueur/joueuse, même dans une autre division.
  En N3, l'arbitre d'un seul match ne peut jouer que dans ce même match.
  En N4, l'arbitre peut jouer son match de N4 et officier dans un maximum de 2 matches de N4 et de division inférieure.
  `,
  validate(tournamentState, currentTeams, teamToValidate) {
    const teamInfo = tournamentState.teams.find((team) => team.id === teamToValidate);
    const currentComposition = currentTeams.find((team) => team.teamId === teamToValidate);

    if (!teamInfo || !currentComposition) {
      throw new Error(`Équipe avec l'identifiant ${teamToValidate} non trouvée.`);
    }

    const violations: Violation[] = [];
    const arbiter = currentComposition.arbiter;

    // Pas d'arbitre désigné
    if (!arbiter) {
      return [
        {
          ruleId: id,
          teamId: teamToValidate,
          boardNumber: null,
          message: `Aucun arbitre n'est sélectionné pour l'équipe ${teamToValidate}.`,
        },
      ];
    }

    // Vérifier que l'arbitre a un titre fédéral Elite, Open ou Club
    const validTitles = ["AFC", "AFO1", "AFO2", "AFE1", "AFE2", "AF", "AI"];
    if (!validTitles.includes(arbiter.arbiterTitle)) {
      violations.push({
        ruleId: id,
        teamId: teamToValidate,
        boardNumber: null,
        message: `L'arbitre ${arbiter.name} doit être arbitre fédéral Elite, d'Open ou de Club (titre actuel: ${arbiter.arbiterTitle}).`,
      });
    }

    const arbiterPlaysInTeam = currentTeams.filter((t) =>
      t.players.some((p) => p?.id === arbiter.id),
    )[0];
    if (arbiterPlaysInTeam) {
      const division = tournamentState.teams.find(
        (t) => t.id === arbiterPlaysInTeam.teamId,
      )?.division;

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
};

export default rule;
