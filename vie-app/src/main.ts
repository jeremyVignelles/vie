import { validateTeams } from "vie";
import { N4 } from "vie/rules/FFE/A02_Championnat_france_clubs/index";

// TODO: temporary content
const tournamentState = {
  teams: [
    {
      id: "team-1",
      name: "Team 1",
      ruleset: N4,
      hasAtLeast60Minutes: true,
      clubs: ["club"],
    },
  ],
  history: {},
};

const currentTeams = {
  "team-1": [
    {
      id: "player-1",
      name: "Alice",
      rating: 1800,
      federation: "FRA",
      licenseType: "A",
      club: "club",
    },
  ],
};
const violations = validateTeams(tournamentState, currentTeams);

console.log("Violations found:", violations);

const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    <h1>VIE - Vérification Informatique des Équipes</h1>
  `;
}
