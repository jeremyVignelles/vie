import {
  validateTeams,
  makeCombinedSchemaForRulesets,
  TeamInfoWithRuleset,
  TournamentStateOf,
  TeamCompositionOf,
} from "vie";
import { ChampionnatDeFranceDesClubs } from "vie/rules/FFE/A02_Championnat_france_clubs/index";
import { InterclubsCVL } from "vie/rules/FFE/CVL/index";

// TODO: temporary content
const schemas = [ChampionnatDeFranceDesClubs, InterclubsCVL];
const combinedSchema = makeCombinedSchemaForRulesets(...schemas);
console.log("Combined player schema:", combinedSchema.player.toJSONSchema());
type rulesets = (typeof schemas)[number];
const teams: TeamInfoWithRuleset<rulesets>[] = [
  {
    id: "team-1",
    name: "Team 1",
    ruleset: ChampionnatDeFranceDesClubs,
    hasAtLeast60Minutes: true,
    clubs: ["club"],
    division: "N3",
    groupId: "group-1",
  },
  {
    id: "team-2",
    name: "Team 2",
    ruleset: InterclubsCVL,
    hasAtLeast60Minutes: true,
    clubs: ["club"],
    division: "R1",
    groupId: "group-1",
  },
];

const tournamentState: TournamentStateOf<rulesets> = {
  history: {
    "team-1": [
      {
        teamId: "team-1",
        date: "2024-10-01",
        arbiter: null,
        players: [
          {
            id: "player-1",
            name: "Alice",
            gender: "F",
            rating: 1800,
            federation: "FRA",
            licenseType: "A",
            club: "club",
          },
        ],
      },
    ],
    "team-2": [
      {
        teamId: "team-2",
        date: "2024-10-01",
        arbiter: null,
        players: [
          {
            id: "player-2",
            name: "Bob",
            gender: "M",
            rating: 2000,
            federation: "FRA",
            licenseType: "A",
            club: "club",
          },
        ],
      },
    ],
  },
};

const currentTeams: TeamCompositionOf<rulesets>[] = [
  {
    teamId: "team-1",
    date: "2024-11-01",
    arbiter: null,
    players: [
      {
        id: "player-1",
        name: "Alice",
        gender: "F",
        rating: 1800,
        federation: "FRA",
        licenseType: "A",
        club: "club",
      },
    ],
  },
  {
    teamId: "team-2",
    date: "2024-11-01",
    arbiter: null,
    players: [
      {
        id: "player-2",
        name: "Bob",
        gender: "M",
        rating: 2000,
        federation: "FRA",
        licenseType: "A",
        club: "club",
      },
    ],
  },
];
const violations = validateTeams(teams, tournamentState, currentTeams);

console.log("Violations found:", violations);

const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    <h1>VIE - Vérification Informatique des Équipes</h1>
  `;
}
