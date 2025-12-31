import { validateTeams } from "vie";
import { ChampionnatDeFranceDesClubs } from "vie/rules/FFE/A02_Championnat_france_clubs/index";

// TODO: temporary content
const tournamentState = {
  teams: [
    {
      id: "team-1",
      name: "Team 1",
      ruleset: ChampionnatDeFranceDesClubs,
      hasAtLeast60Minutes: true,
      clubs: ["club"],
      division: "N3",
      groupId: "group-1",
    },
  ],
  history: {},
};

const currentTeams = [
  {
    teamId: "team-1",
    date: "2024-10-01",
    players: [
      {
        id: "player-1",
        name: "Alice",
        rating: 1800,
        federation: "FRA",
        licenseType: "A",
        club: "club",
      },
    ],
  },
];
const violations = validateTeams(tournamentState, currentTeams);

console.log("Violations found:", violations);

const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    <h1>VIE - Vérification Informatique des Équipes</h1>
  `;
}
